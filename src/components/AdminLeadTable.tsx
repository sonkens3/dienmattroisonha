"use client";

import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { loadLeadsFromStorage, type LeadRecord } from "@/lib/leads";

export function AdminLeadTable() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);

  function loadLeads() {
    setLeads(loadLeadsFromStorage());
  }

  useEffect(() => {
    const timer = window.setTimeout(loadLeads, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Lead khách hàng</h2>
          <p className="mt-1 text-sm text-slate-600">Dữ liệu demo được lưu trong localStorage của trình duyệt.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-teal-700"
          onClick={loadLeads}
        >
          <RefreshCcw size={16} aria-hidden />
          Tải lại
        </button>
      </div>

      <div className="table-scroll mt-5">
        <table className="min-w-[960px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-3">Thời gian</th>
              <th className="px-3 py-3">Tên</th>
              <th className="px-3 py-3">SĐT/Zalo</th>
              <th className="px-3 py-3">Tỉnh</th>
              <th className="px-3 py-3">Công trình</th>
              <th className="px-3 py-3">Tiền điện</th>
              <th className="px-3 py-3">Nhu cầu</th>
              <th className="px-3 py-3">File</th>
            </tr>
          </thead>
          <tbody>
            {leads.length ? (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-200">
                  <td className="px-3 py-3 text-slate-600">
                    {new Date(lead.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-3 font-bold text-slate-950">{lead.name}</td>
                  <td className="px-3 py-3">{lead.phone}</td>
                  <td className="px-3 py-3">{lead.city}</td>
                  <td className="px-3 py-3">{lead.projectType}</td>
                  <td className="px-3 py-3">{lead.monthlyBill}</td>
                  <td className="px-3 py-3">{lead.need}</td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {[lead.billImageName, lead.roofImageName].filter(Boolean).join(", ") || "Chưa có"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                  Chưa có lead trong trình duyệt này. Hãy gửi form tư vấn để thấy dữ liệu demo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
