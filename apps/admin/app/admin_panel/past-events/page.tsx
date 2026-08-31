"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { MediaField } from "../components/MediaField";
import {
  pastSummitService,
  type PastSummit,
  type PastSummitAgendaItem,
  type PastSummitPhoto,
} from "../../../lib/services/pastSummits";

const emptySummit: Partial<PastSummit> = {
  title: "",
  year: new Date().getFullYear(),
  reportUrl: "",
  order: 0,
  photos: [],
  agenda: [],
};

const emptyPhoto: PastSummitPhoto = { photo: "", caption: "", description: "" };
const emptyAgendaItem: PastSummitAgendaItem = {
  time: "",
  title: "",
  detail: "",
  highlights: [],
  image: "",
};

function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-left text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
      />
    </label>
  );
}

/** Metadata create/edit modal — title, year, report link, order. */
function SummitModal({
  summit,
  onClose,
  onSave,
}: {
  summit: Partial<PastSummit>;
  onClose: () => void;
  onSave: (data: Partial<PastSummit>) => Promise<void>;
}) {
  const [form, setForm] = useState(summit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0f1b3d]">
            {summit._id ? "Edit summit" : "New summit"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <TextInput
            label="Title (e.g. 13th Annual Summit)"
            value={form.title ?? ""}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          />
          <TextInput
            label="Year"
            type="number"
            value={form.year ?? ""}
            onChange={(v) => setForm((f) => ({ ...f, year: Number(v) }))}
          />
          <MediaField
            label="Annual Summit Report (PDF)"
            value={form.reportUrl ?? ""}
            onChange={(v) => setForm((f) => ({ ...f, reportUrl: v }))}
            accept="application/pdf"
          />
          <TextInput
            label="Order"
            type="number"
            value={form.order ?? 0}
            onChange={(v) => setForm((f) => ({ ...f, order: Number(v) }))}
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-[#0f1b3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c2f5b] disabled:opacity-70"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/** Inline add/remove editor for a summit's photos and agenda arrays. */
function SummitContentEditor({
  summit,
  onSaved,
}: {
  summit: PastSummit;
  onSaved: (updated: PastSummit) => void;
}) {
  const [photos, setPhotos] = useState<PastSummitPhoto[]>(summit.photos);
  const [agenda, setAgenda] = useState<PastSummitAgendaItem[]>(summit.agenda);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await pastSummitService.update(summit._id!, { photos, agenda });
      onSaved(updated);
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 border-t border-gray-100 bg-gray-50 p-5">
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Photos</h4>
        <div className="space-y-3">
          {photos.map((photo, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <div className="flex-1 space-y-2">
                <MediaField
                  label="Photo"
                  value={photo.photo}
                  onChange={(v) => setPhotos((p) => p.map((x, xi) => (xi === i ? { ...x, photo: v } : x)))}
                />
                <TextInput
                  label="Caption"
                  value={photo.caption}
                  onChange={(v) => setPhotos((p) => p.map((x, xi) => (xi === i ? { ...x, caption: v } : x)))}
                />
                <TextInput
                  label="Description"
                  value={photo.description}
                  onChange={(v) =>
                    setPhotos((p) => p.map((x, xi) => (xi === i ? { ...x, description: v } : x)))
                  }
                />
              </div>
              <button
                onClick={() => setPhotos((p) => p.filter((_, xi) => xi !== i))}
                className="mt-1 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPhotos((p) => [...p, { ...emptyPhoto }])}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#0f1b3d] hover:text-[#1c2f5b]"
        >
          <Plus size={15} /> Add photo
        </button>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Agenda</h4>
        <div className="space-y-3">
          {agenda.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    label="Time"
                    value={item.time}
                    onChange={(v) => setAgenda((a) => a.map((x, xi) => (xi === i ? { ...x, time: v } : x)))}
                  />
                  <TextInput
                    label="Title"
                    value={item.title}
                    onChange={(v) => setAgenda((a) => a.map((x, xi) => (xi === i ? { ...x, title: v } : x)))}
                  />
                </div>
                <TextInput
                  label="Detail"
                  value={item.detail}
                  onChange={(v) => setAgenda((a) => a.map((x, xi) => (xi === i ? { ...x, detail: v } : x)))}
                />
                <label className="block text-left text-sm">
                  <span className="font-medium text-gray-700">Highlights (one per line)</span>
                  <textarea
                    rows={2}
                    value={item.highlights.join("\n")}
                    onChange={(e) =>
                      setAgenda((a) =>
                        a.map((x, xi) => (xi === i ? { ...x, highlights: e.target.value.split("\n") } : x))
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
                  />
                </label>
                <MediaField
                  label="Image"
                  value={item.image}
                  onChange={(v) => setAgenda((a) => a.map((x, xi) => (xi === i ? { ...x, image: v } : x)))}
                />
              </div>
              <button
                onClick={() => setAgenda((a) => a.filter((_, xi) => xi !== i))}
                className="mt-1 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setAgenda((a) => [...a, { ...emptyAgendaItem, highlights: [] }])}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#0f1b3d] hover:text-[#1c2f5b]"
        >
          <Plus size={15} /> Add agenda item
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-[#0f1b3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c2f5b] disabled:opacity-70"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save photos & agenda
        </button>
        {savedAt && <span className="text-sm text-green-600">Saved at {savedAt}</span>}
      </div>
    </div>
  );
}

export default function PastEventsPage() {
  const [summits, setSummits] = useState<PastSummit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalSummit, setModalSummit] = useState<Partial<PastSummit> | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setSummits(await pastSummitService.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveMetadata = async (data: Partial<PastSummit>) => {
    if (data._id) {
      await pastSummitService.update(data._id, data);
    } else {
      await pastSummitService.create(data);
    }
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this summit, along with all its photos and agenda? This cannot be undone.")) return;
    await pastSummitService.remove(id);
    await load();
  };

  const handleContentSaved = (updated: PastSummit) => {
    setSummits((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-900">
        <div>
          <span className="font-semibold text-indigo-950">Looking to update the 4 Polaroid photos in the &quot;Moments from CEBC&quot; header?</span>
          <p className="mt-0.5 text-indigo-700">Those top showcase photos are managed under the Moments gallery.</p>
        </div>
        <Link
          href="/admin_panel/gallery"
          className="shrink-0 rounded-lg bg-[#0f1b3d] px-3.5 py-2 font-medium text-white shadow-sm hover:bg-[#1c2f5b]"
        >
          Go to Moments from CEBC →
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f1b3d]">Past Editions (Year-by-Year)</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage past annual summit editions — report, photo galleries, and agendas for each year.
          </p>
        </div>
        <button
          onClick={() => setModalSummit({ ...emptySummit })}
          className="flex items-center gap-1.5 rounded-lg bg-[#0f1b3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c2f5b]"
        >
          <Plus size={16} />
          Add Summit
        </button>
      </div>

      {loading ? (
        <Loader2 className="animate-spin text-gray-400" size={20} />
      ) : summits.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400">
          No past summits yet.
        </p>
      ) : (
        <div className="space-y-3">
          {summits.map((summit) => {
            const expanded = expandedId === summit._id;
            return (
              <div key={summit._id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-[#0f1b3d]">{summit.title}</p>
                    <p className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                      <span>{summit.year}</span>
                      <span>{summit.photos.length} photos</span>
                      <span>{summit.agenda.length} agenda items</span>
                      {summit.reportUrl && (
                        <a
                          href={summit.reportUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[#0f1b3d] hover:underline"
                        >
                          <FileText size={12} /> Report
                        </a>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpandedId(expanded ? null : summit._id!)}
                      className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      Photos & Agenda
                    </button>
                    <button
                      onClick={() => setModalSummit(summit)}
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#0f1b3d]"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(summit._id!)}
                      className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {expanded && <SummitContentEditor summit={summit} onSaved={handleContentSaved} />}
              </div>
            );
          })}
        </div>
      )}

      {modalSummit && (
        <SummitModal
          summit={modalSummit}
          onClose={() => setModalSummit(null)}
          onSave={handleSaveMetadata}
        />
      )}
    </div>
  );
}
