"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
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
    contentService.get().then((data) => {
      setContent(data);
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

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  const setEventInfo = <K extends keyof SiteContent["eventInfo"]>(key: K, value: string) =>
    setContent({ ...content, eventInfo: { ...content.eventInfo, [key]: value } });

  const setAbout = <K extends keyof SiteContent["aboutContent"]>(key: K, value: string) =>
    setContent({ ...content, aboutContent: { ...content.aboutContent, [key]: value } as never });

  const setGallery = <K extends keyof SiteContent["galleryContent"]>(key: K, value: string) =>
    setContent({ ...content, galleryContent: { ...content.galleryContent, [key]: value } });

  const setFooter = <K extends keyof SiteContent["footerContent"]>(key: K, value: string) =>
    setContent({ ...content, footerContent: { ...content.footerContent, [key]: value } as never });

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
          <p className="text-xs text-gray-400">
            About paragraphs (rich list with per-item images) aren't editable here yet — edit via the API/database directly if needed.
          </p>
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
      </div>
    </div>
  );
}
