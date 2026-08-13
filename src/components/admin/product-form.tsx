"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { saveProduct } from "@/app/admin/catalog-actions";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { PRODUCT_ACCENTS } from "@/lib/types";
import { ImageCropModal } from "@/components/admin/image-crop-modal";

export interface CategoryOption {
  id: string;
  label: string;
  /** 0 = grup, 1 = kategori, 2 = alt kategori (girinti için). */
  depth: number;
}

export interface ProductFormInitial {
  id: string;
  slug: string;
  nameTr: string;
  nameEn: string;
  taglineTr: string;
  taglineEn: string;
  descriptionTr: string;
  descriptionEn: string;
  priceKurus: number;
  flowersTr: string[];
  flowersEn: string[];
  accent: string;
  imageUrls: string[];
  isNew: boolean;
  isBestseller: boolean;
  sortOrder: number;
  categoryIds: string[];
}

const inputClass =
  "w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ink-muted">
        {label}
        {hint && <span className="ml-1.5 text-xs">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/**
 * Ürün ekleme/düzenleme formu.
 *
 * Fotoğraflar tarayıcıdan doğrudan Supabase Storage'a (`product-images`)
 * yüklenir; kaydedilen tek şey public URL listesi. İlk fotoğraf kapak
 * (kart/sepet/liste) olarak kullanılır — sıralama ok butonlarıyla
 * değişebilir. Ürün `id`'si düzenlemede DEĞİŞTİRİLEMEZ — müşterilerin
 * localStorage sepet/favori kayıtları bu id'ye referans veriyor.
 */
export function ProductForm({
  initial,
  categories,
  defaultSortOrder = 0,
}: {
  initial: ProductFormInitial | null;
  categories: CategoryOption[];
  /** Yeni üründe önerilen sıra (listenin sonu). */
  defaultSortOrder?: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [nameTr, setNameTr] = useState(initial?.nameTr ?? "");
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [taglineTr, setTaglineTr] = useState(initial?.taglineTr ?? "");
  const [taglineEn, setTaglineEn] = useState(initial?.taglineEn ?? "");
  const [descTr, setDescTr] = useState(initial?.descriptionTr ?? "");
  const [descEn, setDescEn] = useState(initial?.descriptionEn ?? "");
  const [priceTl, setPriceTl] = useState(
    initial ? String(initial.priceKurus / 100) : "",
  );
  const [flowersTr, setFlowersTr] = useState(
    (initial?.flowersTr ?? []).join(", "),
  );
  const [flowersEn, setFlowersEn] = useState(
    (initial?.flowersEn ?? []).join(", "),
  );
  const [accent, setAccent] = useState(initial?.accent ?? "blush");
  const [imageUrls, setImageUrls] = useState<string[]>(
    initial?.imageUrls ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isNew, setIsNew] = useState(initial?.isNew ?? false);
  const [isBestseller, setIsBestseller] = useState(
    initial?.isBestseller ?? false,
  );
  const [sortOrder, setSortOrder] = useState(
    String(initial?.sortOrder ?? defaultSortOrder),
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initial?.categoryIds ?? [],
  );

  const effectiveSlug = slugTouched ? slug : slugify(nameTr);

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImageUrls((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload(file: Blob) {
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      // Kırpma çıktısı her zaman JPEG (crop-image.ts).
      const base = slugify(effectiveSlug || nameTr) || "urun";
      const path = `${base}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      setImageUrls((prev) => [...prev, data.publicUrl]);
    } catch (err) {
      console.error("[admin] image upload failed", err);
      setError("Fotoğraf yüklenemedi. Tekrar dene.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Math.round(Number(priceTl.replace(",", ".")) * 100);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Geçerli bir fiyat gir (ör. 549).");
      return;
    }

    startTransition(async () => {
      const res = await saveProduct({
        id: initial?.id,
        slug: effectiveSlug,
        nameTr,
        nameEn,
        taglineTr,
        taglineEn,
        descriptionTr: descTr,
        descriptionEn: descEn,
        priceKurus: price,
        flowersTr: flowersTr.split(",").map((s) => s.trim()),
        flowersEn: flowersEn.split(",").map((s) => s.trim()),
        accent,
        imageUrls,
        isNew,
        isBestseller,
        sortOrder: Number(sortOrder) || 0,
        categoryIds,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/admin/urunler");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-serif text-xl text-ink">Temel bilgiler</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Ürün adı (TR)">
            <input
              required
              value={nameTr}
              onChange={(e) => setNameTr(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Ürün adı (EN)">
            <input
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Kısa açıklama (TR)" hint="ör. Güller · şakayık">
            <input
              value={taglineTr}
              onChange={(e) => setTaglineTr(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Kısa açıklama (EN)">
            <input
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Açıklama (TR)">
            <textarea
              rows={4}
              value={descTr}
              onChange={(e) => setDescTr(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Açıklama (EN)">
            <textarea
              rows={4}
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Fiyat (TL)" hint="ör. 549">
            <input
              required
              inputMode="decimal"
              value={priceTl}
              onChange={(e) => setPriceTl(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Sıra" hint="küçük olan önce görünür">
            <input
              inputMode="numeric"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Slug (URL)" hint="isimden otomatik türer">
            <input
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={inputClass}
            />
          </Field>
          {initial && (
            <Field
              label="Ürün kodu (id)"
              hint="değiştirilemez — sepet/favori kayıtları buna bağlı"
            >
              <input
                readOnly
                value={initial.id}
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
            </Field>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="İçindekiler (TR)" hint="virgülle ayır">
            <input
              value={flowersTr}
              onChange={(e) => setFlowersTr(e.target.value)}
              placeholder="Kırmızı gül, Cipso, Yeşillik"
              className={inputClass}
            />
          </Field>
          <Field label="İçindekiler (EN)" hint="virgülle ayır">
            <input
              value={flowersEn}
              onChange={(e) => setFlowersEn(e.target.value)}
              placeholder="Red rose, Baby's breath, Greenery"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="size-4 accent-rose-700"
            />
            Yeni
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="size-4 accent-rose-700"
            />
            Çok satan
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-serif text-xl text-ink">Fotoğraflar</h2>
        <p className="mt-1 text-sm text-ink-muted">
          İlk fotoğraf kapak görseli olur (kart, sepet, liste). Fotoğraf
          eklemezsen ürün, renk temasına göre çizilen placeholder görselle
          gösterilir.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {imageUrls.map((url, i) => (
            <div
              key={url}
              className="relative size-32 shrink-0 overflow-hidden rounded-2xl border border-line bg-cream"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 rounded-full bg-rose-700 px-2 py-0.5 text-[10px] font-medium text-white">
                  Kapak
                </span>
              )}
              <div className="absolute right-1.5 bottom-1.5 flex gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    aria-label="Öne taşı"
                    className="rounded-full bg-white/90 p-1 text-ink shadow-sm hover:bg-white"
                  >
                    <ChevronLeft size={13} />
                  </button>
                )}
                {i < imageUrls.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    aria-label="Geriye taşı"
                    className="rounded-full bg-white/90 p-1 text-ink shadow-sm hover:bg-white"
                  >
                    <ChevronRight size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Fotoğrafı kaldır"
                  className="rounded-full bg-white/90 p-1 text-rose-700 shadow-sm hover:bg-white"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}

          <label className="flex size-32 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line text-ink-muted transition-colors hover:border-blush-300 hover:text-rose-700">
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ImagePlus size={20} />
            )}
            <span className="text-xs">
              {uploading ? "Yükleniyor…" : "Fotoğraf ekle"}
            </span>
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
        </div>

        <div className="mt-4 max-w-xs">
          <Field label="Placeholder rengi" hint="fotoğraf yokken kullanılır">
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {PRODUCT_ACCENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-serif text-xl text-ink">Kategoriler</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Ürün birden fazla kategoride görünebilir.
        </p>
        <div className="mt-4 space-y-1">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 py-1 text-sm text-ink"
              style={{ paddingLeft: `${c.depth * 20}px` }}
            >
              <input
                type="checkbox"
                checked={categoryIds.includes(c.id)}
                onChange={() => toggleCategory(c.id)}
                className="size-4 accent-rose-700"
              />
              <span className={c.depth === 0 ? "font-medium" : ""}>
                {c.label}
              </span>
            </label>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-ink-muted">
              Henüz kategori yok. Önce Kategoriler sayfasından ekle.
            </p>
          )}
        </div>
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
          onClick={() => router.push("/admin/urunler")}
          className="rounded-full border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
        >
          Vazgeç
        </button>
      </div>

      {pendingFile && (
        <ImageCropModal
          file={pendingFile}
          aspect={1}
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
