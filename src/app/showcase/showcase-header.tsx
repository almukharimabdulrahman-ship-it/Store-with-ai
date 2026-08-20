"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Panel = "menu" | "search" | "account" | "wishlist" | null;
type IconName = "menu" | "search" | "account" | "heart" | "close" | "chevron";

type NavigationBranch = {
  label: string;
  href: string;
};

type NavigationSection = {
  id: string;
  label: string;
  href: string;
  status: string;
  intro: string;
  branches: NavigationBranch[];
};

const navigation: NavigationSection[] = [
  {
    id: "jewelry",
    label: "المجوهرات",
    href: "#jewelry-title",
    status: "الإطلاق الأول",
    intro: "تشكيلة الإطلاق الأولى من الفضة 925 والمطلي بالذهب.",
    branches: [
      { label: "القلائد", href: "#necklaces" },
      { label: "الخواتم", href: "#rings" },
    ],
  },
  {
    id: "fashion",
    label: "الأزياء",
    href: "#fashion",
    status: "قريبًا",
    intro: "اختيارات نسائية هادئة للملابس والإطلالات المعاصرة.",
    branches: [
      { label: "الفساتين", href: "#fashion" },
      { label: "الأطقم", href: "#fashion" },
      { label: "الملابس العلوية", href: "#fashion" },
      { label: "العباءات", href: "#fashion" },
    ],
  },
  {
    id: "bags",
    label: "الحقائب",
    href: "#bags",
    status: "قريبًا",
    intro: "حقائب يومية ومناسبات تُختار لتكمل الإطلالة.",
    branches: [
      { label: "حقائب اليد", href: "#bags" },
      { label: "حقائب الكتف", href: "#bags" },
      { label: "حقائب المناسبات", href: "#bags" },
    ],
  },
  {
    id: "shoes",
    label: "الأحذية",
    href: "#shoes",
    status: "قريبًا",
    intro: "أحذية نسائية بخطوط بسيطة تناسب اليوم والمناسبة.",
    branches: [
      { label: "الكعب", href: "#shoes" },
      { label: "الأحذية المسطحة", href: "#shoes" },
      { label: "الصنادل", href: "#shoes" },
    ],
  },
  {
    id: "fragrance",
    label: "العطور",
    href: "#fragrance",
    status: "قريبًا",
    intro: "روائح نسائية ومجموعات هدايا ضمن عالم Chérie.",
    branches: [
      { label: "العطور النسائية", href: "#fragrance" },
      { label: "مجموعات الهدايا", href: "#fragrance" },
    ],
  },
  {
    id: "accessories",
    label: "الإكسسوارات",
    href: "#accessories",
    status: "قريبًا",
    intro: "تفاصيل صغيرة تكمل الأناقة من النظارات إلى الأوشحة.",
    branches: [
      { label: "النظارات", href: "#accessories" },
      { label: "الأحزمة", href: "#accessories" },
      { label: "الأوشحة", href: "#accessories" },
    ],
  },
];

const searchItems = navigation.flatMap((section) => [
  { label: section.label, context: section.status, href: section.href },
  ...section.branches.map((branch) => ({
    label: branch.label,
    context: section.label,
    href: branch.href,
  })),
]);

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    account: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.8-4 3.1-6 6.5-6s5.7 2 6.5 6" />
      </>
    ),
    heart: <path d="M20.8 5.8c-1.9-2-5-2-6.9 0L12 7.8l-1.9-2c-1.9-2-5-2-6.9 0-1.8 1.9-1.8 5 0 6.9L12 21l8.8-8.3c1.8-1.9 1.8-5 0-6.9Z" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chevron: <path d="m8 10 4 4 4-4" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function HeaderAction({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: IconName;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="group grid h-10 w-9 place-items-center transition-colors hover:text-[#9a7337] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <Icon name={icon} className="h-[19px] w-[19px] transition-transform duration-300 group-hover:scale-105" />
    </button>
  );
}

