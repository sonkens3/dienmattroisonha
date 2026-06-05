/* eslint-disable @typescript-eslint/no-unused-vars */

const LEADS_SHEET_NAME = "Leads";
const PROJECTS_SHEET_NAME = "Projects";
const DEFAULT_NOTIFY_NAME = "Điện mặt trời Sơn Hà";
const MAX_TELEGRAM_FILE_SIZE = 8 * 1024 * 1024;
const MAX_PROJECT_FILE_SIZE = 12 * 1024 * 1024;

function doGet(e) {
  try {
    const action = getParam(e, "action");

    if (action === "projects") {
      return jsonResponse({
        ok: true,
        projects: listProjects(),
      });
    }

    return jsonResponse({
      ok: true,
      service: "Son Ha Solar webhook",
      actions: ["projects", "lead", "saveProject", "deleteProject"],
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: errorToMessage(error),
    });
  }
}

function doPost(e) {
  try {
    const payload = parsePayload(e);
    const action = payload.action || (payload.lead ? "lead" : "");

    if (action === "saveProject") {
      requireProjectAdminToken(payload.adminToken);
      return jsonResponse({
        ok: true,
        project: saveProject(payload.project || {}, payload.files || []),
      });
    }

    if (action === "deleteProject") {
      requireProjectAdminToken(payload.adminToken);
      deleteProject(String(payload.id || ""));
      return jsonResponse({
        ok: true,
      });
    }

    return handleLead(payload);
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: errorToMessage(error),
    });
  }
}

function testTelegramAuthorization() {
  const token = getScriptProperty("TELEGRAM_BOT_TOKEN");
  const chatId = getScriptProperty("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    throw new Error("Chưa có TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong Script Properties.");
  }

  postTelegram(token, "sendMessage", {
    chat_id: chatId,
    text: "Test Telegram từ Google Apps Script - Điện mặt trời Sơn Hà",
  });
}

function authorizeProjectDrive() {
  const folder = getProjectMediaFolder();
  const testFile = folder.createFile(
    "son-ha-solar-drive-auth-test.txt",
    "Nếu thấy file này trong thùng rác thì Apps Script đã được cấp quyền ghi Drive.",
    MimeType.PLAIN_TEXT
  );

  testFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  testFile.setTrashed(true);

  return "Đã cấp quyền ghi Google Drive cho Apps Script.";
}

function handleLead(payload) {
  const webhookSecret = getScriptProperty("GOOGLE_SHEET_WEBHOOK_SECRET");

  if (webhookSecret && payload.secret !== webhookSecret) {
    return jsonResponse({ ok: false, error: "Invalid secret" });
  }

  const lead = normalizeLead(payload.lead || {});
  const files = Array.isArray(payload.files) ? payload.files : [];
  const sheetResult = appendLeadToSheet(lead, files);
  const telegramResult = safeSendLeadToTelegram(lead, files);

  return jsonResponse({
    ok: sheetResult.status === "sent" || telegramResult.status === "sent",
    results: [sheetResult, telegramResult],
  });
}

function listProjects() {
  const sheet = getProjectSheet();
  const values = sheet.getDataRange().getValues();
  const projects = [];

  for (let index = 1; index < values.length; index += 1) {
    const row = values[index];
    const status = String(row[4] || "active");

    if (status !== "active") continue;

    try {
      const project = JSON.parse(String(row[3] || "{}"));
      const normalizedProject = normalizeProject(project);
      if (normalizedProject.id) projects.push(normalizedProject);
    } catch {
      // Skip broken rows so one bad edit does not break the whole website.
    }
  }

  projects.sort(function (a, b) {
    return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
  });

  return projects;
}

function saveProject(input, files) {
  const sheet = getProjectSheet();
  const now = new Date().toISOString();
  const project = normalizeProject(input);

  if (!project.id || !project.title) {
    throw new Error("Thiếu tên công trình hoặc mã dự án.");
  }

  project.updatedAt = now;
  if (!project.createdAt) project.createdAt = now;

  uploadProjectFiles(project, Array.isArray(files) ? files : []);

  const existingRow = findProjectRow(sheet, project.id);
  const row = [
    project.id,
    project.baseProjectId || "",
    project.title,
    JSON.stringify(project),
    "active",
    project.createdAt,
    project.updatedAt,
  ];

  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return project;
}

