"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { contentService } from "../../../lib/services/content";
import { registrationService, type Registration } from "../../../lib/services/registrations";

const statusLabel: Record<Registration["paymentStatus"], string> = {
  paid: "Paid",
  pending: "Payment Pending",
};

const statusStyles: Record<Registration["paymentStatus"], string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
};

export default function PaymentsPage() {
  const [paymentLink, setPaymentLink] = useState("");
  const [linkLoading, setLinkLoading] = useState(true);
  const [linkSaving, setLinkSaving] = useState(false);
  const [linkSavedAt, setLinkSavedAt] = useState("");
  const [linkError, setLinkError] = useState("");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [rowsLoading, setRowsLoading] = useState(true);

  useEffect(() => {
    contentService.get().then((data) => {
      setPaymentLink(data.paymentLink || "");
      setLinkLoading(false);
    });
    registrationService.getAll().then((data) => {
      setRegistrations(data);
      setRowsLoading(false);
    });
  }, []);

  const handleSaveLink = async () => {
    setLinkSaving(true);
    setLinkError("");
    try {
      await contentService.update({ paymentLink });
      setLinkSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLinkSaving(false);
    }
  };

  const paidCount = registrations.filter((r) => r.paymentStatus === "paid").length;
  const totalCollected = registrations
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f1b3d]">Payments</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Manage the checkout link and see who's paid.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-gray-500">
          Payment Link
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Attendees are sent here from the Register form's payment step (e.g. a Stripe Payment
          Link).
        </p>
        {linkLoading ? (
          <Loader2 className="animate-spin text-gray-400" size={18} />
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder="https://buy.stripe.com/..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
            />
            <button
              onClick={handleSaveLink}
              disabled={linkSaving}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0f1b3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c2f5b] disabled:opacity-70"
            >
              {linkSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
          </div>
        )}
        {linkError && <p className="mt-2 text-sm text-red-600">{linkError}</p>}
        {linkSavedAt && !linkError && (
          <p className="mt-2 text-sm text-green-600">Saved at {linkSavedAt}</p>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Registrants</p>
          <p className="mt-1 text-2xl font-bold text-[#0f1b3d]">{registrations.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Paid</p>
          <p className="mt-1 text-2xl font-bold text-[#0f1b3d]">{paidCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Collected</p>
          <p className="mt-1 text-2xl font-bold text-[#0f1b3d]">{totalCollected}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rowsLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  <Loader2 className="mx-auto animate-spin" size={18} />
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  No registrations yet.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{reg.name}</td>
                  <td className="px-4 py-3 text-gray-700">{reg.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[reg.paymentStatus]}`}
                    >
                      {statusLabel[reg.paymentStatus]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
