import fs from "node:fs";
import path from "node:path";

const positions = [
  "0% 66.667%",
  "33.333% 66.667%",
  "66.667% 66.667%",
  "100% 66.667%",
  "0% 100%",
  "33.333% 100%",
  "66.667% 100%",
  "100% 100%",
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

function SoonPhoto({ image, index, alt }: { image: string; index: number; alt: string }) {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden bg-[#f3f0eb]">
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-[-12px] bg-no-repeat blur-[10px] saturate-[.82] transition duration-700 group-hover:scale-[1.015] group-hover:blur-[9px]"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "400% 400%",
          backgroundPosition: positions[index],
        }}
      />
      <div className="absolute inset-0 bg-white/5" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/80 bg-black/5 px-4 py-2 text-[12px] font-light tracking-[.08em] text-white backdrop-blur-[1px]">
        قريبًا
      </span>
    </div>
  );
}

export default function ShowcasePage() {
  const base64 = fs.readFileSync(path.join(process.cwd(), "public/showcase-sprite.b64"), "utf8").trim();
  const image = `data:image/webp;base64,${base64}`;

  return (
    <main className="min-h-screen bg-white text-[#171717]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="border-b border-black/10 bg-white">
        <div className="relative mx-auto flex h-[62px] max-w-[1600px] items-center justify-between px-3 md:h-[82px] md:px-8">
          <div className="flex items-center md:hidden">
            <button aria-label="القائمة" className="grid h-9 w-9 place-items-center"><Icon type="menu" /></button>
          </div>

          <nav className="hidden items-center gap-9 text-[12px] font-light md:flex">
            <a href="#soon" className="hover:opacity-55">قريبًا</a>
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

      <section className="relative h-[68vh] min-h-[540px] overflow-hidden md:h-[50vw] md:min-h-[650px] md:max-h-[760px]">
        <div
          role="img"
          aria-label="صورة تحريرية مولدة لامرأة ترتدي مجوهرات أنيقة"
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "auto 200%",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
          <div className="max-w-3xl">
            <p className="mb-5 text-[10px] font-light tracking-[.3em] md:text-[11px]">CHÉRIE BOUTIQUE</p>
            <h1 className="font-serif text-[38px] font-normal leading-[1.25] md:text-[64px]">قريبًا تفتح Chérie Boutique أبوابها</h1>
            <div className="mx-auto mt-7 h-px w-14 bg-white/80" />
          </div>
        </div>
      </section>

      <section id="necklaces" className="mx-auto max-w-[1540px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4 md:mb-12">
          <h2 className="font-serif text-[28px] font-normal md:text-[38px]">القلائد</h2>
          <span className="text-[11px] font-light tracking-[.08em] text-black/45">قريبًا</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-3 md:grid-cols-4 md:gap-x-4">
          {[0, 1, 2, 3].map((index) => <SoonPhoto key={index} image={image} index={index} alt={`صورة مجوهرات مولدة للقلائد ${index + 1}`} />)}
        </div>
      </section>

      <section id="rings" className="mx-auto max-w-[1540px] px-4 pb-16 md:px-8 md:pb-24">
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4 md:mb-12">
          <h2 className="font-serif text-[28px] font-normal md:text-[38px]">الخواتم</h2>
          <span className="text-[11px] font-light tracking-[.08em] text-black/45">قريبًا</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-3 md:grid-cols-4 md:gap-x-4">
          {[4, 5, 6, 7].map((index) => <SoonPhoto key={index} image={image} index={index} alt={`صورة مجوهرات مولدة للخواتم ${index - 3}`} />)}
        </div>
      </section>

      <section id="soon" className="border-y border-black/10">
        <div className="mx-auto flex max-w-[1540px] flex-col items-center justify-center px-6 py-20 text-center md:py-28">
          <p className="text-[10px] font-light tracking-[.28em] text-black/45">CHÉRIE BOUTIQUE</p>
          <h2 className="mt-4 font-serif text-[32px] font-normal md:text-[46px]">قريبًا</h2>
          <p className="mt-4 max-w-xl text-[13px] font-light leading-7 text-black/55">مساحة هادئة للمجوهرات المختارة بعناية، بتجربة عربية أنيقة وبسيطة.</p>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-[1540px] flex-col items-center justify-between gap-5 px-6 py-10 text-center md:flex-row md:px-8">
          <div className="font-serif text-[22px]">Chérie Boutique</div>
          <div className="text-[10px] font-light tracking-[.18em] text-black/40">ÉLÉGANCE CONTEMPORAINE</div>
        </div>
      </footer>
    </main>
  );
}
