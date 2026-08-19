// Preview-only homepage for owner visual review; do not merge without approval.
import Image from "next/image";

const jewelry = Array.from({ length: 8 }, (_, index) => `/showcase/jewelry-${index + 1}.webp`);

const world = [
  { label: "الأزياء", image: "/showcase/fashion.webp" },
  { label: "الحقائب", image: "/showcase/bags.webp" },
  { label: "الأحذية", image: "/showcase/shoes.webp" },
  { label: "العطور", image: "/showcase/fragrance.webp" },
  { label: "الإكسسوارات", image: "/showcase/accessories.webp" },
] as const;

function Icon({ type }: { type: "menu" | "search" | "account" | "heart" }) {
  const paths = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    account: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.8-4 3.1-6 6.5-6s5.7 2 6.5 6" /></>,
    heart: <path d="M20.8 5.8c-1.9-2-5-2-6.9 0L12 7.8l-1.9-2c-1.9-2-5-2-6.9 0-1.8 1.9-1.8 5 0 6.9L12 21l8.8-8.3c1.8-1.9 1.8-5 0-6.9Z" />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

function SoonImage({ src, alt, blur = "blur-[9px]" }: { src: string; alt: string; blur?: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f1ec]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 50vw, 25vw"
        className={`object-cover scale-[1.04] ${blur}`}
        quality={78}
      />
      <div className="absolute inset-0 bg-black/[0.04]" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/80 bg-black/10 px-3 py-1.5 text-[11px] font-light tracking-[.08em] text-white backdrop-blur-[1px] md:px-4 md:py-2 md:text-[12px]">قريبًا</span>
    </div>
  );
}

export default function ShowcasePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#171717]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="border-b border-black/10 bg-white">
        <div className="relative mx-auto flex h-[62px] max-w-[1600px] items-center justify-between px-3 md:h-[82px] md:px-8">
          <div className="flex items-center md:hidden"><button aria-label="القائمة" className="grid h-9 w-9 place-items-center"><Icon type="menu" /></button></div>
          <nav className="hidden items-center gap-9 text-[12px] font-light md:flex" aria-label="أقسام العرض">
            <a href="#world" className="hover:opacity-55">عالم Chérie</a>
            <a href="#rings" className="hover:opacity-55">الخواتم</a>
            <a href="#necklaces" className="hover:opacity-55">القلائد</a>
          </nav>
          <a href="/showcase" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center" aria-label="Chérie Boutique">
            <span className="block font-serif text-[23px] leading-none tracking-[.01em] md:text-[31px]">Chérie</span>
            <span className="mt-1 block text-[7px] tracking-[.34em] text-black/60 md:text-[9px]">BOUTIQUE</span>
          </a>
          <div className="flex items-center gap-0 md:gap-2">
            <button aria-label="البحث" className="grid h-9 w-8 place-items-center md:w-9"><Icon type="search" /></button>
            <button aria-label="الحساب" className="grid h-9 w-8 place-items-center md:w-9"><Icon type="account" /></button>
            <button aria-label="المفضلة" className="grid h-9 w-8 place-items-center md:w-9"><Icon type="heart" /></button>
          </div>
        </div>
      </header>

      <section className="relative h-[68vh] min-h-[540px] overflow-hidden md:h-[48vw] md:min-h-[650px] md:max-h-[760px]">
        <Image src="/showcase/hero.webp" alt="امرأة بإطلالة راقية ترتدي مجوهرات" fill priority sizes="100vw" className="object-cover object-[62%_center] md:object-center" quality={88} />
        <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
          <div className="max-w-3xl">
            <p className="mb-5 text-[10px] font-light tracking-[.3em] md:text-[11px]">CHÉRIE BOUTIQUE</p>
            <h1 className="font-serif text-[38px] font-normal leading-[1.25] md:text-[64px]">قريبًا تفتح Chérie Boutique أبوابها</h1>
            <div className="mx-auto mt-7 h-px w-14 bg-white/80" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1540px] px-4 py-16 md:px-8 md:py-24" aria-labelledby="jewelry-title">
        <div className="mx-auto mb-11 max-w-3xl text-center md:mb-16">
          <div className="mb-3 flex items-center justify-center gap-3">
            <h2 id="jewelry-title" className="font-serif text-[32px] font-normal md:text-[44px]">المجوهرات</h2>
            <span className="border border-[#b58b43]/40 bg-[#f7f1e5] px-2.5 py-1 text-[9px] tracking-[.14em] text-[#7d622f]">LAUNCHING</span>
          </div>
          <p className="text-[13px] font-light leading-7 text-black/55 md:text-[14px]">وجهة نسائية مختارة للأزياء والمجوهرات والعطور وتفاصيل الأناقة المعاصرة</p>
        </div>

        <div id="necklaces" className="mb-12 md:mb-16">
          <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-3">
            <h3 className="font-serif text-[24px] font-normal md:text-[30px]">القلائد</h3>
            <span className="text-[10px] font-light tracking-[.12em] text-black/40">JEWELRY · LAUNCHING</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
            {jewelry.slice(0, 4).map((src, index) => <SoonImage key={src} src={src} alt={`صورة مجوهرات مولدة للقلائد ${index + 1}`} />)}
          </div>
        </div>

        <div id="rings">
          <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-3">
            <h3 className="font-serif text-[24px] font-normal md:text-[30px]">الخواتم</h3>
            <span className="text-[10px] font-light tracking-[.12em] text-black/40">JEWELRY · LAUNCHING</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
            {jewelry.slice(4).map((src, index) => <SoonImage key={src} src={src} alt={`صورة مجوهرات مولدة للخواتم ${index + 1}`} />)}
          </div>
        </div>
      </section>

      <section id="world" className="border-t border-black/10 px-4 py-16 md:px-8 md:py-24" aria-labelledby="world-title">
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
              <article key={item.label} className="relative aspect-[4/5] overflow-hidden bg-[#f4f1ec]">
                <Image src={item.image} alt={`صورة تحريرية مولدة لفئة ${item.label}`} fill sizes="(max-width: 767px) 100vw, 20vw" className="object-cover scale-[1.025] blur-[3px]" quality={80} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                  <p className="font-serif text-[26px] md:text-[28px]">{item.label}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] tracking-[.14em] text-white/80">COMING SOON</span>
                    <span className="border border-white/75 px-2.5 py-1 text-[10px]">قريبًا</span>
                  </div>
                </div>
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
