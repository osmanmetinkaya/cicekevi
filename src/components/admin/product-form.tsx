"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { saveProduct } from "@/app/admin/catalog-actions";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { PRODUCT_ACCENTS } from "@/lib/types";

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
  imageUrl: string | null;
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
 * Fotoğraf tarayıcıdan doğrudan Supabase Storage'a (`product-images`)
 * yüklenir; kaydedilen tek şey public URL. Ürün `id`'si düzenlemede
 * DEĞİŞTİRİLEMEZ — müşterilerin localStorage sepet/favori kayıtları bu
 * id'ye referans veriyor.
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
  const [imageUrl, setImageUrl] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [preview, setPreview] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
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

  async function handleUpload(file: File) {
    setError(null);
    setUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const base = slugify(effectiveSlug || nameTr) || "urun";
      const path = `${base}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      setImageUrl(data.publicUrl);
      setPreview(data.publicUrl);
    } catch (err) {
      console.error("[admin] image upload failed", err);
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
        imageUrl,
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
        <h2 className="font-serif text-xl text-ink">Fotoğraf</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Fotoğraf yüklemezsen ürün, renk temasına göre çizilen placeholder
          görselle gösterilir.
        </p>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <div className="size-32 shrink-0 overflow-hidden rounded-2xl border border-line bg-cream">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="size-full object-cover"
              />
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
                  if (file) handleUpload(file);
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
                Fotoğrafı kaldır (placeholder&apos;a dön)
              </button>
            )}

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
    </form>
  );
}
