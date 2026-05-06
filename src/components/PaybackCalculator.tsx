"use client";

import { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";
import { EstimateResult } from "@/components/QuickCalculator";
import { estimateSolarSystem, type SolarEstimate, type SolarInput } from "@/lib/solarCalculator";

export function PaybackCalculator() {
  const [input, setInput] = useState<SolarInput>({
    monthlyBill: 6_000_000,
    averageElectricPrice: 3000,
    projectType: "Nhà nghỉ",
    phase: "3phase",
    dayUsageLevel: "medium",
    roofArea: 90,
    wantStorage: false,
  });
  const [province, setProvince] = useState("Hà Nội");
  const [systemType, setSystemType] = useState("Hòa lưới bám tải");
  const [result, setResult] = useState<SolarEstimate>(() => estimateSolarSystem(input));

  function updateField<K extends keyof SolarInput>(key: K, value: SolarInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(estimateSolarSystem(input));
        }}
      >
        <div className="grid gap-4">
          <CurrencyInput
            id="monthly-bill"
            label="Tiền điện trung bình mỗi tháng"
            value={input.monthlyBill}
            onChange={(value) => updateField("monthlyBill", value)}
          />
          <CurrencyInput
            id="average-electric-price"
            label="Giá điện trung bình/kWh"
            value={input.averageElectricPrice ?? 3000}
            onChange={(value) => updateField("averageElectricPrice", value)}
            placeholder="Ví dụ: 3.000"
          />
          <Select
            label="Loại công trình"
            value={input.projectType ?? "Nhà ở"}
            options={["Nhà ở", "Nhà nghỉ", "Quán cafe", "Xưởng", "Văn phòng"]}
            onChange={(value) => updateField("projectType", value)}
          />
          <Select
            label="Điện 1 pha/3 pha"
            value={input.phase ?? "unknown"}
            options={[
              ["unknown", "Chưa rõ"],
              ["1phase", "1 pha"],
              ["3phase", "3 pha"],
            ]}
            onChange={(value) => updateField("phase", value as SolarInput["phase"])}
          />
          <Select
            label="Tỷ lệ dùng điện ban ngày"
            value={input.dayUsageLevel}
            options={[
              ["low", "Ít"],
              ["medium", "Trung bình"],
              ["high", "Nhiều"],
            ]}
            onChange={(value) =>
              updateField("dayUsageLevel", value as SolarInput["dayUsageLevel"])
            }
          />
          <NumberField
            label="Diện tích mái ước tính (m²)"
            value={input.roofArea ?? 0}
            onChange={(value) => updateField("roofArea", value)}
          />
          <Select
            label="Loại hệ thống"
            value={systemType}
            options={["Hòa lưới bám tải", "Hybrid", "Có pin lưu trữ", "Chưa rõ"]}
            onChange={(value) => {
              setSystemType(value);
              updateField("wantStorage", value === "Có pin lưu trữ" || value === "Hybrid");
            }}
          />
          <Select
            label="Tỉnh/thành phố"
            value={province}
            options={["Hà Nội", "Bắc Ninh", "Hưng Yên", "Hòa Bình", "Hải Phòng", "Khác"]}
            onChange={setProvince}
          />
        </div>
        <button
          type="submit"
          className="mt-5 min-h-12 w-full rounded-md bg-teal-700 px-5 py-3 font-black text-white shadow-md transition hover:bg-teal-800"
        >
          Cập nhật kết quả
        </button>
      </form>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5">
        <div className="mb-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          Khu vực: <strong>{province}</strong> · Loại hệ: <strong>{systemType}</strong>
        </div>
        <EstimateResult result={result} />
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field"
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[] | [string, string][];
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => {
          const optionValue = Array.isArray(option) ? option[0] : option;
          const optionLabel = Array.isArray(option) ? option[1] : option;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}
