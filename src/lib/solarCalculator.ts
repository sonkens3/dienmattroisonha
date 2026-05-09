import { trimNumber } from "@/lib/format";

export type SolarInput = {
  monthlyBill: number;
  averageElectricPrice?: number;
  projectType?: string;
  phase?: "1phase" | "3phase" | "unknown";
  dayUsageLevel: "low" | "medium" | "high";
  roofArea?: number;
  wantStorage?: boolean;
};

export type SolarEstimate = {
  recommendedKwMin: number;
  recommendedKwMax: number;
  panelCountMin: number;
  panelCountMax: number;
  roofAreaMin: number;
  roofAreaMax: number;
  dailyOutputMin: number;
  dailyOutputMax: number;
  investmentMin: number;
  investmentMax: number;
  monthlySavingMin: number;
  monthlySavingMax: number;
  billReductionMin: number;
  billReductionMax: number;
  paybackMin: number;
  paybackMax: number;
  monthlyKwh: number;
  notes: string[];
};

const DEFAULT_ELECTRIC_PRICE = 3000;
const BILL_REDUCTION_TARGET = {
  low: [0.7, 0.82],
  medium: [0.75, 0.88],
  high: [0.8, 0.95],
};
const MIN_SYSTEM_KW = 3;
const MIN_DAILY_KWH_PER_KW = 3.5;
const MAX_DAILY_KWH_PER_KW = 4.5;

