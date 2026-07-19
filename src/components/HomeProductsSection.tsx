import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { products } from "@/data/products";

export default function HomeProductsSection() {
  const locale = useLocale();
  const visibleProducts = products.filter((product) => Boolean(product.image)).slice(0, 6);
  const isThai = locale === "th";

  if (visibleProducts.length === 0) return null;

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="home-products-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Our Products
            </p>
            <h2 id="home-products-title" className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {isThai ? "ผลิตภัณฑ์ของเรา" : "Our Products"}
            </h2>
          </div>
          <Link href="/products" className="shrink-0 text-sm font-semibold text-blue-800 hover:text-blue-950">
            {isThai ? "ดูทั้งหมด" : "View all"} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <article key={product.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Link href={`/products/${product.slug}`} className="group block h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={product.image as string}
                    alt={product.imageAlt || product.name || product.slug}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                    {product.brand === "captain-maid"
                      ? "Captain Maid"
                      : product.brand === "genuleaf"
                        ? "GenuLeaf"
                        : "CeraTory"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-950">
                    {product.name || product.slug}
                  </h3>
                  {product.shortBenefit && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {product.shortBenefit}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