function deleteProject(id) {
  if (!id) throw new Error("Thiếu mã dự án cần xóa.");

  const sheet = getProjectSheet();
  const existingRow = findProjectRow(sheet, id);

  if (!existingRow) return;

  sheet.getRange(existingRow, 5).setValue("deleted");
  sheet.getRange(existingRow, 7).setValue(new Date().toISOString());
}

function uploadProjectFiles(project, files) {
  if (!files.length) return;

  const folder = getProjectMediaFolder();

  files.forEach(function (file) {
    if (!file || !file.dataBase64) return;

    const fileSize = Number(file.size || 0);
    if (fileSize > MAX_PROJECT_FILE_SIZE) {
      throw new Error("File " + (file.name || "") + " lớn hơn 12MB. Hãy nén file rồi upload lại.");
    }

    const contentType = String(file.type || "application/octet-stream");
    const bytes = Utilities.base64Decode(String(file.dataBase64));
    const blob = Utilities.newBlob(bytes, contentType, String(file.name || "project-file"));
    const driveFile = createProjectDriveFile(folder, blob);

    const fileInfo = buildDriveFileInfo(driveFile, contentType);

    if (file.field === "image") {
      project.image = fileInfo.imageUrl || fileInfo.viewUrl;
      return;
    }

    if (file.field === "video") {
      project.video = fileInfo.viewUrl;
      return;
    }

    if (file.field === "gallery") {
      const media = findOrCreateProjectMedia(project, String(file.targetId || ""), contentType, file.name);
      media.type = contentType.indexOf("video/") === 0 ? "video" : "image";
      media.url = media.type === "image" ? fileInfo.imageUrl : fileInfo.viewUrl;
      media.driveFileId = fileInfo.id;
      media.viewUrl = fileInfo.viewUrl;
    }
  });
}

function createProjectDriveFile(folder, blob) {
  try {
    const driveFile = folder.createFile(blob);
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return driveFile;
  } catch (error) {
    throw new Error(
      "Apps Script chưa được cấp quyền ghi Google Drive. Trong Apps Script hãy chọn hàm authorizeProjectDrive, bấm Run, cấp quyền Drive, sau đó Deploy > New version. Chi tiết: " +
        errorToMessage(error)
    );
  }
}

function findOrCreateProjectMedia(project, targetId, contentType, fileName) {
  if (!Array.isArray(project.gallery)) project.gallery = [];

  let media = project.gallery.find(function (item) {
    return item && item.id === targetId;
  });

  if (!media) {
    media = {
      id: targetId || "media-" + Date.now(),
      type: contentType.indexOf("video/") === 0 ? "video" : "image",
      url: "",
      caption: fileName || "Ảnh/video công trình",
      description: "",
    };
    project.gallery.push(media);
  }

  return media;
}

function buildDriveFileInfo(file, contentType) {
  const id = file.getId();
  const viewUrl = "https://drive.google.com/file/d/" + id + "/view";
  const imageUrl = contentType.indexOf("image/") === 0
    ? "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600"
    : "";

  return {
    id: id,
    viewUrl: viewUrl,
    imageUrl: imageUrl,
  };
}

function getProjectMediaFolder() {
  const configuredFolderId = getScriptProperty("PROJECT_MEDIA_FOLDER_ID");

  if (!configuredFolderId) {
    throw new Error("Chưa cấu hình PROJECT_MEDIA_FOLDER_ID trong Script Properties. Hãy tạo folder Google Drive để lưu ảnh/video công trình, copy ID folder rồi thêm vào Script Properties.");
  }

  return DriveApp.getFolderById(configuredFolderId);
}

function getProjectSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(PROJECTS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(PROJECTS_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Project ID",
      "Base Project ID",
      "Title",
      "Project JSON",
      "Status",
      "Created At",
      "Updated At",
    ]);
  }

  return sheet;
}

function findProjectRow(sheet, id) {
  const values = sheet.getDataRange().getValues();

  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][0] || "") === id) return index + 1;
  }

  return 0;
}