export function estimateSolarSystem(input: SolarInput): SolarEstimate {
  const notes: string[] = [];
  const monthlyBill = Math.max(input.monthlyBill || 0, 0);
  const averageElectricPrice =
    input.averageElectricPrice && input.averageElectricPrice > 0
      ? input.averageElectricPrice
      : DEFAULT_ELECTRIC_PRICE;

  if (!input.averageElectricPrice) {
    notes.push("Đang dùng giá điện trung bình mặc định 3.000 đ/kWh.");
  }

  if (monthlyBill <= 0) {
    notes.push("Chưa có tiền điện rõ ràng, hệ thống đang dùng gói 3-5kW để tham khảo.");
  }

  const monthlyKwh = monthlyBill > 0 ? monthlyBill / averageElectricPrice : 0;
  const [targetReductionMin, targetReductionMax] = getBillReductionTarget(
    input.dayUsageLevel,
    input.wantStorage,
  );
  const [baseMin, baseMax] = getRecommendedKwRange(monthlyBill);
  let recommendedKwMin = baseMin;
  let recommendedKwMax = baseMax;

  if (monthlyKwh > 0) {
    recommendedKwMin = Math.max(
      MIN_SYSTEM_KW,
      monthlyKwh * targetReductionMin / (30 * MIN_DAILY_KWH_PER_KW),
    );
    recommendedKwMax = Math.max(
      recommendedKwMin + 1,
      monthlyKwh * targetReductionMax / (30 * MAX_DAILY_KWH_PER_KW),
    );
  }

  recommendedKwMin = roundToHalf(recommendedKwMin);
  recommendedKwMax = roundToHalf(recommendedKwMax);

  const panelCountMin = Math.ceil((recommendedKwMin * 1000) / 635);
  const panelCountMax = Math.ceil((recommendedKwMax * 1000) / 635);
  const roofAreaMin = panelCountMin * 3;
  const roofAreaMax = panelCountMax * 3;
  const dailyOutputMin = round(recommendedKwMin * 3.5);
  const dailyOutputMax = round(recommendedKwMax * 4.5);
  const [costMin] = getCostPerKw(recommendedKwMin);
  const [, costMax] = getCostPerKw(recommendedKwMax);

  let investmentMin = recommendedKwMin * costMin;
  let investmentMax = recommendedKwMax * costMax;

  if (input.wantStorage) {
    investmentMin += 35_000_000;
    investmentMax += 120_000_000;
    notes.push("Có pin lưu trữ sẽ tăng chi phí đầu tư; cần tính riêng dung lượng pin và tải backup.");
  }

  const productionSavingMin = dailyOutputMin * 30 * averageElectricPrice;
  const productionSavingMax = dailyOutputMax * 30 * averageElectricPrice;
  const monthlySavingMin =
    monthlyBill > 0
      ? Math.min(monthlyBill * targetReductionMin, productionSavingMin)
      : productionSavingMin * 0.7;
  const monthlySavingMax =
    monthlyBill > 0
      ? Math.min(monthlyBill * targetReductionMax, productionSavingMax, monthlyBill * 0.98)
      : productionSavingMax * 0.82;
  const billReductionMin = monthlyBill > 0 ? monthlySavingMin / monthlyBill : 0;
  const billReductionMax = monthlyBill > 0 ? monthlySavingMax / monthlyBill : 0;
  const paybackMin = investmentMin / Math.max(monthlySavingMax, 1) / 12;
  const paybackMax = investmentMax / Math.max(monthlySavingMin, 1) / 12;

  if (input.roofArea && input.roofArea < roofAreaMin) {
    notes.push(
      `Diện tích mái nhập vào khoảng ${trimNumber(input.roofArea)}m², nhỏ hơn mức tối thiểu ước tính ${roofAreaMin}m².`,
    );
  }

  if (input.phase !== "3phase" && recommendedKwMax >= 12) {
    notes.push("Hệ công suất trên 10-12kW thường cần kiểm tra kỹ điện 1 pha/3 pha và khả năng đấu nối.");
  }

  notes.push(
    "Mức giảm tiền điện đang lấy theo phương án thiết kế bám tải phù hợp, thường mục tiêu khoảng 70-90% hóa đơn khi mái và phụ tải ban ngày đáp ứng.",
  );
  notes.push("Cần khảo sát hướng mái, bóng che, tủ điện, đường dây và hóa đơn thực tế trước khi chốt phương án.");

  return {
    recommendedKwMin,
    recommendedKwMax,
    panelCountMin,
    panelCountMax,
    roofAreaMin,
    roofAreaMax,
    dailyOutputMin,
    dailyOutputMax,
    investmentMin: Math.round(investmentMin),
    investmentMax: Math.round(investmentMax),
    monthlySavingMin: Math.round(monthlySavingMin),
    monthlySavingMax: Math.round(monthlySavingMax),
    billReductionMin: Math.round(billReductionMin * 100),
    billReductionMax: Math.round(billReductionMax * 100),
    paybackMin: round(paybackMin),
    paybackMax: round(paybackMax),
    monthlyKwh: Math.round(monthlyKwh),
    notes,
  };
}

export function getRecommendedKwRange(monthlyBill: number): [number, number] {
  if (monthlyBill <= 0) return [3, 5];
  if (monthlyBill < 2_000_000) return [3, 5];
  if (monthlyBill < 4_000_000) return [5, 8];
  if (monthlyBill < 7_000_000) return [8, 12];
  if (monthlyBill < 12_000_000) return [12, 20];
  return [20, 50];
}

export function getCostPerKw(systemKw: number): [number, number] {
  if (systemKw <= 5) return [12_000_000, 16_000_000];
  if (systemKw <= 10) return [11_000_000, 15_000_000];
  if (systemKw <= 20) return [10_000_000, 14_000_000];
  return [9_000_000, 13_000_000];
}

function getBillReductionTarget(
  dayUsageLevel: SolarInput["dayUsageLevel"],
  wantStorage?: boolean,
): [number, number] {
  const target = BILL_REDUCTION_TARGET[dayUsageLevel];

  if (!wantStorage) return target as [number, number];

  return [Math.max(target[0], 0.8), Math.min(0.95, target[1] + 0.05)];
}

function round(value: number) {
  return Number(value.toFixed(1));
}

function roundToHalf(value: number) {
  return Math.max(1, Math.round(value * 2) / 2);
}
