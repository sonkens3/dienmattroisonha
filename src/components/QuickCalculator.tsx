"use client";

import { Calculator, CheckCircle2, Info, TrendingDown, Zap } from "lucide-react";
import { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";
import { formatRange, formatVnd } from "@/lib/format";
import { estimateSolarSystem, type SolarEstimate, type SolarInput } from "@/lib/solarCalculator";

const defaultInput: SolarInput = {
  monthlyBill: 4_000_000,
  projectType: "Nhà ở",
  phase: "unknown",
  dayUsageLevel: "medium",
  roofArea: 60,
  wantStorage: false,
};

export function QuickCalculator() {
  const [form, setForm] = useState<SolarInput>(defaultInput);
  const [result, setResult] = useState<SolarEstimate | null>(null);

  function updateField<K extends keyof SolarInput>(key: K, value: SolarInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <form
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(estimateSolarSystem(form));
        }}
      >
        <div className="mb-5 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
            <Calculator size={20} aria-hidden />
          </span>
          <div>
            <h3 className="font-black text-slate-950">Tính sơ bộ trước khi khảo sát</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Kết quả chỉ lấy mốc hoàn vốn ngắn nhất để khách dễ hình dung. Kỹ thuật sẽ tính lại theo hóa đơn thật.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CurrencyInput
            id="monthlyBill"
            label="Tiền điện trung bình mỗi tháng"
            value={form.monthlyBill}
            onChange={(value) => updateField("monthlyBill", value)}
          />
          <div>
            <label className="label" htmlFor="projectType">
              Loại công trình
            </label>
            <select
              id="projectType"
              className="field"
              value={form.projectType}
              onChange={(event) => updateField("projectType", event.target.value)}
            >
              <option>Nhà ở</option>
              <option>Nhà nghỉ</option>
              <option>Quán cafe</option>
              <option>Xưởng</option>
              <option>Văn phòng</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="phase">
              Điện 1 pha hay 3 pha
            </label>
            <select
              id="phase"
              className="field"
              value={form.phase}
              onChange={(event) =>
                updateField("phase", event.target.value as SolarInput["phase"])
              }
            >
              <option value="unknown">Chưa rõ</option>
              <option value="1phase">1 pha</option>
              <option value="3phase">3 pha</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="dayUsage">
              Mức dùng điện ban ngày
            </label>
            <select
              id="dayUsage"
              className="field"
              value={form.dayUsageLevel}
              onChange={(event) =>
                updateField("dayUsageLevel", event.target.value as SolarInput["dayUsageLevel"])
              }
            >
              <option value="low">Ít</option>
              <option value="medium">Trung bình</option>
              <option value="high">Nhiều</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="roofArea">
              Diện tích mái ước tính (m²)
            </label>
            <input
              id="roofArea"
              className="field"
              type="number"
              min={0}
              value={form.roofArea ?? ""}
              onChange={(event) => updateField("roofArea", Number(event.target.value))}
            />
          </div>
          <div>
            <label className="label" htmlFor="storage">
              Pin lưu trữ
            </label>
            <select
              id="storage"
              className="field"
              value={form.wantStorage ? "yes" : "no"}
              onChange={(event) => updateField("wantStorage", event.target.value === "yes")}
            >
              <option value="no">Chưa cần</option>
              <option value="yes">Có nhu cầu</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 font-black text-white shadow-md transition hover:bg-teal-800"
        >
          <Calculator size={18} aria-hidden />
          Tính phương án sơ bộ
        </button>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5 sm:p-5">
        {result ? (
          <EstimateResult result={result} />
        ) : (
          <div className="flex h-full min-h-[22rem] flex-col justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
            <Info className="mb-4 text-teal-700" size={34} aria-hidden />
            <p className="text-xl font-black text-slate-950">Kết quả sẽ hiện tại đây</p>
            <p className="mt-3 leading-7">
              Nhập hóa đơn điện, loại công trình và diện tích mái. Hệ thống sẽ gợi ý công suất,
              số tấm pin, diện tích mái cần dùng, chi phí và mốc hoàn vốn tốt nhất.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function EstimateResult({ result }: { result: SolarEstimate }) {
  const rows = [
    {
      label: "Hệ thống đề xuất",
      value: `${formatRange(result.recommendedKwMin, result.recommendedKwMax, "kW")}`,
      icon: Zap,
      highlight: true,
    },
    {
      label: "Hoàn vốn tốt nhất",
      value: `Từ khoảng ${result.paybackMin} năm`,
      icon: TrendingDown,
      highlight: true,
    },
    {
      label: "Số tấm pin dự kiến",
      value: `${result.panelCountMin} - ${result.panelCountMax} tấm`,
      icon: CheckCircle2,
    },
    {
      label: "Diện tích mái cần",
      value: `${result.roofAreaMin} - ${result.roofAreaMax}m²`,
      icon: CheckCircle2,
    },
    {
      label: "Sản lượng dự kiến",
      value: `${result.dailyOutputMin} - ${result.dailyOutputMax} kWh/ngày`,
      icon: CheckCircle2,
    },
    {
      label: "Chi phí đầu tư",
      value: `${formatVnd(result.investmentMin)} - ${formatVnd(result.investmentMax)}`,
      icon: CheckCircle2,
    },
    {
      label: "Có thể giảm mỗi tháng",
      value: `${formatVnd(result.monthlySavingMin)} - ${formatVnd(result.monthlySavingMax)} (${result.billReductionMin}-${result.billReductionMax}% hóa đơn)`,
      icon: CheckCircle2,
    },
  ];

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
        Kết quả sơ bộ
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => {
          const Icon = row.icon;

          return (
            <div
              key={row.label}
              className={`rounded-lg border p-4 ${
                row.highlight
                  ? "border-teal-200 bg-teal-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md ${
                    row.highlight ? "bg-teal-700 text-white" : "bg-white text-teal-700"
                  }`}
                >
                  <Icon size={17} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">{row.label}</p>
                  <p className="mt-1 text-lg font-black leading-7 text-slate-950">{row.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-black">Kỹ thuật cần kiểm tra thêm:</p>
        <ul className="mt-2 grid gap-1">
          {result.notes.map((note) => (
            <li key={note}>• {note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
