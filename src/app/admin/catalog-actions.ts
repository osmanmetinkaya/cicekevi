"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_ACCENTS, type ProductAccent } from "@/lib/types";
import { slugify } from "@/lib/slug";

/**
 * Katalog (ürün + kategori) yazma işlemleri. Admin panelinden çağrılır.
 *
 * RLS zaten yalnızca app_metadata.role = 'admin' olan kullanıcıya yazma izni
 * verir; buradaki kontrol ikinci katman (defense in depth) ve kullanıcıya
 * anlaşılır bir hata döndürmek için.
 */

export interface ProductInput {
  /** Yeni üründe boş bırakılabilir (slug'dan türetilir); düzenlemede sabit. */
  id?: string;
  slug: string;
  nameTr: string;
  nameEn: string;
  taglineTr: string;
  taglineEn: string;
  descriptionTr: string;
  descriptionEn: string;
  /** Kuruş cinsinden (TL × 100). */
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

export interface CategoryInput {
  /** Boşsa yeni kategori. */
  id?: string;
  slug: string;
  labelTr: string;
  labelEn: string;
  parentId: string | null;
  sortOrder: number;
}

type Result = { error: string | null };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return supabase;
}

/** Vitrin dinamik render edildiği için şart değil; yine de önbellekleri tazele. */
function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/urunler");
  revalidatePath("/admin/kategoriler");
}

function isAccent(value: string): value is ProductAccent {
  return (PRODUCT_ACCENTS as string[]).includes(value);
}

function cleanList(values: string[]): string[] {
  return values.map((v) => v.trim()).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Ürünler
// ---------------------------------------------------------------------------

export async function saveProduct(
  input: ProductInput,
): Promise<Result & { id?: string }> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const nameTr = input.nameTr.trim();
  const nameEn = input.nameEn.trim();
  if (!nameTr || !nameEn) {
    return { error: "Türkçe ve İngilizce ürün adı zorunlu." };
  }

  const slug = slugify(input.slug || nameTr);
  if (!slug) return { error: "Geçerli bir slug gir." };

  // Mevcut ürünlerin id'si kullanıcıların localStorage sepet/favori
  // kayıtlarında referans olarak duruyor — ASLA değiştirilmez.
  const id = (input.id ?? "").trim() || slug;

  if (!Number.isInteger(input.priceKurus) || input.priceKurus <= 0) {
    return { error: "Fiyat 0'dan büyük olmalı." };
  }
  if (!isAccent(input.accent)) {
    return { error: "Geçersiz placeholder rengi." };
  }

  const row = {
    id,
    slug,
    name_tr: nameTr,
    name_en: nameEn,
    tagline_tr: input.taglineTr.trim(),
    tagline_en: input.taglineEn.trim(),
    description_tr: input.descriptionTr.trim(),
    description_en: input.descriptionEn.trim(),
    price_kurus: input.priceKurus,
    flowers_tr: cleanList(input.flowersTr),
    flowers_en: cleanList(input.flowersEn),
    accent: input.accent,
    image_url: input.imageUrl?.trim() || null,
    is_new: input.isNew,
    is_bestseller: input.isBestseller,
    sort_order: Number.isFinite(input.sortOrder) ? input.sortOrder : 0,
  };

  const { error } = await supabase
    .from("products")
    .upsert(row, { onConflict: "id" });

  if (error) {
    console.error("[admin] product save failed", error);
    if (error.code === "23505") {
      return { error: "Bu slug veya id başka bir üründe kullanılıyor." };
    }
    return { error: "Ürün kaydedilemedi." };
  }

  // Kategori bağlantılarını sıfırdan kur (az sayıda satır, en basit yol).
  const { error: delError } = await supabase
    .from("product_categories")
    .delete()
    .eq("product_id", id);
  if (delError) {
    console.error("[admin] product category reset failed", delError);
    return { error: "Kategoriler güncellenemedi." };
  }

  const links = [...new Set(input.categoryIds)].map((categoryId) => ({
    product_id: id,
    category_id: categoryId,
  }));
  if (links.length > 0) {
    const { error: linkError } = await supabase
      .from("product_categories")
      .insert(links);
    if (linkError) {
      console.error("[admin] product category insert failed", linkError);
      return { error: "Kategoriler kaydedilemedi." };
    }
  }

  revalidateStorefront();
  return { error: null, id };
}

export async function deleteProduct(id: string): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("[admin] product delete failed", error);
    return { error: "Ürün silinemedi." };
  }

  revalidateStorefront();
  return { error: null };
}

/** Ürünü vitrinden gizler/geri getirir — veriler korunur, yalnızca satılabilirlik değişir. */
export async function setProductActive(
  id: string,
  isActive: boolean,
): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) {
    console.error("[admin] product active toggle failed", error);
    return { error: "Durum güncellenemedi." };
  }

  revalidateStorefront();
  return { error: null };
}

// ---------------------------------------------------------------------------
// Kategoriler
// ---------------------------------------------------------------------------

export async function saveCategory(input: CategoryInput): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const labelTr = input.labelTr.trim();
  const labelEn = input.labelEn.trim();
  if (!labelTr || !labelEn) {
    return { error: "Türkçe ve İngilizce etiket zorunlu." };
  }

  const slug = slugify(input.slug || labelTr);
  if (!slug) return { error: "Geçerli bir slug gir." };

  const row = {
    slug,
    label_tr: labelTr,
    label_en: labelEn,
    parent_id: input.parentId || null,
    sort_order: Number.isFinite(input.sortOrder) ? input.sortOrder : 0,
  };

  // Kendi kendinin üstü olamaz.
  if (input.id && input.parentId === input.id) {
    return { error: "Bir kategori kendi üst kategorisi olamaz." };
  }

  const query = input.id
    ? supabase.from("categories").update(row).eq("id", input.id)
    : supabase.from("categories").insert(row);

  const { error } = await query;
  if (error) {
    console.error("[admin] category save failed", error);
    if (error.code === "23505") {
      return { error: "Bu slug başka bir kategoride kullanılıyor." };
    }
    return { error: "Kategori kaydedilemedi." };
  }

  revalidateStorefront();
  return { error: null };
}

export async function deleteCategory(id: string): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  // on delete cascade: alt kategoriler ve ürün-kategori bağlantıları da
  // silinir. ÜRÜNLERİN KENDİSİ SİLİNMEZ, yalnızca bu kategoriden çıkar.
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    console.error("[admin] category delete failed", error);
    return { error: "Kategori silinemedi." };
  }

  revalidateStorefront();
  return { error: null };
}
