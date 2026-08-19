import Link from "next/link";

function ProductVisual({ variant = 0 }: { variant?: number }) {
  return (
    <svg viewBox="0 0 700 900" className="h-full w-full" role="img" aria-label="صورة تجريبية مولدة لقلادة فضية">
      <defs>
        <linearGradient id={`g-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={variant % 2 ? "#ebe4da" : "#f3eee6"} />
          <stop offset="1" stopColor={variant % 2 ? "#d8d1c9" : "#ded8cf"} />
        </linearGradient>
      </defs>
      <rect width="700" height="900" fill={`url(#g-${variant})`} />
      <circle cx={variant % 2 ? 365 : 350} cy="410" r="245" fill="rgba(255,255,255,.34)" />
      <path d={variant % 2 ? "M190 205 C220 610 480 610 510 205" : "M175 195 C210 630 490 630 525 195"} fill="none" stroke="#b9b9b6" strokeWidth="7" />
      <circle cx="350" cy={variant % 2 ? "615" : "632"} r="24" fill="none" stroke="#b9b9b6" strokeWidth="7" />
      <circle cx="350" cy={variant % 2 ? "615" : "632"} r="7" fill="#b58b43" />
      <text x="350" y="830" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#7c746c" letterSpacing="4">CHÉRIE</text>
    </svg>
  );
}

export default function ShowcaseProductPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#1e1e1c]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="bg-[#1e1e1c] px-4 py-2 text-center text-[11px] tracking-wide text-white">عرض بصري خاص — غير مخصص للبيع العام</div>
      <header className="border-b border-black/10 bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/showcase" className="text-sm">← العودة</Link>
          <Link href="/showcase" className="text-2xl md:text-3xl" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>Chérie Boutique</Link>
          <div className="flex gap-3 text-lg"><span>♡</span><span>⌕</span></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-5 text-[11px] text-black/45">الرئيسية / القلائد / قلادة لوميير</div>
        <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
          <section className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="col-span-2 aspect-[4/5] overflow-hidden bg-[#f0ece4] md:col-span-1"><ProductVisual /></div>
            <div className="col-span-2 aspect-[4/5] overflow-hidden bg-[#e6dfd5] md:col-span-1"><ProductVisual variant={1} /></div>
          </section>

          <aside className="lg:sticky lg:top-8 lg:self-start lg:pt-8">
            <p className="text-[11px] tracking-[.25em] text-black/45">CHÉRIE EDIT</p>
            <h1 className="mt-3 text-3xl md:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>قلادة لوميير</h1>
            <p className="mt-2 text-sm text-black/55">فضة إسترلينية 925 — نموذج عرض تجريبي</p>
            <p className="mt-6 text-xl">265 د.ل</p>
            <div className="mt-7 border-y border-black/10 py-5 text-sm">
              <div className="flex items-center justify-between"><span>حالة التوفر</span><span className="rounded-full bg-[#eee8dc] px-3 py-1 text-xs">طلب مسبق</span></div>
              <p className="mt-3 text-xs leading-6 text-black/55">العربون المقترح وفق المتطلبات: 50% بعد تأكيد التوفر والسعر وموعد التجهيز. لا يتم تحصيل أي مبلغ في هذا العرض.</p>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between text-sm"><span>الطول</span><span className="text-xs text-black/45">دليل القياس</span></div>
              <div className="flex gap-2"><button className="border border-black bg-black px-5 py-3 text-xs text-white">40 سم</button><button className="border border-black/15 px-5 py-3 text-xs">45 سم</button><button className="border border-black/15 px-5 py-3 text-xs">50 سم</button></div>
            </div>

            <button disabled className="mt-8 w-full bg-[#1e1e1c] px-5 py-4 text-sm font-medium text-white opacity-90">البيع العام غير مفعّل — استفسري عن القطعة</button>
            <p className="mt-3 text-center text-[11px] text-black/45">صفحة عرض فقط. لا تُنشئ طلبًا ولا تكتب في قاعدة البيانات.</p>

            <div className="mt-9 divide-y divide-black/10 border-t border-black/10 text-sm">
              <details open className="py-5"><summary className="cursor-pointer font-medium">التفاصيل والخامة</summary><p className="mt-3 text-xs leading-6 text-black/55">في المتجر الحقيقي تُعرض الخامة والعيار فقط عندما يكون الدليل من المورد موثقًا للقطعة نفسها. النص هنا لأغراض تقييم الواجهة.</p></details>
              <details className="py-5"><summary className="cursor-pointer font-medium">التجهيز والتوصيل</summary><p className="mt-3 text-xs leading-6 text-black/55">يظهر الموعد الواقعي حسب التوفر ومسار المورد وشركة التوصيل. لا توجد هنا وعود 24 ساعة أو موعد غير موثق.</p></details>
              <details className="py-5"><summary className="cursor-pointer font-medium">الإلغاء والاسترجاع</summary><p className="mt-3 text-xs leading-6 text-black/55">التجربة النهائية ستعرض ملخصًا واضحًا لحق الإلغاء وفترة 10 أيام قبل أي دفع، وفق النسخة المعتمدة من متطلبات الأعمال.</p></details>
            </div>
          </aside>
        </div>

        <section className="mt-16 border-t border-black/10 py-12 text-center md:mt-24">
          <p className="text-[11px] tracking-[.3em] text-black/45">CHÉRIE BOUTIQUE</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl leading-tight md:text-4xl" style={{ fontFamily: "Georgia, serif" }}>صفحة منتج هادئة وواضحة، تجعل القطعة والقرار الشرائي في المقدمة.</h2>
          <Link href="/showcase" className="mt-7 inline-block border-b border-black pb-1 text-sm">العودة إلى العرض</Link>
        </section>
      </div>
    </main>
  );
}
