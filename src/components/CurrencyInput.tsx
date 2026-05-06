import { formatVndInput, parseVndInput } from "@/lib/format";

type CurrencyInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
};

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  name,
  placeholder = "Ví dụ: 3.000.000",
  required,
}: CurrencyInputProps) {
  const displayValue = formatVndInput(value);

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className="field pr-12"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          required={required}
          value={displayValue}
          onChange={(event) => onChange(parseVndInput(event.target.value))}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-bold text-slate-500">
          đ
        </span>
      </div>
      {name ? <input type="hidden" name={name} value={displayValue ? `${displayValue} đ` : ""} /> : null}
    </div>
  );
}
