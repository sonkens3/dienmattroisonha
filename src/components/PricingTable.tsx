import { pricingPackages, pricingRows } from "@/data/pricing";

export function PricingTable() {
  return (
    <div className="mt-8 grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pricingPackages.map((row) => (
          <article key={row.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-teal-700">{row.size}</p>
            <h3 className="mt-2 text-lg font-black text-slate-950">{row.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{row.fit}</p>
            <p className="mt-4 text-xl font-black text-slate-950">{row.price}</p>
          </article>
        ))}
      </div>

      <div className="table-scroll rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-white">
            <tr>
              <th className="px-4 py-3">Công suất</th>
              <th className="px-4 py-3">Số tấm pin</th>
              <th className="px-4 py-3">Diện tích mái</th>
              <th className="px-4 py-3">Giá tham khảo</th>
            </tr>
          </thead>
          <tbody>
            {pricingRows.map((row) => (
              <tr key={row.size} className="border-t border-slate-200">
                <td className="px-4 py-4 font-black text-slate-950">{row.size}</td>
                <td className="px-4 py-4 text-slate-700">{row.panels}</td>
                <td className="px-4 py-4 text-slate-700">{row.roof}</td>
                <td className="px-4 py-4 font-black text-teal-800">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        Giá chỉ là tham khảo. Chi phí thực tế phụ thuộc loại pin, inverter, mái tôn/mái bê tông,
        khoảng cách đi dây, tủ điện, chống sét, khung giàn và nhu cầu có lưu trữ hay không.
      </p>
    </div>
  );
}