function normalizeProject(input) {
  const details = Array.isArray(input.details)
    ? input.details.map(function (item) { return String(item || "").trim(); }).filter(Boolean)
    : [];
  const gallery = Array.isArray(input.gallery)
    ? input.gallery.map(normalizeProjectMedia).filter(function (item) { return Boolean(item); })
    : [];

  return {
    id: stringOrDefault(input.id, ""),
    source: "remote",
    baseProjectId: stringOrDefault(input.baseProjectId, ""),
    createdAt: stringOrDefault(input.createdAt, ""),
    updatedAt: stringOrDefault(input.updatedAt, ""),
    title: stringOrDefault(input.title, ""),
    location: stringOrDefault(input.location, "Chưa cập nhật"),
    type: stringOrDefault(input.type, "Nhà dân"),
    monthlyBill: stringOrDefault(input.monthlyBill, "Chưa cập nhật"),
    systemSize: stringOrDefault(input.systemSize, "Chưa cập nhật"),
    panels: stringOrDefault(input.panels, "Theo phương án"),
    inverter: stringOrDefault(input.inverter, "Theo phương án"),
    estimatedOutput: stringOrDefault(input.estimatedOutput, "Theo khảo sát"),
    payback: stringOrDefault(input.payback, "Từ 3 năm"),
    cost: stringOrDefault(input.cost, "Theo khảo sát"),
    hasStorage: Boolean(input.hasStorage),
    image: stringOrDefault(
      input.image,
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
    ),
    video: stringOrDefault(input.video, ""),
    gallery: gallery,
    summary: stringOrDefault(
      input.summary,
      "Công trình thực tế do Điện mặt trời Sơn Hà khảo sát, thiết kế và thi công."
    ),
    details: details.length ? details : [
      "Khảo sát mái, hướng nắng, bóng che và vị trí đi dây.",
      "Tính công suất theo hóa đơn điện và nhu cầu sử dụng thực tế.",
      "Bàn giao app theo dõi sản lượng sau khi vận hành.",
    ],
  };
}

function normalizeProjectMedia(input) {
  if (!input) return null;

  return {
    id: stringOrDefault(input.id, "media-" + Date.now()),
    type: input.type === "video" ? "video" : "image",
    url: stringOrDefault(input.url, ""),
    caption: stringOrDefault(input.caption, input.type === "video" ? "Video công trình" : "Ảnh công trình"),
    description: stringOrDefault(input.description, ""),
    driveFileId: stringOrDefault(input.driveFileId, ""),
    viewUrl: stringOrDefault(input.viewUrl, ""),
  };
}

function requireProjectAdminToken(inputToken) {
  const expectedToken = getScriptProperty("PROJECT_ADMIN_TOKEN");

  if (!expectedToken) {
    throw new Error("Chưa cấu hình PROJECT_ADMIN_TOKEN trong Script Properties.");
  }

  if (String(inputToken || "") !== expectedToken) {
    throw new Error("Mã đồng bộ admin không đúng.");
  }
}

function safeSendLeadToTelegram(lead, files) {
  try {
    return sendLeadToTelegram(lead, files);
  } catch (error) {
    return {
      channel: "telegram",
      status: "failed",
      message: errorToMessage(error),
    };
  }
}

function appendLeadToSheet(lead, files) {
  const sheet = getLeadSheet();

  sheet.appendRow([
    new Date(),
    lead.source,
    lead.name,
    lead.phone,
    lead.city,
    lead.projectType,
    lead.monthlyBill,
    lead.phase,
    lead.roofArea,
    lead.need,
    lead.billImageName || findFileNames(files, "billImage"),
    lead.roofImageName || findFileNames(files, "roofImage"),
    findFileNames(files, "chatImage"),
    lead.note,
    lead.pageUrl,
    lead.id,
  ]);

  return {
    channel: "google-sheet",
    status: "sent",
  };
}

function sendLeadToTelegram(lead, files) {
  const token = getScriptProperty("TELEGRAM_BOT_TOKEN");
  const chatId = getScriptProperty("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    return {
      channel: "telegram",
      status: "skipped",
      message: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in Script Properties.",
    };
  }

  postTelegram(token, "sendMessage", {
    chat_id: chatId,
    text: buildTelegramMessage(lead, files),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  files.forEach(function (file) {
    if (!file || !file.dataBase64 || Number(file.size || 0) > MAX_TELEGRAM_FILE_SIZE) {
      return;
    }

    const blob = Utilities.newBlob(
      Utilities.base64Decode(file.dataBase64),
      file.type || "application/octet-stream",
      file.name || "lead-file"
    );

    postTelegram(token, "sendDocument", {
      chat_id: chatId,
      caption: (file.label || "File khách gửi") + ": " + (file.name || ""),
      document: blob,
    });
  });

  return {
    channel: "telegram",
    status: "sent",
  };
}

function getLeadSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(LEADS_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Thời gian",
      "Nguồn",
      "Họ tên",
      "SĐT/Zalo",
      "Tỉnh/thành",
      "Loại công trình",
      "Tiền điện",
      "Điện",
      "Diện tích mái",
      "Nhu cầu",
      "Tên file hóa đơn",
      "Tên file mái",
      "Tên file ảnh chat",
      "Ghi chú",
      "Trang gửi",
      "Lead ID",
    ]);
  }

  return sheet;
}

