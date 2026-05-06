"use client";

import { ImagePlus, Send, ShieldCheck } from "lucide-react";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";
import { saveLeadToStorage, submitLeadRecord, type LeadFileInput, type LeadRecord } from "@/lib/leads";

type SubmitState = {
  status: "idle" | "submitting" | "sent" | "warning" | "error";
  message: string;
};

export function LeadForm() {
  const [monthlyBill, setMonthlyBill] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const billImage = formData.get("billImage") as File | null;
    const roofImage = formData.get("roofImage") as File | null;
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    formData.set("id", id);
    formData.set("createdAt", createdAt);
    formData.set("source", "Form tư vấn");
    formData.set("pageUrl", window.location.href);

    const lead: LeadRecord = {
      id,
      createdAt,
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      city: String(formData.get("city") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      monthlyBill: String(formData.get("monthlyBill") ?? ""),
      phase: String(formData.get("phase") ?? ""),
      roofArea: String(formData.get("roofArea") ?? ""),
      need: String(formData.get("need") ?? ""),
      billImageName: billImage?.name ?? "",
      roofImageName: roofImage?.name ?? "",
      note: String(formData.get("note") ?? ""),
    };

    saveLeadToStorage(lead);
    setSubmitState({
      status: "submitting",
      message: "Đang gửi thông tin đến kỹ thuật...",
    });

    try {
      const files: LeadFileInput[] = [
        billImage ? { field: "billImage", label: "Ảnh hóa đơn điện", file: billImage } : null,
        roofImage ? { field: "roofImage", label: "Ảnh mái nhà", file: roofImage } : null,
      ].filter(Boolean) as LeadFileInput[];
      const data = await submitLeadRecord(lead, {
        source: "Form tư vấn",
        pageUrl: window.location.href,
        files,
      });

      if (data?.ok) {
        form.reset();
        setMonthlyBill(0);
        setSubmitState({
          status: "sent",
          message:
            "Cảm ơn anh/chị đã gửi thông tin. Kỹ thuật đã nhận thông báo và sẽ liên hệ sớm nhất để tư vấn phương án phù hợp.",
        });
        return;
      }

      if (data?.configured === false) {
        setSubmitState({
          status: "warning",
          message:
            "Thông tin đã được lưu tạm trong admin mock, nhưng chưa cấu hình Google Sheet/Telegram để gửi thật.",
        });
        return;
      }

      setSubmitState({
        status: "error",
        message:
          "Thông tin đã được lưu tạm, nhưng gửi Google Sheet/Telegram chưa thành công. Vui lòng kiểm tra cấu hình.",
      });
    } catch {
      setSubmitState({
        status: "error",
        message:
          "Thông tin đã được lưu tạm, nhưng chưa gửi được ra hệ thống ngoài. Vui lòng kiểm tra kết nối hoặc cấu hình.",
      });
    }
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5 sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="mb-5 rounded-lg border border-teal-100 bg-teal-50 p-4">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-700 text-white">
            <ShieldCheck size={20} aria-hidden />
          </span>
          <div>
            <h3 className="font-black text-slate-950">Gửi thông tin để kỹ thuật tính chính xác</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Nên gửi kèm hóa đơn điện và ảnh mái. Thông tin này chỉ dùng để tư vấn phương án lắp đặt.
            </p>
          </div>
        </div>
      </div>

      {submitState.status !== "idle" ? <SubmitNotice state={submitState} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Họ tên" name="name" autoComplete="name" required />
        <Field label="Số điện thoại/Zalo" name="phone" autoComplete="tel" inputMode="tel" required />
        <Field label="Tỉnh/thành phố" name="city" autoComplete="address-level1" />
        <Select
          label="Loại công trình"
          name="projectType"
          options={["Nhà ở", "Nhà nghỉ", "Quán cafe", "Xưởng", "Văn phòng", "Khác"]}
        />
        <CurrencyInput
          id="leadMonthlyBill"
          name="monthlyBill"
          label="Tiền điện mỗi tháng"
          value={monthlyBill}
          onChange={setMonthlyBill}
        />
        <Select label="Điện" name="phase" options={["1 pha", "3 pha", "Không rõ"]} />
        <Field label="Diện tích mái ước tính" name="roofArea" placeholder="Ví dụ: 60m²" inputMode="numeric" />
        <Select
          label="Nhu cầu"
          name="need"
          options={["Hòa lưới", "Hybrid", "Lưu trữ", "Chưa rõ"]}
        />
        <FileField label="Ảnh hóa đơn điện" name="billImage" />
        <FileField label="Ảnh mái nhà" name="roofImage" />
      </div>

      <div className="mt-4">
        <label className="label" htmlFor="note">
          Ghi chú thêm
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          className="field resize-y"
          placeholder="Ví dụ: dùng nhiều điều hòa ban ngày, mái tôn, cần tư vấn có lưu trữ hay không..."
        />
      </div>

      <button
        type="submit"
        disabled={submitState.status === "submitting"}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 font-black text-white shadow-md transition hover:bg-teal-800 disabled:bg-slate-400"
      >
        <Send size={18} aria-hidden />
        {submitState.status === "submitting" ? "Đang gửi..." : "Gửi cho kỹ thuật tư vấn"}
      </button>
    </form>
  );
}

function SubmitNotice({ state }: { state: SubmitState }) {
  const className =
    state.status === "sent"
      ? "border-teal-200 bg-teal-50 text-teal-950"
      : state.status === "warning" || state.status === "submitting"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-red-200 bg-red-50 text-red-950";

  return (
    <div className={`mb-5 rounded-lg border p-4 text-sm font-semibold leading-6 ${className}`}>
      {state.message}
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="field"
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
      />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} className="field" defaultValue={options[0]}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function FileField({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-700 transition hover:border-teal-700 hover:bg-teal-50">
        <ImagePlus size={18} className="text-teal-700" aria-hidden />
        <span>Chọn ảnh</span>
        <input id={name} name={name} type="file" accept="image/*" className="sr-only" />
      </label>
    </div>
  );
}
