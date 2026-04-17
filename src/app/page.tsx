import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { transformProducts } from "@/lib/transforms";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { BlogCard, type BlogCardPost } from "@/components/blog/BlogCard";
import Image from "next/image";
import Link from "next/link";
import type { ProductsListResponse } from "@/lib/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/storefront/products?size=12`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ProductsListResponse = await res.json();
    return transformProducts(data.items);
  } catch {
    return [];
  }
}

async function getFeaturedPosts() {
  try {
    const res = await fetch(`${API_URL}/store/blog/v2/posts/featured?limit=4`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.posts ?? []) as BlogCardPost[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [displayProducts, featuredPosts] = await Promise.all([
    getProducts(),
    getFeaturedPosts(),
  ]);

  const miuMiuProducts = displayProducts.slice(0, 2);
  const bestSellers = displayProducts.slice(0, 4);
  const mauiJimProducts = displayProducts.slice(2, 6);
  const luxuryClear = displayProducts.slice(4, 8);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] w-full">
      <Header />

      <main id="main-content" className="w-full">

        {/* === S1: Miu Miu Hero Split === */}
        <section className="w-full lg:h-[800px] flex flex-col lg:flex-row border-b border-[#E5E5E5]">
           <div className="w-full lg:w-1/2 h-[500px] lg:h-full relative overflow-hidden bg-black">
              <Image
                 src="/images/home/miu_miu_campaign_1775729723590.png"
                 alt="Miu Miu Campaign"
                 fill
                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                 priority
                 fetchPriority="high"
                 quality={85}
                 className="object-cover object-center opacity-90 transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-3">
                 <span className="text-2xl font-bold tracking-widest uppercase">MIU MIU</span>
              </div>
           </div>
           <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 lg:p-16 text-center bg-white">
              <h1 className="text-3xl font-bold tracking-[0.2em] uppercase mb-8">Designer Sunglasses & Luxury Eyewear - Miu Miu, Maui Jim, Bottega Veneta</h1>
              <p className="max-w-[500px] text-[13px] leading-relaxed text-[#333] mb-4">
                 Miu Miu Eyewear Collection for the new season combines irreverent sophistication with playful flair. The Miu-Miu style reimagines classic allure with a modern twist, with a seamless wraparound design that conveys both elegance and boldness.
              </p>
              <p className="max-w-[500px] text-[13px] leading-relaxed text-[#333] mb-16">
                 The SS26 campaign lives between the real and the unreal, the natural and the hypernatural. It celebrates optimism, beauty and the functionality, blending romance with a touch of rebellion.
              </p>

              <div className="grid grid-cols-2 gap-8 w-full max-w-[600px] mb-12">
                 {miuMiuProducts.map(p => (
                    <div key={p.id} className="flex flex-col items-center">
                       <div className="w-full aspect-[4/3] bg-white mb-4 p-4 relative">
                          {p.image && <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 300px" quality={80} className="object-contain mix-blend-multiply" />}
                       </div>
                       <Link href={`/product/${p.handle}`} className="px-6 py-2 bg-gray-500 text-white text-[11px] uppercase tracking-widest hover:bg-black transition-colors">
                          SHOP
                       </Link>
                    </div>
                 ))}
              </div>

              <Link href="/eyewear?brand=miu-miu" className="px-8 py-3.5 bg-[#1A1A1A] text-white text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors">
                 DISCOVER THE COLLECTION
              </Link>
           </div>
        </section>

        {/* === S2: Maui Jim Banner === */}
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mt-16 mb-24">
           <div className="relative w-full h-[300px] md:h-[450px] lg:h-[600px] mb-12">
              <Image
                 src="/images/home/maui_jim_banner_1775729742958.png"
                 alt="Maui Jim Banner"
                 fill
                 sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 1400px"
                 quality={85}
                 loading="lazy"
                 className="object-cover"
              />
              <div className="absolute bottom-8 left-8 text-white">
                 <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-2">Maui Jim - Color You Can Feel</h2>
              </div>
           </div>

           <div className="text-center mb-12">
              <h3 className="text-[13px] font-bold tracking-[0.1em] uppercase">NEW IN MAUI JIM SS26</h3>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {mauiJimProducts.map((product, i) => (
                 <EnhancedProductCard key={product.id} product={product} index={i} />
              ))}
           </div>

           <div className="flex justify-center">
              <Link href="/eyewear?brand=maui-jim" className="px-8 py-3 bg-[#1A1A1A] text-white text-[11px] uppercase tracking-[0.15em] hover:bg-black transition-colors">
                 DISCOVER MORE
              </Link>
           </div>
        </section>

        {/* === S3: Editorials === */}
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-[#E5E5E5]">
           <p className="text-center text-[12px] leading-relaxed max-w-[800px] mx-auto mb-16 tracking-wide text-[#333]">
              Discover the latest eyewear trends featured in top magazine editorials and covers. From the sleek sophistication of Tom Ford and Cartier to the bold styles of Bottega Veneta and Gucci, elevate your look with fashion-forward frames that define luxury and style.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              <div className="aspect-square bg-gray-100 relative group overflow-hidden">
                 <Image src="/images/home/vogue_cover_1775729762034.png" alt="Vogue Cover" fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" quality={80} loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="aspect-square bg-gray-100 relative group overflow-hidden">
                 <Image src="/images/home/balenciaga_editorial_1775729800168.png" alt="Balenciaga Fashion Editorial" fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" quality={80} loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="aspect-square bg-gray-100 relative group overflow-hidden">
                 <Image src="/images/home/couple_editorial_1775729817725.png" alt="Fashion Couple Editorial" fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" quality={80} loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="aspect-square bg-gray-100 relative group overflow-hidden">
                 <Image src="/images/home/collage_editorial_1775729833211.png" alt="Collage" fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" quality={80} loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
           </div>
        </section>

        {/* === S4: Best Sellers SGH style grid === */}
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-[#E5E5E5]">
           <h3 className="text-center text-[13px] font-bold tracking-[0.1em] uppercase mb-16">BEST SELLERS</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellers.map((product, i) => (
                 <EnhancedProductCard key={product.id} product={product} index={i} />
              ))}
           </div>
        </section>

        {/* === S5: As Seen on Stars === */}
        <section className="bg-[#fcfcfc] w-full py-20 border-t border-[#E5E5E5]">
           <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
              <h3 className="text-center text-[13px] font-bold tracking-[0.1em] uppercase mb-16">AS SEEN ON STARS</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                    { img: '/images/home/celeb_charli_1775729882060.png', label: 'Charli XCX' },
                    { img: '/images/home/celeb_joe_1775729900282.png', label: 'Joe Keery' },
                    { img: '/images/home/celeb_badbunny_1775729918237.png', label: 'Bad Bunny' },
                    { img: '/images/home/celeb_hailey_1775729969417.png', label: 'Hailey Bieber' }
                 ].map((star) => (
                    <div key={star.label} className="flex flex-col items-center">
                       <div className="w-full aspect-square relative mb-6 overflow-hidden">
                          <Image src={star.img} alt={star.label} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw" quality={80} loading="lazy" className="object-cover" />
                       </div>
                       <span className="px-6 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                          {star.label}
                       </span>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* === S6: Luxury in Clear View === */}
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-20 border-t border-[#E5E5E5]">
           <h3 className="text-center text-[13px] font-bold tracking-[0.1em] uppercase mb-16">LUXURY IN CLEAR VIEW</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {luxuryClear.map((product, i) => (
                 <EnhancedProductCard key={product.id} product={product} index={i} />
              ))}
           </div>
        </section>

        {/* === Recently Viewed === */}
        <RecentlyViewed />

        {/* === S7: Blogs (dynamic) === */}
        {featuredPosts.length > 0 && (
          <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-[#E5E5E5]">
            <div className="text-center mb-12">
              <h3 className="text-[13px] font-bold tracking-[0.1em] uppercase mb-8">PERSPECTIVE - Insights Into The World of Eyewear</h3>
              <Link href="/blog" className="text-[11px] font-bold uppercase tracking-[0.15em] underline hover:opacity-60 transition-opacity">
                READ OUR BLOG
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}


      </main>
      
      <Footer />
    </div>
  );
}
