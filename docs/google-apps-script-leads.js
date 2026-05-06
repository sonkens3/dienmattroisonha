/* eslint-disable @typescript-eslint/no-unused-vars */

const SHEET_NAME = "Leads";
const WEBHOOK_SECRET = ""; // Nếu dùng GOOGLE_SHEET_WEBHOOK_SECRET, điền cùng giá trị ở đây.

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");

    if (WEBHOOK_SECRET && payload.secret !== WEBHOOK_SECRET) {
      return jsonResponse({ ok: false, error: "Invalid secret" });
    }

    const lead = payload.lead || {};
    const files = payload.files || [];
    const sheet = getLeadSheet();

    sheet.appendRow([
      new Date(),
      lead.source || "",
      lead.name || "",
      lead.phone || "",
      lead.city || "",
      lead.projectType || "",
      lead.monthlyBill || "",
      lead.phase || "",
      lead.roofArea || "",
      lead.need || "",
      lead.billImageName || findFileName(files, "billImage"),
      lead.roofImageName || findFileName(files, "roofImage"),
      lead.note || "",
      lead.pageUrl || "",
      lead.id || "",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
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
      "Ghi chú",
      "Trang gửi",
      "Lead ID",
    ]);
  }

  return sheet;
}

function findFileName(files, field) {
  const file = files.find((item) => item.field === field);
  return file ? file.name : "";
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
