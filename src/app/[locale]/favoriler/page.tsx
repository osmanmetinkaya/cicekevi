import { setRequestLocale } from "next-intl/server";
import { getAllProducts } from "@/lib/products";
import { FavoritesListing } from "@/components/favorites/favorites-listing";

/**
 * Favoriler sunucuda render edilir (katalog artık veritabanında), favori
 * id'leriyle eşleştirme istemci tarafındaki FavoritesListing'de yapılır.
 */
export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await getAllProducts();

  return <FavoritesListing products={products} />;
}
