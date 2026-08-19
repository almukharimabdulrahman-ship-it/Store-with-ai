import Link from "next/link";

const products = [
  { name: "قلادة لوميير", meta: "فضة إسترلينية 925", price: "265 د.ل", kind: "necklace", tone: "ivory" },
  { name: "خاتم سيلين", meta: "فضة إسترلينية 925", price: "220 د.ل", kind: "ring", tone: "sand" },
  { name: "قلادة أورا", meta: "مطلي بالذهب", price: "295 د.ل", kind: "pendant", tone: "rose" },
  { name: "خاتم Éclat", meta: "مطلي بالذهب", price: "240 د.ل", kind: "ring-double", tone: "cream" },
  { name: "قلادة نوفا", meta: "فضة إسترلينية 925", price: "280 د.ل", kind: "necklace-drop", tone: "mist" },
  { name: "خاتم أماندي", meta: "فضة إسترلينية 925", price: "230 د.ل", kind: "ring-gem", tone: "pearl" },
  { name: "قلادة سيغناتور", meta: "مطلي بالذهب", price: "310 د.ل", kind: "pendant", tone: "latte" },
  { name: "خاتم نوار", meta: "فضة إسترلينية 925", price: "250 د.ل", kind: "ring-double", tone: "stone" },
] as const;

const bg: Record<string, string> = {
  ivory: "#f4f0e8",
  sand: "#e8dfd0",
  rose: "#eee3df",
  cream: "#f5f1e7",
  mist: "#e7e5e0",
  pearl: "#f2eee8",
  latte: "#e5d9cb",
  stone: "#dedbd5",
};