function normalizeLead(input) {
  return {
    id: stringOrDefault(input.id, ""),
    createdAt: stringOrDefault(input.createdAt, ""),
    source: stringOrDefault(input.source, "Website"),
    name: stringOrDefault(input.name, "Khách chưa nhập tên"),
    phone: stringOrDefault(input.phone, ""),
    city: stringOrDefault(input.city, ""),
    projectType: stringOrDefault(input.projectType, "Chưa rõ"),
    monthlyBill: stringOrDefault(input.monthlyBill, "Chưa rõ"),
    phase: stringOrDefault(input.phase, "Chưa rõ"),
    roofArea: stringOrDefault(input.roofArea, "Chưa rõ"),
    need: stringOrDefault(input.need, "Chưa rõ"),
    billImageName: stringOrDefault(input.billImageName, ""),
    roofImageName: stringOrDefault(input.roofImageName, ""),
    note: stringOrDefault(input.note, ""),
    pageUrl: stringOrDefault(input.pageUrl, ""),
  };
}

function buildTelegramMessage(lead, files) {
  const brandName = getScriptProperty("LEAD_NOTIFY_FROM_NAME") || DEFAULT_NOTIFY_NAME;
  const lines = [
    "<b>Lead mới - " + escapeHtml(brandName) + "</b>",
    "Nguồn: " + escapeHtml(lead.source),
    "Tên: " + escapeHtml(lead.name),
    "SĐT/Zalo: " + escapeHtml(lead.phone),
    "Tỉnh/thành: " + escapeHtml(lead.city || "Chưa rõ"),
    "Công trình: " + escapeHtml(lead.projectType),
    "Tiền điện: " + escapeHtml(lead.monthlyBill),
    "Điện: " + escapeHtml(lead.phase),
    "Diện tích mái: " + escapeHtml(lead.roofArea),
    "Nhu cầu: " + escapeHtml(lead.need),
  ];

  const billFiles = lead.billImageName || findFileNames(files, "billImage");
  const roofFiles = lead.roofImageName || findFileNames(files, "roofImage");
  const chatFiles = findFileNames(files, "chatImage");

  if (billFiles) lines.push("Ảnh hóa đơn: " + escapeHtml(billFiles));
  if (roofFiles) lines.push("Ảnh mái: " + escapeHtml(roofFiles));
  if (chatFiles) lines.push("Ảnh khách gửi qua chat: " + escapeHtml(chatFiles));
  if (lead.note) lines.push("Ghi chú: " + escapeHtml(lead.note));
  if (lead.pageUrl) lines.push("Trang gửi: " + escapeHtml(lead.pageUrl));

  return lines.join("\n");
}

function postTelegram(token, method, payload) {
  const url = "https://api.telegram.org/bot" + token + "/" + method;
  const hasBlob = Object.keys(payload).some(function (key) {
    return payload[key] && typeof payload[key].getBytes === "function";
  });
  const options = hasBlob
    ? {
        method: "post",
        payload: payload,
        muteHttpExceptions: true,
      }
    : {
        method: "post",
        contentType: "application/json; charset=utf-8",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
      };
  const response = UrlFetchApp.fetch(url, options);
  const text = response.getContentText();

  if (response.getResponseCode() >= 400) {
    throw new Error(text || "Telegram request failed");
  }

  const data = JSON.parse(text || "{}");
  if (!data.ok) {
    throw new Error(data.description || "Telegram returned an error");
  }

  return data;
}

function findFileNames(files, field) {
  return files
    .filter(function (item) {
      return item && item.field === field && item.name;
    })
    .map(function (item) {
      return item.name;
    })
    .join(", ");
}

function parsePayload(e) {
  return JSON.parse((e.postData && e.postData.contents) || "{}");
}

function getParam(e, key) {
  return e && e.parameter && e.parameter[key] ? String(e.parameter[key]) : "";
}

function getScriptProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || "";
}

function stringOrDefault(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function errorToMessage(error) {
  return error && error.message ? error.message : String(error);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
