"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { saveHeroSlide } from "@/app/admin/content-actions";
import { createClient } from "@/lib/supabase/client";
import type { HeroSlide } from "@/lib/site-content";
import { ImageCropModal } from "@/components/admin/image-crop-modal";

const inputClass =
  "w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500";

function FieldPair({
  label,
  hint,
  tr,
  en,
  onTr,
  onEn,
  multiline,
}: {
  label: string;
  hint?: string;
  tr: string;
  en: string;
  onTr: (v: string) => void;
  onEn: (v: string) => void;
  multiline?: boolean;
}) {
  const Field = multiline ? "textarea" : "input";
  return (
    <div>
      <span className="mb-1.5 block text-sm text-ink-muted">
        {label}
        {hint && <span className="ml-1.5 text-xs">{hint}</span>}
      </span>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">Türkçe</span>
          <Field
            rows={multiline ? 3 : undefined}
            value={tr}
            onChange={(e) => onTr(e.target.value)}
            className={`${inputClass} ${multiline ? "resize-none" : ""}`}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">İngilizce</span>
          <Field
            rows={multiline ? 3 : undefined}
            value={en}
            onChange={(e) => onEn(e.target.value)}
            className={`${inputClass} ${multiline ? "resize-none" : ""}`}
          />
        </label>
      </div>
    </div>
  );
}

export function HeroSlideForm({ initial }: { initial: HeroSlide | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [eyebrowTr, setEyebrowTr] = useState(initial?.eyebrow.tr ?? "");
  const [eyebrowEn, setEyebrowEn] = useState(initial?.eyebrow.en ?? "");
  const [title1Tr, setTitle1Tr] = useState(initial?.title1.tr ?? "");
  const [title1En, setTitle1En] = useState(initial?.title1.en ?? "");
  const [title2Tr, setTitle2Tr] = useState(initial?.title2.tr ?? "");
  const [title2En, setTitle2En] = useState(initial?.title2.en ?? "");
  const [subtitleTr, setSubtitleTr] = useState(initial?.subtitle.tr ?? "");
  const [subtitleEn, setSubtitleEn] = useState(initial?.subtitle.en ?? "");
  const [ctaExploreTr, setCtaExploreTr] = useState(
    initial?.ctaExplore.tr ?? "",
  );
  const [ctaExploreEn, setCtaExploreEn] = useState(
    initial?.ctaExplore.en ?? "",
  );
  const [ctaBestsellersTr, setCtaBestsellersTr] = useState(
    initial?.ctaBestsellers.tr ?? "",
  );
  const [ctaBestsellersEn, setCtaBestsellersEn] = useState(
    initial?.ctaBestsellers.en ?? "",
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [preview, setPreview] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  async function handleUpload(file: Blob) {
    setError(null);
    setUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      const supabase = createClient();
      // Kırpma çıktısı her zaman JPEG (crop-image.ts).
      const path = `hero-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      setPreview(data.publicUrl);
    } catch (err) {
      console.error("[admin] hero image upload failed", err);
      setError("Fotoğraf yüklenemedi. Tekrar dene.");
      setPreview(imageUrl);
    } finally {
      URL.revokeObjectURL(objectUrl);
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await saveHeroSlide({
        id: initial?.id,
        eyebrowTr,
        eyebrowEn,
        title1Tr,
        title1En,
        title2Tr,
        title2En,
        subtitleTr,
        subtitleEn,
        ctaExploreTr,
        ctaExploreEn,
        ctaBestsellersTr,
        ctaBestsellersEn,
        imageUrl,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/admin/icerik");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-serif text-xl text-ink">Görsel</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Yüklenmezse çiçek ikonu gösterilir.
        </p>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <div className="aspect-video w-64 shrink-0 overflow-hidden rounded-2xl border border-line bg-blush-100">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-ink-muted">
                <ImagePlus size={26} />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700">
              {uploading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <ImagePlus size={15} />
              )}
              {uploading ? "Yükleniyor…" : "Fotoğraf seç"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPendingFile(file);
                  e.target.value = "";
                }}
              />
            </label>

            {imageUrl && (
              <button
                type="button"
                onClick={() => {
                  setImageUrl(null);
                  setPreview(null);
                }}
                className="block text-sm text-ink-muted underline underline-offset-4 transition-colors hover:text-rose-700"
              >
                Fotoğrafı kaldır (ikona dön)
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-serif text-xl text-ink">Metinler</h2>

        <FieldPair
          label="Üst etiket"
          hint="ör. AYNI GÜN TESLİMAT · DENİZLİ İÇİ"
          tr={eyebrowTr}
          en={eyebrowEn}
          onTr={setEyebrowTr}
          onEn={setEyebrowEn}
        />
        <FieldPair
          label="Başlık — 1. satır"
          tr={title1Tr}
          en={title1En}
          onTr={setTitle1Tr}
          onEn={setTitle1En}
        />
        <FieldPair
          label="Başlık — 2. satır"
          tr={title2Tr}
          en={title2En}
          onTr={setTitle2Tr}
          onEn={setTitle2En}
        />
        <FieldPair
          label="Alt yazı"
          tr={subtitleTr}
          en={subtitleEn}
          onTr={setSubtitleTr}
          onEn={setSubtitleEn}
          multiline
        />
        <FieldPair
          label="1. buton"
          hint="ör. Buketleri keşfet"
          tr={ctaExploreTr}
          en={ctaExploreEn}
          onTr={setCtaExploreTr}
          onEn={setCtaExploreEn}
        />
        <FieldPair
          label="2. buton"
          hint="ör. Çok satanlar"
          tr={ctaBestsellersTr}
          en={ctaBestsellersEn}
          onTr={setCtaBestsellersTr}
          onEn={setCtaBestsellersEn}
        />
      </section>

      {error && (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/icerik")}
          className="rounded-full border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
        >
          Vazgeç
        </button>
      </div>

      {pendingFile && (
        <ImageCropModal
          file={pendingFile}
          aspect={4 / 3}
          onCancel={() => setPendingFile(null)}
          onConfirm={(blob) => {
            setPendingFile(null);
            handleUpload(blob);
          }}
        />
      )}
    </form>
  );
}
