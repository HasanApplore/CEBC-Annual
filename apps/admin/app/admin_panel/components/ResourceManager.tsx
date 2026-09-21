"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { MediaField } from "./MediaField";
import { resolveBackendMediaUrl } from "../../../lib/api/client";

export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "media" | "select" | "stringArray";
  options?: string[];
  allowCustom?: boolean;
};

interface ResourceService<T> {
  getAll: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<null>;
}

export function ResourceManager<T extends { _id?: string }>({
  title,
  description,
  service,
  fields,
  columns,
  emptyItem,
  maxItems,
}: {
  title: string;
  description: string;
  service: ResourceService<T>;
  fields: FieldConfig[];
  columns: { key: string; label: string }[];
  emptyItem: Partial<T>;
  maxItems?: number;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customInputActive, setCustomInputActive] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    try {
      setItems(await service.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing({ ...emptyItem });
    setCustomInputActive({});
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing({ ...item });
    setCustomInputActive({});
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      if (editing._id) {
        await service.update(editing._id, editing);
      } else {
        await service.create(editing);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await service.remove(id);
    await load();
  };

  const setField = (key: string, value: unknown) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const atLimit = maxItems !== undefined && items.length >= maxItems;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f1b3d]">{title}</h1>
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {atLimit && (
            <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              Maximum {maxItems} images — delete one to add a new photo
            </span>
          )}
          <button
            onClick={openCreate}
            disabled={atLimit}
            title={atLimit ? `Maximum ${maxItems} items allowed` : undefined}
            className="flex items-center gap-1.5 rounded-lg bg-[#0f1b3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c2f5b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">
                  <Loader2 className="mx-auto animate-spin" size={18} />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">
                  No items yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {columns.map((c) => {
                    const rawVal = (item as Record<string, unknown>)[c.key];
                    const isMediaCol = c.key === "photo" || c.key === "logo" || c.key === "image";
                    return (
                      <td key={c.key} className="max-w-xs truncate px-4 py-3 text-gray-700">
                        {isMediaCol ? (
                          rawVal ? (
                            <img
                              src={resolveBackendMediaUrl(String(rawVal))}
                              alt=""
                              className="h-8 w-12 rounded object-cover border border-gray-200"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">No image</span>
                          )
                        ) : (
                          String(rawVal ?? "")
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(item)}
                      className="mr-2 rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#0f1b3d]"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => item._id && handleDelete(item._id)}
                      className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0f1b3d]">
                {editing._id ? "Edit item" : "New item"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field) => {
                const value = (editing as Record<string, unknown>)[field.key];
                if (field.type === "media") {
                  return (
                    <MediaField
                      key={field.key}
                      label={field.label}
                      value={(value as string) ?? ""}
                      onChange={(url) => setField(field.key, url)}
                    />
                  );
                }
                if (field.type === "textarea") {
                  return (
                    <label key={field.key} className="block text-left text-sm">
                      <span className="font-medium text-gray-700">{field.label}</span>
                      <textarea
                        rows={3}
                        value={(value as string) ?? ""}
                        onChange={(e) => setField(field.key, e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
                      />
                    </label>
                  );
                }
                if (field.type === "select") {
                  const isCustom = Boolean(field.allowCustom && customInputActive[field.key]);
                  const rawOptions = field.options || [];
                  const existingItemOptions = items
                    .map((it) => (it as Record<string, unknown>)[field.key])
                    .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
                  const dynamicOptions = Array.from(new Set([...rawOptions, ...existingItemOptions]));

                  return (
                    <div key={field.key} className="block text-left text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{field.label}</span>
                        {field.allowCustom && (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomInputActive((prev) => ({ ...prev, [field.key]: !isCustom }));
                            }}
                            className="text-xs font-semibold text-[#004aad] hover:underline"
                          >
                            {isCustom ? "Choose from existing" : `+ Add new ${field.label.toLowerCase()}`}
                          </button>
                        )}
                      </div>

                      {isCustom ? (
                        <div className="mt-1">
                          <input
                            type="text"
                            placeholder={`Enter new ${field.label.toLowerCase()} name...`}
                            value={(value as string) ?? ""}
                            onChange={(e) => setField(field.key, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <select
                          value={(value as string) ?? ""}
                          onChange={(e) => {
                            if (field.allowCustom && e.target.value === "__add_new__") {
                              setCustomInputActive((prev) => ({ ...prev, [field.key]: true }));
                              setField(field.key, "");
                            } else {
                              setField(field.key, e.target.value);
                            }
                          }}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
                        >
                          <option value="" disabled>
                            Select…
                          </option>
                          {dynamicOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                          {field.allowCustom && (
                            <option value="__add_new__" className="font-semibold text-[#004aad]">
                              + Add new {field.label.toLowerCase()}…
                            </option>
                          )}
                        </select>
                      )}
                    </div>
                  );
                }
                if (field.type === "stringArray") {
                  const arr = Array.isArray(value) ? (value as string[]) : [];
                  return (
                    <label key={field.key} className="block text-left text-sm">
                      <span className="font-medium text-gray-700">
                        {field.label} <span className="text-gray-400">(one per line)</span>
                      </span>
                      <textarea
                        rows={3}
                        value={arr.join("\n")}
                        onChange={(e) => setField(field.key, e.target.value.split("\n"))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
                      />
                    </label>
                  );
                }
                return (
                  <label key={field.key} className="block text-left text-sm">
                    <span className="font-medium text-gray-700">{field.label}</span>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={(value as string | number) ?? ""}
                      onChange={(e) =>
                        setField(
                          field.key,
                          field.type === "number" ? Number(e.target.value) : e.target.value
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
                    />
                  </label>
                );
              })}
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
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
      )}
    </div>
  );
}