function JewelryArt({ kind, tone }: { kind: string; tone: string }) {
  const stroke = kind.includes("ring") ? "#b58b43" : "#b7b6b1";
  return (
    <svg viewBox="0 0 600 760" className="h-full w-full" role="img" aria-label="صورة تجريبية مولدة لقطعة مجوهرات">
      <rect width="600" height="760" fill={bg[tone]} />
      <circle cx="300" cy="360" r="220" fill="rgba(255,255,255,.34)" />
      {kind === "necklace" && <>
        <path d="M160 210 C185 475 415 475 440 210" fill="none" stroke={stroke} strokeWidth="5" />
        <circle cx="300" cy="467" r="18" fill="none" stroke={stroke} strokeWidth="5" />
      </>}
      {kind === "pendant" && <>
        <path d="M165 205 C190 440 410 440 435 205" fill="none" stroke={stroke} strokeWidth="5" />
        <path d="M300 430 l22 38 -22 38 -22-38z" fill="none" stroke={stroke} strokeWidth="5" />
      </>}
      {kind === "necklace-drop" && <>
        <path d="M150 210 C180 470 420 470 450 210" fill="none" stroke={stroke} strokeWidth="5" />
        <line x1="300" y1="455" x2="300" y2="520" stroke={stroke} strokeWidth="5" />
        <circle cx="300" cy="535" r="13" fill={stroke} />
      </>}
      {kind === "ring" && <>
        <ellipse cx="300" cy="390" rx="118" ry="155" fill="none" stroke={stroke} strokeWidth="12" />
        <circle cx="300" cy="225" r="26" fill="none" stroke={stroke} strokeWidth="8" />
      </>}
      {kind === "ring-double" && <>
        <ellipse cx="300" cy="390" rx="116" ry="153" fill="none" stroke={stroke} strokeWidth="9" />
        <ellipse cx="300" cy="390" rx="138" ry="175" fill="none" stroke={stroke} strokeWidth="4" />
      </>}
      {kind === "ring-gem" && <>
        <ellipse cx="300" cy="400" rx="115" ry="150" fill="none" stroke={stroke} strokeWidth="10" />
        <path d="M300 210 l34 30 -34 34 -34-34z" fill="rgba(255,255,255,.55)" stroke={stroke} strokeWidth="6" />
      </>}
      <text x="300" y="690" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#7d7368" letterSpacing="4">CHÉRIE</text>
    </svg>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-sm">{children}</span>;
}

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#1e1e1c]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="bg-[#1e1e1c] px-4 py-2 text-center text-[11px] tracking-wide text-white">عرض بصري خاص — غير مخصص للبيع العام</div>
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#fbfaf7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3 md:gap-5">
            <button className="text-sm md:hidden" aria-label="القائمة">☰</button>
            <Link href="/showcase" className="text-2xl tracking-wide md:text-3xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>Chérie Boutique</Link>
          </div>
          <nav className="hidden items-center gap-8 text-[13px] md:flex">
            <a href="#new" className="hover:opacity-60">وصل حديثًا</a>
            <a href="#necklaces" className="hover:opacity-60">القلائد</a>
            <a href="#rings" className="hover:opacity-60">الخواتم</a>
            <a href="#story" className="hover:opacity-60">عن Chérie</a>
          </nav>
          <div className="flex items-center gap-2"><Icon>⌕</Icon><Icon>♡</Icon><Icon>♙</Icon></div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-4 pt-4 md:px-8 md:pt-6">
        <div className="relative min-h-[68vh] overflow-hidden bg-[#ded7ca] md:min-h-[78vh]">
          <svg viewBox="0 0 1400 850" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="مشهد تجريبي مولد لمجوهرات Chérie Boutique">
            <defs><linearGradient id="hero" x1="0" x2="1"><stop offset="0" stopColor="#c8b8a8"/><stop offset=".55" stopColor="#eee8df"/><stop offset="1" stopColor="#c9b69c"/></linearGradient></defs>
            <rect width="1400" height="850" fill="url(#hero)"/>
            <circle cx="1080" cy="385" r="260" fill="rgba(255,255,255,.33)"/>
            <path d="M860 175 C900 610 1250 610 1290 175" fill="none" stroke="#b58b43" strokeWidth="8"/>
            <circle cx="1075" cy="611" r="30" fill="none" stroke="#b58b43" strokeWidth="8"/>
            <ellipse cx="370" cy="510" rx="150" ry="205" fill="none" stroke="#b9b5ae" strokeWidth="14" opacity=".9"/>
            <circle cx="370" cy="292" r="35" fill="rgba(255,255,255,.7)" stroke="#b58b43" strokeWidth="8"/>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-gradient-to-l md:from-black/15 md:via-transparent md:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-white md:bottom-auto md:right-12 md:top-1/2 md:max-w-xl md:-translate-y-1/2 md:p-0 md:text-[#1e1e1c]">
            <p className="text-[11px] uppercase tracking-[.35em]">ÉLÉGANCE CONTEMPORAINE</p>
            <h1 className="mt-4 text-4xl font-normal leading-tight md:text-6xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>تفاصيل هادئة، حضور لا يُنسى.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 opacity-80">تجربة بصرية تجريبية لعرض Chérie Boutique بروح أنثوية معاصرة، مع تركيز واضح على المنتج ومساحة تنفّس واسعة.</p>
            <a href="#new" className="mt-7 inline-flex border-b border-current pb-1 text-sm font-medium">استكشفي المجموعة</a>
          </div>
        </div>
      </section>

      <section id="new" className="mx-auto max-w-[1500px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div><p className="text-[11px] tracking-[.25em] text-black/50">CURATED FOR CHÉRIE</p><h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>اختيارات الموسم</h2></div>
          <span className="hidden text-xs text-black/55 md:inline">مجموعة تجريبية — لا تمثل الكتالوج المعتمد</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-4 md:gap-x-5 md:gap-y-14">
          {products.map((p, i) => (
            <article key={p.name} className="group">
              <Link href={i === 0 ? "/showcase/product" : "/showcase/product"} className="block overflow-hidden bg-[#eeeae2]">
                <div className="aspect-[4/5] transition duration-500 group-hover:scale-[1.015]"><JewelryArt kind={p.kind} tone={p.tone} /></div>
              </Link>
              <div className="pt-3 text-center md:pt-4">
                <h3 className="text-sm font-medium">{p.name}</h3>
                <p className="mt-1 text-[12px] text-black/55">{p.meta}</p>
                <p className="mt-2 text-sm">{p.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-4 px-4 pb-16 md:grid-cols-2 md:px-8 md:pb-24">
        <div id="necklaces" className="relative min-h-[520px] overflow-hidden bg-[#e7ddd1]">
          <JewelryArt kind="necklace-drop" tone="latte" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-7 text-white"><p className="text-[11px] tracking-[.25em]">NECKLACES</p><h3 className="mt-2 text-3xl" style={{ fontFamily: "Georgia, serif" }}>قلائد بتفاصيل رقيقة</h3></div>
        </div>
        <div id="rings" className="relative min-h-[520px] overflow-hidden bg-[#e8e4dc]">
          <JewelryArt kind="ring-gem" tone="mist" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-7 text-white"><p className="text-[11px] tracking-[.25em]">RINGS</p><h3 className="mt-2 text-3xl" style={{ fontFamily: "Georgia, serif" }}>خواتم بمقاسات واضحة</h3></div>
        </div>
      </section>

      <section id="story" className="border-y border-black/10 bg-[#f4f0e8]">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 text-center md:grid-cols-3 md:py-20">
          <div><p className="text-xl">925</p><h4 className="mt-3 text-sm font-medium">وضوح الخامة</h4><p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-black/55">لا تظهر أي مطالبة بالخامة في المتجر الحقيقي إلا بعد توثيق المورد.</p></div>
          <div><p className="text-xl">50%</p><h4 className="mt-3 text-sm font-medium">عربون الطلب المسبق</h4><p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-black/55">يُعرض فقط بعد تأكيد التوفر والسعر وموعد التجهيز وفق متطلبات الإطلاق.</p></div>
          <div><p className="text-xl">ليبيا</p><h4 className="mt-3 text-sm font-medium">تجربة محلية أولًا</h4><p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-black/55">واجهة عربية RTL واضحة، مع إبقاء البيع العام معطّلًا حتى إغلاق بوابات الإطلاق.</p></div>
        </div>
      </section>

      <footer className="bg-[#1e1e1c] text-white">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-14 md:grid-cols-4 md:px-8">
          <div className="md:col-span-2"><p className="text-3xl" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>Chérie Boutique</p><p className="mt-4 max-w-md text-xs leading-6 text-white/60">عرض خاص لتقييم هوية وتجربة الواجهة. لا توجد طلبات أو مدفوعات أو منتجات إنتاج حقيقية داخل هذه الصفحة.</p></div>
          <div><h4 className="text-xs font-semibold">اكتشفي</h4><div className="mt-4 space-y-2 text-xs text-white/60"><p>وصل حديثًا</p><p>القلائد</p><p>الخواتم</p></div></div>
          <div><h4 className="text-xs font-semibold">المساعدة</h4><div className="mt-4 space-y-2 text-xs text-white/60"><p>التوصيل</p><p>الإرجاع والاستبدال</p><p>تواصلي معنا</p></div></div>
        </div>
      </footer>
    </main>
  );
}
