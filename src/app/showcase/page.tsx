// Preview-only homepage for owner visual review; do not merge without approval.
import Image from "next/image";

import { ShowcaseHeader } from "./showcase-header";

const jewelry = Array.from({ length: 8 }, (_, index) => `/showcase/jewelry-${index + 1}.webp`);

const world = [
  { id: "fashion", label: "الأزياء", image: "/showcase/fashion.webp" },
  { id: "bags", label: "الحقائب", image: "/showcase/bags.webp" },
  { id: "shoes", label: "الأحذية", image: "/showcase/shoes.webp" },
  { id: "fragrance", label: "العطور", image: "/showcase/fragrance.webp" },
  { id: "accessories", label: "الإكسسوارات", image: "/showcase/accessories.webp" },
] as const;

function SoonImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f1ec]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 50vw, 25vw"
        className="object-cover"
        quality={82}
      />
    </div>
  );
}

export default function ShowcasePage() {
  return (
    <main className="min-h-screen scroll-smooth overflow-x-hidden bg-white text-[#171717]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <ShowcaseHeader />

      <section className="relative h-[68vh] min-h-[540px] overflow-hidden md:h-[48vw] md:min-h-[650px] md:max-h-[760px]">
        <Image src="/showcase/hero.webp" alt="امرأة بإطلالة راقية ترتدي مجوهرات" fill priority sizes="100vw" className="object-cover object-[62%_center] md:object-center" quality={88} />
        <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
          <div className="max-w-3xl">
            <p className="mb-5 text-[10px] font-light tracking-[.3em] md:text-[11px]">CHÉRIE BOUTIQUE</p>
            <h1 className="font-serif text-[38px] font-normal leading-[1.25] md:text-[64px]">قريبًا تفتح Chérie Boutique أبوابها</h1>
            <div className="mx-auto mt-7 h-px w-14 bg-white/80" />
            <a
              href="#jewelry-title"
              className="mt-8 inline-flex border-b border-white/90 pb-2 text-[12px] font-light tracking-[.04em] transition-opacity hover:opacity-65 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              استكشفي عالم Chérie
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1540px] px-4 py-16 md:px-8 md:py-24" aria-labelledby="jewelry-title">
        <div className="mx-auto mb-11 max-w-3xl text-center md:mb-16">
          <div className="mb-3 flex items-center justify-center gap-3">
            <h2 id="jewelry-title" className="scroll-mt-[150px] font-serif text-[32px] font-normal md:text-[44px]">المجوهرات</h2>
            <span className="border border-[#b58b43]/40 bg-[#f7f1e5] px-2.5 py-1 text-[9px] tracking-[.14em] text-[#7d622f]">LAUNCHING</span>
          </div>
          <p className="text-[13px] font-light leading-7 text-black/55 md:text-[14px]">وجهة نسائية مختارة للأزياء والمجوهرات والعطور وتفاصيل الأناقة المعاصرة</p>
        </div>

        <div id="necklaces" className="mb-12 scroll-mt-[150px] md:mb-16">
          <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-3">
            <h3 className="font-serif text-[24px] font-normal md:text-[30px]">القلائد</h3>
            <span className="text-[10px] font-light tracking-[.12em] text-black/40">JEWELRY · LAUNCHING</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
            {jewelry.slice(0, 4).map((src, index) => <SoonImage key={src} src={src} alt={`صورة مجوهرات مولدة للقلائد ${index + 1}`} />)}
          </div>
        </div>

        <div id="rings" className="scroll-mt-[150px]">
          <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-3">
            <h3 className="font-serif text-[24px] font-normal md:text-[30px]">الخواتم</h3>
            <span className="text-[10px] font-light tracking-[.12em] text-black/40">JEWELRY · LAUNCHING</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
            {jewelry.slice(4).map((src, index) => <SoonImage key={src} src={src} alt={`صورة مجوهرات مولدة للخواتم ${index + 1}`} />)}
          </div>
        </div>
      </section>

      <section id="world" className="scroll-mt-[150px] border-t border-black/10 px-4 py-16 md:px-8 md:py-24" aria-labelledby="world-title">
        <div className="mx-auto max-w-[1540px]">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <div className="mb-3 flex items-center justify-center gap-3">
              <h2 id="world-title" className="font-serif text-[32px] font-normal md:text-[44px]">عالم Chérie</h2>
              <span className="border border-black/10 bg-[#f7f5f1] px-2.5 py-1 text-[9px] tracking-[.14em] text-black/45">COMING SOON</span>
            </div>
            <p className="text-[13px] font-light leading-7 text-black/50">Chérie Boutique كوجهة شاملة للمرأة والأزياء والأناقة، مع بقاء الإطلاق التجاري الحالي للمجوهرات فقط.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-5 md:gap-4">
            {world.map((item) => (
              <article
                key={item.label}
                id={item.id}
                aria-label={`${item.label} — قريبًا`}
                className="relative aspect-[4/3] scroll-mt-[150px] overflow-hidden bg-[#f4f1ec]"
              >
                <Image
                  src={item.image}
                  alt={`صورة تحريرية مولدة لفئة ${item.label}`}
                  fill
                  sizes="(max-width: 767px) 100vw, 20vw"
                  className="object-cover"
                  quality={82}
                />
                <span className="sr-only">{item.label} — قريبًا</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1540px] flex-col items-center justify-between gap-5 px-6 py-10 text-center md:flex-row md:px-8">
          <div className="font-serif text-[22px]">Chérie Boutique</div>
          <div className="text-[10px] font-light tracking-[.18em] text-black/40">ÉLÉGANCE CONTEMPORAINE</div>
        </div>
      </footer>
    </main>
  );
}
