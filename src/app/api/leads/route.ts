import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = {
  id: string;
  createdAt: string;
  source: string;
  name: string;
  phone: string;
  city: string;
  projectType: string;
  monthlyBill: string;
  phase: string;
  roofArea: string;
  need: string;
  billImageName: string;
  roofImageName: string;
  note: string;
  pageUrl?: string;
};

type LeadFile = {
  field: "billImage" | "roofImage" | "chatImage";
  label: string;
  file: File;
};

type DeliveryResult = {
  channel: "telegram" | "google-sheet";
  status: "sent" | "skipped" | "failed";
  message: string;
};

export async function POST(request: NextRequest) {
  try {
    const { lead, files } = await parseLeadRequest(request);
    const results: DeliveryResult[] = [];

    results.push(await deliverToTelegram(lead, files));
    results.push(await deliverToGoogleSheet(lead, files));

    const configured = results.some((result) => result.status !== "skipped");
    const delivered = results.some((result) => result.status === "sent");
    const failed = results.some((result) => result.status === "failed");

    return NextResponse.json(
      {
        ok: delivered,
        configured,
        results,
      },
      { status: delivered || !configured || !failed ? 200 : 502 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        error: error instanceof Error ? error.message : "Không xử lý được lead.",
      },
      { status: 400 },
    );
  }
}

async function parseLeadRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const billImage = formData.get("billImage");
    const roofImage = formData.get("roofImage");
    const chatImages = formData.getAll("chatImages");
    const files: LeadFile[] = [];

    if (isUsableFile(billImage)) {
      files.push({ field: "billImage", label: "Ảnh hóa đơn điện", file: billImage });
    }

    if (isUsableFile(roofImage)) {
      files.push({ field: "roofImage", label: "Ảnh mái nhà", file: roofImage });
    }

    chatImages.forEach((file, index) => {
      if (isUsableFile(file)) {
        files.push({
          field: "chatImage",
          label: `Ảnh khách gửi qua chat ${index + 1}`,
          file,
        });
      }
    });

    const chatImageNames = files
      .filter((item) => item.field === "chatImage")
      .map((item) => item.file.name)
      .join(", ");

    return {
      lead: normalizeLead({
        id: getFormValue(formData, "id"),
        createdAt: getFormValue(formData, "createdAt"),
        source: getFormValue(formData, "source") || "Form tư vấn",
        name: getFormValue(formData, "name"),
        phone: getFormValue(formData, "phone"),
        city: getFormValue(formData, "city"),
        projectType: getFormValue(formData, "projectType"),
        monthlyBill: getFormValue(formData, "monthlyBill"),
        phase: getFormValue(formData, "phase"),
        roofArea: getFormValue(formData, "roofArea"),
        need: getFormValue(formData, "need"),
        billImageName: files.find((item) => item.field === "billImage")?.file.name ?? chatImageNames,
        roofImageName: files.find((item) => item.field === "roofImage")?.file.name ?? "",
        note: getFormValue(formData, "note"),
        pageUrl: getFormValue(formData, "pageUrl"),
      }),
      files,
    };
  }

  const body = await request.json();
  const lead = normalizeLead(body.lead ?? body);

  return {
    lead,
    files: [] as LeadFile[],
  };
}

function normalizeLead(input: Partial<LeadPayload>): LeadPayload {
  return {
    id: stringOrDefault(input.id, crypto.randomUUID()),
    createdAt: stringOrDefault(input.createdAt, new Date().toISOString()),
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

async function deliverToTelegram(lead: LeadPayload, files: LeadFile[]): Promise<DeliveryResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return {
      channel: "telegram",
      status: "skipped",
      message: "Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID.",
    };
  }

  try {
    await telegramFetch(botToken, "sendMessage", {
      chat_id: chatId,
      text: buildTelegramMessage(lead),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });

    for (const item of files) {
      if (item.file.size > 8 * 1024 * 1024) {
        continue;
      }

      const formData = new FormData();
      formData.set("chat_id", chatId);
      formData.set("caption", `${item.label}: ${item.file.name}`);
      formData.set("document", item.file, item.file.name);

      await telegramFetch(botToken, "sendDocument", formData);
    }

    return {
      channel: "telegram",
      status: "sent",
      message: "Đã gửi Telegram.",
    };
  } catch (error) {
    return {
      channel: "telegram",
      status: "failed",
      message: error instanceof Error ? error.message : "Không gửi được Telegram.",
    };
  }
}

async function deliverToGoogleSheet(
  lead: LeadPayload,
  files: LeadFile[],
): Promise<DeliveryResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      channel: "google-sheet",
      status: "skipped",
      message: "Chưa cấu hình GOOGLE_SHEET_WEBHOOK_URL.",
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEET_WEBHOOK_SECRET ?? "",
        lead,
        files: files.map((item) => ({
          field: item.field,
          label: item.label,
          name: item.file.name,
          type: item.file.type,
          size: item.file.size,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(await safeResponseText(response));
    }

    return {
      channel: "google-sheet",
      status: "sent",
      message: "Đã ghi Google Sheet.",
    };
  } catch (error) {
    return {
      channel: "google-sheet",
      status: "failed",
      message: error instanceof Error ? error.message : "Không ghi được Google Sheet.",
    };
  }
}

async function telegramFetch(botToken: string, method: string, payload: unknown) {
  const isFormData = payload instanceof FormData;
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json; charset=utf-8" },
    body: isFormData ? payload : JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await safeResponseText(response));
  }

  const data = (await response.json()) as { ok?: boolean; description?: string };

  if (!data.ok) {
    throw new Error(data.description ?? "Telegram trả về lỗi.");
  }

  return data;
}

function buildTelegramMessage(lead: LeadPayload) {
  const brandName = process.env.LEAD_NOTIFY_FROM_NAME ?? "Điện mặt trời Sơn Hà";
  const lines = [
    `<b>Lead mới - ${escapeHtml(brandName)}</b>`,
    `Nguồn: ${escapeHtml(lead.source)}`,
    `Tên: ${escapeHtml(lead.name)}`,
    `SĐT/Zalo: ${escapeHtml(lead.phone)}`,
    `Tỉnh/thành: ${escapeHtml(lead.city || "Chưa rõ")}`,
    `Công trình: ${escapeHtml(lead.projectType)}`,
    `Tiền điện: ${escapeHtml(lead.monthlyBill)}`,
    `Điện: ${escapeHtml(lead.phase)}`,
    `Diện tích mái: ${escapeHtml(lead.roofArea)}`,
    `Nhu cầu: ${escapeHtml(lead.need)}`,
  ];

  if (lead.billImageName) lines.push(`Ảnh hóa đơn/chat: ${escapeHtml(lead.billImageName)}`);
  if (lead.roofImageName) lines.push(`Ảnh mái: ${escapeHtml(lead.roofImageName)}`);
  if (lead.note) lines.push(`Ghi chú: ${escapeHtml(lead.note)}`);
  if (lead.pageUrl) lines.push(`Trang gửi: ${escapeHtml(lead.pageUrl)}`);

  return lines.join("\n");
}

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isUsableFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

function stringOrDefault(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function safeResponseText(response: Response) {
  const text = await response.text();
  return text || `${response.status} ${response.statusText}`;
}
