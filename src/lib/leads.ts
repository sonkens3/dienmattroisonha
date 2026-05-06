export const LEAD_STORAGE_KEY = "minh-solar-leads";

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