export function ShowcaseHeader() {
  const [panel, setPanel] = useState<Panel>(null);
  const [expandedSection, setExpandedSection] = useState("jewelry");
  const [desktopSectionId, setDesktopSectionId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const desktopSection = navigation.find((section) => section.id === desktopSectionId) ?? null;
  const filteredSearchItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ar");
    if (!normalizedQuery) return searchItems.slice(0, 8);
    return searchItems.filter((item) =>
      (item.label + " " + item.context).toLocaleLowerCase("ar").includes(normalizedQuery),
    );
  }, [query]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (panel) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [panel]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPanel(null);
        setDesktopSectionId(null);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  function closePanels() {
    setPanel(null);
    setDesktopSectionId(null);
  }

  function openPanel(nextPanel: Exclude<Panel, null>) {
    setDesktopSectionId(null);
    setPanel(nextPanel);
    if (nextPanel === "search") setQuery("");
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-black/10 bg-white/95 text-[#171717] shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur-md"
        onMouseLeave={() => setDesktopSectionId(null)}
      >
        <div className="flex h-7 items-center justify-center bg-[#1e1e1c] px-4 text-center text-[9px] font-light tracking-[.12em] text-white/90 md:h-8 md:text-[10px]">
          إطلاق المجوهرات قريبًا · عالم Chérie يتوسع تباعًا
        </div>

        <div className="relative mx-auto flex h-[66px] max-w-[1600px] items-center justify-center px-3 md:h-[82px] md:px-8">
          <button
            type="button"
            aria-label="فتح القائمة"
            aria-expanded={panel === "menu"}
            aria-controls="showcase-mobile-menu"
            onClick={() => openPanel("menu")}
            className="absolute right-3 grid h-10 w-10 place-items-center transition-colors hover:text-[#9a7337] focus-visible:outline focus-visible:outline-1 lg:hidden"
          >
            <Icon name="menu" className="h-[22px] w-[22px]" />
          </button>

          <Link
            href="/showcase"
            className="text-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
            aria-label="Chérie Boutique — الصفحة الرئيسية"
          >
            <span className="block font-serif text-[26px] leading-none tracking-[.01em] md:text-[34px]">Chérie</span>
            <span className="mt-1.5 block text-[7px] tracking-[.36em] text-black/55 md:text-[9px]">BOUTIQUE</span>
          </Link>

          <div className="absolute left-2 flex items-center md:left-8" dir="ltr">
            <HeaderAction label="المفضلة" icon="heart" onClick={() => openPanel("wishlist")} />
            <HeaderAction label="الحساب" icon="account" onClick={() => openPanel("account")} />
            <HeaderAction label="البحث" icon="search" onClick={() => openPanel("search")} />
          </div>
        </div>

        <nav
          className="hidden h-[45px] items-stretch justify-center gap-8 border-t border-black/[0.06] px-8 text-[12px] font-light lg:flex"
          aria-label="الأقسام الرئيسية"
        >
          {navigation.map((section) => (
            <button
              key={section.id}
              type="button"
              aria-expanded={desktopSectionId === section.id}
              onClick={() =>
                setDesktopSectionId((current) => (current === section.id ? null : section.id))
              }
              onMouseEnter={() => setDesktopSectionId(section.id)}
              className="relative flex items-center gap-1.5 px-1 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-black after:transition-transform hover:text-black/60 hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100"
            >
              {section.label}
              <Icon
                name="chevron"
                className={
                  "h-3.5 w-3.5 transition-transform " +
                  (desktopSectionId === section.id ? "rotate-180" : "")
                }
              />
            </button>
          ))}
        </nav>

        {desktopSection ? (
          <div className="absolute inset-x-0 top-full hidden border-y border-black/10 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)] lg:block">
            <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(240px,0.8fr)_2.2fr] gap-16 px-10 py-10">
              <div>
                <p className="mb-3 text-[10px] tracking-[.18em] text-[#9a7337]">{desktopSection.status}</p>
                <h2 className="font-serif text-[32px] font-normal">{desktopSection.label}</h2>
                <p className="mt-4 max-w-xs text-[13px] font-light leading-7 text-black/55">{desktopSection.intro}</p>
                <a
                  href={desktopSection.href}
                  onClick={closePanels}
                  className="mt-6 inline-flex border-b border-black pb-1 text-[12px] transition-opacity hover:opacity-50"
                >
                  عرض القسم
                </a>
              </div>
              <div className="grid content-start grid-cols-3 gap-x-10 gap-y-1 border-r border-black/10 pr-10">
                {desktopSection.branches.map((branch) => (
                  <a
                    key={branch.label}
                    href={branch.href}
                    onClick={closePanels}
                    className="border-b border-black/[0.06] py-3 text-[13px] font-light transition-[color,padding] hover:pr-2 hover:text-[#9a7337]"
                  >
                    {branch.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {panel === "menu" ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={closePanels}
            className="absolute inset-0 bg-black/35"
          />
          <aside
            id="showcase-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة أقسام Chérie Boutique"
            className="absolute inset-y-0 right-0 flex w-[88%] max-w-[390px] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-[76px] items-center justify-between border-b border-black/10 px-5">
              <div>
                <p className="font-serif text-[24px]">Chérie</p>
                <p className="mt-1 text-[7px] tracking-[.3em] text-black/45">BOUTIQUE</p>
              </div>
              <button
                type="button"
                aria-label="إغلاق القائمة"
                onClick={closePanels}
                className="grid h-10 w-10 place-items-center"
              >
                <Icon name="close" className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-3" aria-label="قائمة الهاتف">
              {navigation.map((section) => {
                const isExpanded = expandedSection === section.id;
                return (
                  <div key={section.id} className="border-b border-black/10">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedSection((current) => (current === section.id ? "" : section.id))
                      }
                      className="flex w-full items-center justify-between py-4 text-right"
                    >
                      <span>
                        <span className="block font-serif text-[23px]">{section.label}</span>
                        <span className="mt-1 block text-[9px] tracking-[.1em] text-black/40">{section.status}</span>
                      </span>
                      <Icon
                        name="chevron"
                        className={"h-4 w-4 transition-transform " + (isExpanded ? "rotate-180" : "")}
                      />
                    </button>
                    {isExpanded ? (
                      <div className="pb-5">
                        <p className="mb-3 text-[12px] font-light leading-6 text-black/50">{section.intro}</p>
                        <div className="grid grid-cols-2 gap-x-5">
                          {section.branches.map((branch) => (
                            <a
                              key={branch.label}
                              href={branch.href}
                              onClick={closePanels}
                              className="border-b border-black/[0.06] py-3 text-[13px] font-light"
                            >
                              {branch.label}
                            </a>
                          ))}
                        </div>
                        <a
                          href={section.href}
                          onClick={closePanels}
                          className="mt-4 inline-flex border-b border-black pb-1 text-[12px]"
                        >
                          عرض القسم
                        </a>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-black/10 bg-[#f7f4ec] px-5 py-5">
              <p className="text-[11px] font-light leading-6 text-black/55">
                الإطلاق التجاري الحالي للمجوهرات فقط. بقية الأقسام تعرض رؤية Chérie المستقبلية.
              </p>
            </div>
          </aside>
        </div>
      ) : null}

      {panel === "search" ? (
        <div className="fixed inset-0 z-[80] bg-white" role="dialog" aria-modal="true" aria-label="البحث">
          <div className="mx-auto flex min-h-full max-w-[1100px] flex-col px-5 py-6 md:px-10 md:py-10">
            <div className="flex items-center justify-between border-b border-black/15 pb-5">
              <h2 className="font-serif text-[30px] md:text-[38px]">البحث في عالم Chérie</h2>
              <button type="button" aria-label="إغلاق البحث" onClick={closePanels} className="grid h-11 w-11 place-items-center">
                <Icon name="close" className="h-7 w-7" />
              </button>
            </div>
            <label className="mt-10 flex items-center gap-4 border-b border-black pb-3">
              <Icon name="search" className="h-6 w-6 shrink-0" />
              <span className="sr-only">عبارة البحث</span>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحثي عن قسم أو فئة"
                className="w-full bg-transparent text-[20px] font-light outline-none placeholder:text-black/30 md:text-[26px]"
              />
            </label>
            <div className="mt-10">
              <p className="mb-4 text-[10px] tracking-[.14em] text-black/40">
                {query ? "نتائج البحث" : "اقتراحات"}
              </p>
              <div className="grid gap-x-10 md:grid-cols-2">
                {filteredSearchItems.map((item) => (
                  <a
                    key={item.label + item.context}
                    href={item.href}
                    onClick={closePanels}
                    className="flex items-center justify-between border-b border-black/10 py-4 transition-colors hover:text-[#9a7337]"
                  >
                    <span className="font-serif text-[21px]">{item.label}</span>
                    <span className="text-[10px] tracking-[.08em] text-black/40">{item.context}</span>
                  </a>
                ))}
              </div>
              {filteredSearchItems.length === 0 ? (
                <p className="py-10 text-[14px] font-light text-black/50">لا توجد فئة مطابقة حاليًا.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {panel === "account" || panel === "wishlist" ? (
        <div className="fixed inset-0 z-[80] grid place-items-center px-5">
          <button type="button" aria-label="إغلاق النافذة" onClick={closePanels} className="absolute inset-0 bg-black/40" />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="showcase-info-title"
            className="relative w-full max-w-[470px] bg-white px-7 py-8 shadow-2xl md:px-10 md:py-10"
          >
            <button type="button" aria-label="إغلاق النافذة" onClick={closePanels} className="absolute left-4 top-4 grid h-9 w-9 place-items-center">
              <Icon name="close" className="h-5 w-5" />
            </button>
            <p className="mb-3 text-[9px] tracking-[.18em] text-[#9a7337]">CHÉRIE BOUTIQUE</p>
            <h2 id="showcase-info-title" className="font-serif text-[32px]">
              {panel === "account" ? "حساب Chérie" : "قائمة المفضلة"}
            </h2>
            <p className="mt-5 text-[14px] font-light leading-8 text-black/55">
              {panel === "account"
                ? "سيُفعّل تسجيل الدخول والحسابات عند بوابة التشغيل. هذه المعاينة لا تنشئ حسابًا ولا ترسل بيانات."
                : "ستعمل المفضلة مع المنتجات المعتمدة عند اكتمال كتالوج الإطلاق. لا توجد منتجات وهمية محفوظة في هذا العرض."}
            </p>
            <button
              type="button"
              onClick={closePanels}
              className="mt-8 w-full bg-[#1e1e1c] px-5 py-4 text-[12px] text-white transition-colors hover:bg-[#3a3a36]"
            >
              متابعة استكشاف العرض
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
