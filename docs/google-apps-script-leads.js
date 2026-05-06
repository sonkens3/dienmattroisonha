/* eslint-disable @typescript-eslint/no-unused-vars */

const SHEET_NAME = "Leads";
const WEBHOOK_SECRET = "";
const DEFAULT_NOTIFY_NAME = "Điện mặt trời Sơn Hà";
const MAX_TELEGRAM_FILE_SIZE = 8 * 1024 * 1024;

function doGet() {
  return jsonResponse({
    ok: true,
    service: "Son Ha Solar lead webhook",
  });
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

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || "{}");

    if (WEBHOOK_SECRET && payload.secret !== WEBHOOK_SECRET) {
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
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function safeSendLeadToTelegram(lead, files) {
  try {
    return sendLeadToTelegram(lead, files);
  } catch (error) {
    return {
      channel: "telegram",
      status: "failed",
      message: error instanceof Error ? error.message : String(error),
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
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
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

function getScriptProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || "";
}

function stringOrDefault(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
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
