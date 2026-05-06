export const LEAD_STORAGE_KEY = "minh-solar-leads";
const DEFAULT_LEAD_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzTXqxrjxvuB8DUe-nj4E2DxqH4zOvIu2ZPh-fUOFT-XN4NyZX5QIwimPGnu0gEbUY/exec";
const MAX_DIRECT_FILE_SIZE = 8 * 1024 * 1024;

const configuredLeadWebhookUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL?.trim();
const publicLeadWebhookUrl = configuredLeadWebhookUrl || DEFAULT_LEAD_WEBHOOK_URL;

export type LeadRecord = {
  id: string;
  createdAt: string;
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
};

export type LeadFileInput = {
  field: "billImage" | "roofImage" | "chatImage";
  label: string;
  file: File;
};

export type LeadSubmitResult = {
  ok?: boolean;
  configured?: boolean;
  mode: "apps-script" | "next-api";
  opaque?: boolean;
};

export function loadLeadsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) ?? "[]") as LeadRecord[];
  } catch {
    return [];
  }
}

export function saveLeadToStorage(lead: LeadRecord) {
  const current = loadLeadsFromStorage();
  localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify([lead, ...current]));
}

export async function submitLeadRecord(
  lead: LeadRecord,
  options: {
    source: string;
    pageUrl?: string;
    files?: LeadFileInput[];
  },
): Promise<LeadSubmitResult | null> {
  const pageUrl =
    options.pageUrl ?? (typeof window !== "undefined" ? window.location.href : "");
  const leadPayload = {
    ...lead,
    source: options.source,
    pageUrl,
  };

  if (publicLeadWebhookUrl) {
    const files = await serializeLeadFiles(options.files ?? []);

    await fetch(publicLeadWebhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        lead: leadPayload,
        files,
      }),
    });

    return {
      ok: true,
      configured: true,
      mode: "apps-script",
      opaque: true,
    };
  }

  const formData = new FormData();
  Object.entries(leadPayload).forEach(([key, value]) => {
    formData.set(key, String(value ?? ""));
  });

  (options.files ?? []).forEach((item) => {
    const fieldName = item.field === "chatImage" ? "chatImages" : item.field;
    formData.append(fieldName, item.file, item.file.name);
  });

  const response = await fetch("/api/leads", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as LeadSubmitResult | null;

  return {
    ...(data ?? {}),
    mode: "next-api",
  };
}

async function serializeLeadFiles(files: LeadFileInput[]) {
  return Promise.all(
    files
      .filter((item) => item.file.size > 0)
      .map(async (item) => {
        const base = {
          field: item.field,
          label: item.label,
          name: item.file.name,
          type: item.file.type,
          size: item.file.size,
        };

        if (item.file.size > MAX_DIRECT_FILE_SIZE) {
          return {
            ...base,
            dataBase64: "",
            skippedReason: "File lớn hơn 8MB nên chỉ lưu tên file.",
          };
        }

        return {
          ...base,
          dataBase64: await fileToBase64(item.file),
        };
      }),
  );
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
