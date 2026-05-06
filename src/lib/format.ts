export function formatVnd(value: number) {
  if (!Number.isFinite(value)) return "0 đ";
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(value))} đ`;
}

export function formatNumber(value: number, suffix = "") {
  const number = Number.isInteger(value) ? value.toString() : trimNumber(value);
  return `${number}${suffix}`;
}

export function formatRange(min: number, max: number, suffix = "") {
  return `${formatNumber(min, suffix)} - ${formatNumber(max, suffix)}`;
}

export function trimNumber(value: number) {
  return Number(value.toFixed(1)).toString();
}

export function formatVndInput(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "";
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

export function parseVndInput(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}
