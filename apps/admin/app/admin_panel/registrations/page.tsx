"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { registrationService, type Registration } from "../../../lib/services/registrations";

function toCsv(rows: Registration[]): string {
  const headers = ["Name", "Email", "Title", "Company", "Country", "Phone", "Payment Status", "Submitted"];
  const lines = rows.map((r) =>
    [r.name, r.email, r.title, r.company, r.country, r.phone, r.paymentStatus, r.createdAt]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export default function RegistrationsPage() {
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registrationService.getAll().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const handleExport = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cebc-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f1b3d]">Registrations</h1>
          <p className="mt-0.5 text-sm text-gray-500">Attendees who submitted the registration form.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={!rows.length}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  <Loader2 className="mx-auto animate-spin" size={18} />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No registrations yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{r.name}</td>
                  <td className="px-4 py-3 text-gray-700">{r.email}</td>
                  <td className="px-4 py-3 text-gray-700">{r.company}</td>
                  <td className="px-4 py-3 text-gray-700">{r.country}</td>
                  <td className="px-4 py-3 text-gray-700">{r.paymentStatus}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
