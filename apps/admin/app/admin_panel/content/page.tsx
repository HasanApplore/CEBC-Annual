"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { contentService, type SiteContent } from "../../../lib/services/content";
import { MediaField } from "../components/MediaField";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block text-left text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
        />
      )}
    </label>
  );
}

export default function ContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    contentService
      .get()
      .then((data) => {
        setContent(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load content");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setError("");
    try {
      const updated = await contentService.update(content);
      setContent(updated);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        <p>{error || "Failed to load content."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-[#0f1b3d] px-4 py-2 text-xs font-medium text-white hover:bg-[#1c2f5b]"
        >
          Retry
        </button>
      </div>
    );
  }

  const setEventInfo = <K extends keyof SiteContent["eventInfo"]>(key: K, value: string) =>
    setContent({ ...content, eventInfo: { ...content.eventInfo, [key]: value } });

  const setAbout = <K extends keyof SiteContent["aboutContent"]>(key: K, value: string) =>
    setContent({ ...content, aboutContent: { ...content.aboutContent, [key]: value } as never });

  const addAboutParagraph = () => {
    const paragraphs = content.aboutContent?.paragraphs ? [...content.aboutContent.paragraphs] : [];
    paragraphs.push({ text: "", image: "", bold: false });
    setContent({
      ...content,
      aboutContent: {
        ...content.aboutContent,
        paragraphs,
      },
    });
  };

  const updateAboutParagraph = (
    index: number,
    field: "text" | "image" | "bold",
    value: string | boolean
  ) => {
    const paragraphs = content.aboutContent?.paragraphs ? [...content.aboutContent.paragraphs] : [];
    if (!paragraphs[index]) return;
    paragraphs[index] = { ...paragraphs[index], [field]: value };
    setContent({
      ...content,
      aboutContent: {
        ...content.aboutContent,
        paragraphs,
      },
    });
  };

  const removeAboutParagraph = (index: number) => {
    const paragraphs = (content.aboutContent?.paragraphs || []).filter((_, i) => i !== index);
    setContent({
      ...content,
      aboutContent: {
        ...content.aboutContent,
        paragraphs,
      },
    });
  };

  const moveAboutParagraph = (index: number, direction: -1 | 1) => {
    const paragraphs = content.aboutContent?.paragraphs ? [...content.aboutContent.paragraphs] : [];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= paragraphs.length) return;
    const [moved] = paragraphs.splice(index, 1);
    paragraphs.splice(targetIndex, 0, moved);
    setContent({
      ...content,
      aboutContent: {
        ...content.aboutContent,
        paragraphs,
      },
    });
  };

  const setGallery = <K extends keyof SiteContent["galleryContent"]>(key: K, value: string) =>
    setContent({ ...content, galleryContent: { ...content.galleryContent, [key]: value } });

  const setFooter = <K extends keyof SiteContent["footerContent"]>(key: K, value: string) =>
    setContent({ ...content, footerContent: { ...content.footerContent, [key]: value } as never });

  const setSocial = (platform: string, href: string) =>
    setContent({
      ...content,
      footerContent: {
        ...content.footerContent,
        socials: content.footerContent.socials.map((s) => (s.platform === platform ? { ...s, href } : s)),
      },
    });

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f1b3d]">Site Content</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Edit the homepage's core content — hero, about, footer and navigation.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-[#0f1b3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c2f5b] disabled:opacity-70"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save changes
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {savedAt && !error && <p className="mb-4 text-sm text-green-600">Saved at {savedAt}</p>}

      <div className="space-y-6">
        <Section title="Event Info">
          <TextField label="Event Name" value={content.eventInfo.name} onChange={(v) => setEventInfo("name", v)} />
          <TextField label="Organizer" value={content.eventInfo.organizer} onChange={(v) => setEventInfo("organizer", v)} />
          <TextField label="Theme" value={content.eventInfo.theme} onChange={(v) => setEventInfo("theme", v)} textarea />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Date Label" value={content.eventInfo.dateLabel} onChange={(v) => setEventInfo("dateLabel", v)} />
            <TextField label="Time Label" value={content.eventInfo.timeLabel} onChange={(v) => setEventInfo("timeLabel", v)} />
          </div>
          <TextField label="Venue" value={content.eventInfo.venue} onChange={(v) => setEventInfo("venue", v)} />
          <TextField
            label="Countdown Target (ISO datetime)"
            value={content.eventInfo.countdownTarget}
            onChange={(v) => setEventInfo("countdownTarget", v)}
          />
          <MediaField label="Logo" value={content.eventInfo.logoUrl} onChange={(v) => setEventInfo("logoUrl", v)} />
          <MediaField label="Hero Image" value={content.eventInfo.heroImageUrl} onChange={(v) => setEventInfo("heroImageUrl", v)} />
          <MediaField label="Hero Video" value={content.eventInfo.heroVideoUrl} onChange={(v) => setEventInfo("heroVideoUrl", v)} />
          <MediaField
            label="Past Event Hero Video"
            value={content.eventInfo.galleryHeroVideoUrl}
            onChange={(v) => setEventInfo("galleryHeroVideoUrl", v)}
          />
        </Section>

        <Section title="About Section">
          <TextField label="Heading" value={content.aboutContent.heading} onChange={(v) => setAbout("heading", v)} />
          <TextField label="Subheading" value={content.aboutContent.subheading} onChange={(v) => setAbout("subheading", v)} textarea />

          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Paragraphs & Media</h3>
                <p className="text-xs text-gray-500">
                  Manage the numbered points, thumbnail images, and optional highlight closing quote.
                </p>
              </div>
              <button
                type="button"
                onClick={addAboutParagraph}
                className="flex items-center gap-1 rounded-lg bg-[#0f1b3d] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1c2f5b]"
              >
                <Plus size={14} />
                Add paragraph
              </button>
            </div>

            {(!content.aboutContent.paragraphs || content.aboutContent.paragraphs.length === 0) ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-xs text-gray-400">
                No paragraphs added yet. Click &quot;Add paragraph&quot; to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {content.aboutContent.paragraphs.map((p, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:border-gray-300"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f1b3d] text-[10px] text-white">
                          {idx + 1}
                        </span>
                        {p.bold ? "Closing Highlight Quote" : `Point ${String(idx + 1).padStart(2, "0")}`}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveAboutParagraph(idx, -1)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.aboutContent.paragraphs.length - 1}
                          onClick={() => moveAboutParagraph(idx, 1)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAboutParagraph(idx)}
                          className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                          title="Delete paragraph"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-left text-sm">
                        <span className="text-xs font-medium text-gray-700">Paragraph Text</span>
                        <textarea
                          rows={3}
                          value={p.text}
                          onChange={(e) => updateAboutParagraph(idx, "text", e.target.value)}
                          placeholder="Enter paragraph text..."
                          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f1b3d]"
                        />
                      </label>

                      {!p.bold && (
                        <MediaField
                          label="Thumbnail Image"
                          value={p.image || ""}
                          onChange={(url) => updateAboutParagraph(idx, "image", url)}
                          accept="image/*"
                        />
                      )}

                      <label className="flex items-center gap-2 pt-1 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={Boolean(p.bold)}
                          onChange={(e) => updateAboutParagraph(idx, "bold", e.target.checked)}
                          className="rounded border-gray-300 text-[#0f1b3d] focus:ring-[#0f1b3d]"
                        />
                        <span>Featured Closing Highlight (renders as bold accent quote at the bottom of the section)</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section title="Past Event Header">
          <TextField label="Eyebrow" value={content.galleryContent.eyebrow} onChange={(v) => setGallery("eyebrow", v)} />
          <TextField label="Heading" value={content.galleryContent.heading} onChange={(v) => setGallery("heading", v)} />
          <TextField label="Subheading" value={content.galleryContent.subheading} onChange={(v) => setGallery("subheading", v)} textarea />
          <MediaField
            label="Summit Report (PDF)"
            value={content.galleryContent.reportUrl}
            onChange={(v) => setGallery("reportUrl", v)}
            accept="application/pdf"
          />
        </Section>

        <Section title="Footer">
          <TextField label="About" value={content.footerContent.about} onChange={(v) => setFooter("about", v)} textarea />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Email" value={content.footerContent.email} onChange={(v) => setFooter("email", v)} />
            <TextField label="Address" value={content.footerContent.address} onChange={(v) => setFooter("address", v)} />
          </div>
          <MediaField
            label="Background Video"
            value={content.footerContent.backgroundVideoUrl}
            onChange={(v) => setFooter("backgroundVideoUrl", v)}
          />
        </Section>

        <Section title="Social Links">
          {content.footerContent.socials.map((social) => (
            <TextField
              key={social.platform}
              label={social.platform}
              value={social.href}
              onChange={(v) => setSocial(social.platform, v)}
            />
          ))}
          <p className="text-xs text-gray-400">
            To add or remove a platform entirely (not just its link), edit via the API/database directly.
          </p>
        </Section>

        <Section title="Sponsors">
          <MediaField
            label="Sponsorship Package (PDF)"
            value={content.sponsorPackageUrl}
            onChange={(v) => setContent({ ...content, sponsorPackageUrl: v })}
            accept="application/pdf"
          />
          <p className="text-xs text-gray-400">
            Powers the "Become a Sponsor" button — links here once set, otherwise falls back to the Register section.
          </p>
        </Section>
      </div>
    </div>
  );
}
