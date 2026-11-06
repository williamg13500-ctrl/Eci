import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CANVASES, CATEGORIES, HEROES, PIECES } from "@/data/catalog";
import { filterPieces, type Filter } from "@/lib/archive";

type ViewItem = { key: string; title: string; label: string; note: string; src: string; alt: string };

const WHATSAPP = "27736453141";
const EMAIL = "bulkchaser664@gmail.com";
const INSTAGRAM = "https://instagram.com/Bulkchaser1212";
const FACEBOOK = "https://facebook.com/Bulkchaser";

const TITLE = "Edmond Clinton Inc. — Hand-painted one-of-one textiles, Cape Town";
const DESC =
  "Cape Town artist Edmond Clinton reworks denim scraps, factory offcuts and worn garments into hand-painted, one-of-one wearable sculpture. Explore the 94-piece Living Archive and commission a piece.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: HEROES[0] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HEROES[0] },
    ],
  }),
  component: Index,
});

const NAV = [
  { href: "#campaign", label: "Campaign" },
  { href: "#archive", label: "Archive" },
  { href: "#canvases", label: "Canvases" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#contact", label: "Contact" },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Philosophy />
        <Campaign />
        <Archive />
        <CanvasRoom />
        <Stats />
        <Commission />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "border-b border-rule-dark bg-ink/95 backdrop-blur-sm" : "bg-transparent"
      } text-bone`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" className="font-display text-xl tracking-tight md:text-2xl">
          Edmond Clinton <span className="italic text-brass">Inc.</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="eyebrow text-bone/75 transition-colors hover:text-bone">
              {n.label}
            </a>
          ))}
          <a href="#commission" className="eyebrow border border-brass px-5 py-3 text-brass transition-colors hover:bg-brass hover:text-ink">
            Commission
          </a>
        </nav>
        <button
          type="button"
          className="eyebrow md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-rule-dark px-5 pb-8 pt-4 md:hidden">
          <ul className="flex flex-col">
            {[...NAV, { href: "#commission", label: "Commission" }].map((n) => (
              <li key={n.href} className="border-b border-rule-dark">
                <a href={n.href} onClick={() => setOpen(false)} className="block py-4 font-display text-3xl">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % HEROES.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="top" className="relative bg-ink text-bone">
      <div className="mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 gap-10 px-5 pb-14 pt-24 md:grid-cols-12 md:px-10 md:pt-32">
        <div className="flex flex-col justify-end md:col-span-6 md:pb-10">
          <p className="eyebrow text-brass">Est. Cape Town — Surface Intervention</p>
          <h1 className="mt-6 font-display text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.9] tracking-tight">
            Edmond
            <br />
            Clinton <span className="italic text-brass">Inc.</span>
          </h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-bone/75">
            Fabric keeps time the way trees keep rings. ECI stitches history into discarded textiles — denim scraps,
            factory offcuts, garments already worn through. It isn't fashion. It's a conversation.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#archive" className="eyebrow bg-bone px-7 py-4 text-ink transition-colors hover:bg-brass">
              Enter the Archive
            </a>
            <a href="#commission" className="eyebrow border border-bone/40 px-7 py-4 transition-colors hover:border-bone">
              Commission a Piece
            </a>
          </div>
        </div>
        <div className="relative md:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-soft md:ml-auto md:max-w-[560px]">
            {HEROES.map((src, k) => (
              <img
                key={src}
                src={src}
                alt={k === 0 ? "Painted bomber jacket and patched flares on a Cape Town street" : ""}
                aria-hidden={k !== i}
                loading={k === 0 ? "eager" : "lazy"}
                fetchPriority={k === 0 ? "high" : "auto"}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
                  k === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between md:ml-auto md:max-w-[560px]">
            <span className="eyebrow text-bone/60" aria-live="polite">
              {String(i + 1).padStart(2, "0")} / {String(HEROES.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              {HEROES.map((_, k) => (
                <button
                  key={k}
                  type="button"
                  aria-label={`Show photograph ${k + 1}`}
                  aria-pressed={k === i}
                  onClick={() => setI(k)}
                  className={`h-px w-10 transition-colors ${k === i ? "bg-brass" : "bg-bone/30 hover:bg-bone/60"}`}
                  style={{ paddingBlock: 8, backgroundClip: "content-box" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Surface Intervention", "Textile Archaeology", "Wearable Sculpture", "One Of One"];
  const row = [...words, ...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y border-rule-dark bg-ink py-5 text-bone/80" aria-hidden="true">
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {[...row, ...row].map((w, k) => (
          <span key={k} className="font-display text-2xl italic">
            {w} <span className="ml-12 not-italic text-brass">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ n, children, dark }: { n: string; children: string; dark?: boolean }) {
  return (
    <p className={`eyebrow flex items-center gap-4 ${dark ? "text-brass" : "text-oxblood"}`}>
      <span>{n}</span>
      <span className={`h-px w-10 ${dark ? "bg-rule-dark" : "bg-rule"}`} />
      <span>{children}</span>
    </p>
  );
}

function Philosophy() {
  const pillars = [
    ["Wearable Sculpture", "Garments built like objects — weight, seam and surface treated as material decisions, not trims."],
    ["Textile Archaeology", "Every panel is excavated from something that already lived: offcuts, dead stock, worn denim."],
    ["Surface Intervention", "Bleach, paint, burn, patch, repair. The surface is where the argument happens."],
  ];
  return (
    <section id="philosophy" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="reveal md:col-span-5">
          <SectionLabel n="01">Philosophy</SectionLabel>
          <h2 className="mt-8 font-display text-[clamp(2.6rem,5vw,4.75rem)] leading-[0.95] tracking-tight">
            Each stitch <br />
            is a little act <br />
            <span className="italic text-oxblood">of resistance</span>
          </h2>
          <p className="mt-10 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Reworked textiles, denim scraps, factory offcuts and already-worn garments — hand-painted, patched, repaired
            and surface-intervened into one-of-one wearable sculpture.
          </p>
        </div>
        <ol className="md:col-span-6 md:col-start-7">
          {pillars.map(([t, d], k) => (
            <li key={t} className="reveal grid grid-cols-[3rem_1fr] border-t border-rule py-9 last:border-b">
              <span className="eyebrow pt-2 text-muted-foreground">0{k + 1}</span>
              <div>
                <h3 className="font-display text-3xl md:text-4xl">{t}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Campaign() {
  const [active, setActive] = useState<number | null>(null);
  const items: ViewItem[] = HEROES.map((src, k) => ({
    key: src,
    src,
    title: `Campaign Portrait ${String(k + 1).padStart(2, "0")}`,
    label: "ECI Campaign — Cape Town",
    note: "Edmond Clinton Inc. one-of-one pieces, photographed on location in Cape Town.",
    alt: `Edmond Clinton Inc. campaign portrait ${k + 1}`,
  }));
  return (
    <section id="campaign" className="gallery-wall pt-28 md:pt-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="reveal grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel n="02">The Campaign</SectionLabel>
            <h2 className="mt-8 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-tight">
              Worn on the <span className="italic text-oxblood">street</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground md:col-span-5">
            The archive leaves the studio. Four portraits of ECI pieces in the city that made them — wearable sculpture,
            carrying its own history into new stories.
          </p>
        </div>
        <ul className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {items.map((it, k) => (
            <li key={it.key} className={`reveal ${k % 2 ? "md:mt-16" : ""}`}>
              <button type="button" onClick={() => setActive(k)} aria-label={`View ${it.title}`} className="group block w-full text-left">
                <div className="bg-bone p-2 shadow-frame md:p-3">
                  <div className="aspect-[3/4] overflow-hidden bg-ink-soft">
                    <img src={it.src} alt={it.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                </div>
                <p className="eyebrow mt-4 text-muted-foreground">Portrait {String(k + 1).padStart(2, "0")}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="reveal mt-24 border-y border-rule bg-ink text-bone">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 md:grid-cols-12 md:items-center md:px-10">
          <p className="font-display text-[clamp(2rem,4vw,3.5rem)] italic leading-[1] md:col-span-7">
            “Wear the history. <span className="text-brass">Make new stories.</span>”
          </p>
          <dl className="grid grid-cols-2 gap-6 md:col-span-5">
            <div><dt className="eyebrow text-bone/50">Studio</dt><dd className="mt-2 text-sm">Edmond Clinton Inc.</dd></div>
            <div><dt className="eyebrow text-bone/50">Location</dt><dd className="mt-2 text-sm">Cape Town</dd></div>
            <div><dt className="eyebrow text-bone/50">Artist</dt><dd className="mt-2 text-sm">Edmond Clinton</dd></div>
            <div><dt className="eyebrow text-bone/50">Follow</dt><dd className="mt-2 text-sm"><a className="hover:text-brass" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@Bulkchaser1212</a></dd></div>
          </dl>
        </div>
      </div>
      {active !== null && <Lightbox items={items} index={active} onIndex={setActive} onClose={() => setActive(null)} />}
    </section>
  );
}

const pieceView = (p: (typeof PIECES)[number]): ViewItem => ({
  key: p.id, title: p.title, label: `${p.id} — ${p.category}`, note: p.note, src: p.src, alt: p.title,
});

function Archive() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const list = useMemo(() => filterPieces(PIECES, filter, query), [filter, query]);
  const views = useMemo(() => list.map(pieceView), [list]);
  const discover = () => {
    setFilter("All");
    setQuery("");
    setActive(Math.floor(Math.random() * PIECES.length));
  };
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: PIECES.length };
    CATEGORIES.forEach((k) => (c[k] = PIECES.filter((p) => p.category === k).length));
    return c;
  }, []);
  const filters: Filter[] = ["All", ...CATEGORIES];

  return (
    <section id="archive" className="bg-ink py-28 text-bone md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="reveal grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel n="03" dark>
              The Archive
            </SectionLabel>
            <h2 className="mt-8 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-tight">
              Living <span className="italic text-brass">Archive</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-bone/70 md:col-span-5">
            94 interventions across denim, outerwear, tees, footwear and bags. Every piece begins as something discarded —
            and leaves the studio carrying a new record of its own history.
          </p>
        </div>

        <div role="group" aria-label="Filter archive by category" className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-y border-rule-dark py-5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`group flex items-baseline gap-2 py-1 transition-colors ${
                filter === f ? "text-bone" : "text-bone/50 hover:text-bone/85"
              }`}
            >
              <span className={`font-display text-2xl ${filter === f ? "italic" : ""}`}>{f}</span>
              <sup className={`eyebrow ${filter === f ? "text-brass" : ""}`}>{counts[f]}</sup>
            </button>
          ))}
          <p className="eyebrow ml-auto self-center text-bone/50" aria-live="polite">
            Showing {list.length} of {PIECES.length}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <label htmlFor="archive-search" className="sr-only">Search the archive</label>
          <input
            id="archive-search"
            type="search"
            value={query}
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, note, category or ECI code…"
            className="min-w-0 flex-1 border-0 border-b border-rule-dark bg-transparent px-0 py-3 text-base text-bone placeholder:text-bone/35 focus:border-brass focus:outline-none"
          />
          <button type="button" onClick={discover} className="eyebrow border border-brass px-5 py-3 text-brass transition-colors hover:bg-brass hover:text-ink">
            Discover a piece ✦
          </button>
        </div>
        {list.length === 0 && (
          <p className="mt-12 font-display text-2xl italic text-bone/60">No pieces match “{query}”.</p>
        )}

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {list.map((p, idx) => (
            <li key={p.id} className={idx % 7 === 3 ? "lg:translate-y-10" : ""}>
              <button
                type="button"
                onClick={() => setActive(idx)}
                className="group block w-full text-left"
                aria-label={`View ${p.title}, ${p.id}`}
              >
                <div className="gallery-wall relative aspect-[4/5] overflow-hidden p-4 md:p-6">
                  <img
                    src={p.src}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={1000}
                    className="h-full w-full object-contain drop-shadow-[var(--shadow-object-v)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="eyebrow absolute left-3 top-3 text-ink/60">{p.category}</span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3 border-t border-rule-dark pt-3">
                  <div>
                    <h3 className="font-display text-lg leading-tight md:text-xl group-hover:text-brass transition-colors">{p.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-bone/55">{p.note}</p>
                  </div>
                  <span className="eyebrow shrink-0 pt-1 text-bone/45">{p.id}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {active !== null && views[active] && <Lightbox items={views} index={active} onIndex={setActive} onClose={() => setActive(null)} />}
    </section>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: ViewItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const p = items[index] ?? items[0]!;
  const closeRef = useRef<HTMLButtonElement>(null);
  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);
  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      last?.focus();
    };
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab") {
        const f = document.querySelectorAll<HTMLElement>("#lightbox button");
        if (!f.length) return;
        const first = f[0]!, lastEl = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose, prev, next]);

  return (
    <div
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${p.title}, ${p.label}`}
      className="fixed inset-0 z-[70] flex flex-col bg-ink text-bone animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-10">
        <span className="eyebrow text-bone/60">
          {index + 1} / {items.length}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} className="eyebrow px-2 py-2 hover:text-brass">
          Close ✕
        </button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 px-5 pb-6 md:grid-cols-12 md:px-10 md:pb-10" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="gallery-wall relative min-h-0 p-4 md:col-span-8 md:p-8">
          <img src={p.src} alt={p.alt} className="h-full max-h-[62svh] w-full object-contain drop-shadow-[var(--shadow-object-v)] md:max-h-none" />
        </div>
        <div className="flex flex-col justify-end md:col-span-4 md:pb-4">
          <p className="eyebrow text-brass">{p.label}</p>
          <h3 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{p.title}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-bone/70">{p.note}</p>
          <p className="mt-6 text-xs text-bone/50">One of one. Commission enquiries via the intake below.</p>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={prev} className="eyebrow border border-rule-dark px-5 py-3 hover:border-bone">
              ← Prev
            </button>
            <button type="button" onClick={next} className="eyebrow border border-rule-dark px-5 py-3 hover:border-bone">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CanvasRoom() {
  const [active, setActive] = useState<number | null>(null);
  const items: ViewItem[] = CANVASES.map((c) => ({
    key: c.code, title: c.title, label: `${c.code} — Original canvas`, src: c.src,
    note: "Original painting by Edmond Clinton.", alt: `${c.title} — original painting by Edmond Clinton`,
  }));
  return (
    <section id="canvases" className="gallery-wall">
    <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <div className="reveal grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionLabel n="04">Before the Garment</SectionLabel>
          <h2 className="mt-8 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-tight">
            The Canvas <span className="italic text-oxblood">Room</span>
          </h2>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground md:col-span-5">
          Every jacket starts as a painting. These are the canvases where the characters, colour and chaos are worked out
          first — then stitched into cloth.
        </p>
      </div>
      <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-12">
        {CANVASES.map((c, k) => (
          <li
            key={c.code}
            className={`reveal ${
              ["md:col-span-7", "md:col-span-5 md:mt-32", "md:col-span-4", "md:col-span-8", "md:col-span-6", "md:col-span-6 md:mt-24", "md:col-span-5 md:col-start-2", "md:col-span-6"][k] ?? "md:col-span-6"
            }`}
          >
            <figure>
              <button type="button" onClick={() => setActive(k)} aria-label={`View ${c.title}, ${c.code}`} className="group block w-full border-[10px] border-ink bg-bone p-3 shadow-frame md:p-6">
                <img
                  src={c.src}
                  alt={`${c.title} — original painting by Edmond Clinton`}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto max-h-[80svh] w-full object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </button>
              <figcaption className="mt-4 flex items-baseline justify-between border-t border-rule pt-3">
                <span className="font-display text-2xl italic">{c.title}</span>
                <span className="eyebrow text-muted-foreground">{c.code}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
      {active !== null && <Lightbox items={items} index={active} onIndex={setActive} onClose={() => setActive(null)} />}
    </section>
  );
}

function Stats() {
  const s = [
    ["94", "Archived interventions"],
    ["1 / 1", "Every piece, single run"],
    ["100%", "Salvaged or reworked base cloth"],
  ];
  return (
    <section aria-label="Studio record" className="border-y border-rule">
      <dl className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-3">
        {s.map(([v, l]) => (
          <div key={l} className="border-rule px-5 py-12 md:border-r md:px-10 md:last:border-r-0 border-b md:border-b-0 last:border-b-0">
            <dt className="eyebrow order-2 text-muted-foreground">{l}</dt>
            <dd className="mt-3 font-display text-6xl">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Commission() {
  const [form, setForm] = useState({ name: "", contact: "", history: "", vision: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "contact" | "history" | "vision", string>>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Partial<Record<"name" | "contact" | "history" | "vision", string>> = {};
    if (!form.name.trim()) e.name = "Please tell us your name.";
    else if (form.name.length > 100) e.name = "Keep your name under 100 characters.";
    const c = form.contact.trim();
    if (!c) e.contact = "Add an email address or WhatsApp number.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && !/^\+?[\d\s()-]{7,20}$/.test(c))
      e.contact = "Enter a valid email or phone number.";
    if (!form.history.trim()) e.history = "Tell us where the garment came from.";
    else if (form.history.length > 1500) e.history = "Keep this under 1500 characters.";
    if (!form.vision.trim()) e.vision = "Describe where you want it to go next.";
    else if (form.vision.length > 1500) e.vision = "Keep this under 1500 characters.";
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const msg = `Commission Intake — Edmond Clinton Inc.\n\nName: ${form.name.trim()}\nContact: ${form.contact.trim()}\n\nMaterial History:\n${form.history.trim()}\n\nThe Vision:\n${form.vision.trim()}\n`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const field = (key: keyof typeof form, label: string, multiline = false, hint?: string) => {
    const id = `f-${key}`;
    const err = errors[key];
    const cls =
      "mt-3 w-full border-0 border-b bg-transparent px-0 py-3 text-base text-bone placeholder:text-bone/30 focus:border-brass focus:outline-none focus:ring-0 " +
      (err ? "border-destructive" : "border-rule-dark");
    return (
      <div>
        <label htmlFor={id} className="eyebrow text-bone/70">
          {label}
        </label>
        {multiline ? (
          <textarea
            id={id}
            rows={4}
            maxLength={1500}
            value={form[key]}
            placeholder={hint}
            aria-invalid={!!err}
            aria-describedby={err ? `${id}-e` : undefined}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className={cls + " resize-y"}
          />
        ) : (
          <input
            id={id}
            maxLength={key === "name" ? 100 : 255}
            value={form[key]}
            placeholder={hint}
            autoComplete={key === "name" ? "name" : "email"}
            aria-invalid={!!err}
            aria-describedby={err ? `${id}-e` : undefined}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className={cls}
          />
        )}
        {err && (
          <p id={`${id}-e`} className="mt-2 text-xs text-brass">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="commission" className="bg-ink py-28 text-bone md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="reveal md:col-span-5">
          <SectionLabel n="05" dark>
            Commission Intake
          </SectionLabel>
          <h2 className="mt-8 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] tracking-tight">
            Bring the <br />
            <span className="italic text-brass">Material</span>
          </h2>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-bone/70">
            Commissions start with what you already own. Tell the story of the garment — where it came from, what it
            survived — and where you want it to go next.
          </p>
          <blockquote className="mt-12 border-l border-brass pl-6 font-display text-3xl italic leading-snug">
            “Wear the history. Make new stories.”
          </blockquote>
        </div>
        <form noValidate onSubmit={submit} className="reveal flex flex-col gap-10 md:col-span-6 md:col-start-7" aria-describedby="form-note">
          {field("name", "Name")}
          {field("contact", "Email or WhatsApp")}
          {field("history", "Material History", true, "Where it came from, what it survived…")}
          {field("vision", "The Vision", true, "Where you want it to go next…")}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <button type="submit" className="eyebrow bg-bone px-8 py-4 text-ink transition-colors hover:bg-brass">
              Send via WhatsApp
            </button>
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Commission Intake — Edmond Clinton Inc.")}`} className="eyebrow text-bone/70 underline-offset-4 hover:text-bone hover:underline">
              Or email instead
            </a>
          </div>
          <p id="form-note" className="text-xs leading-relaxed text-bone/50" aria-live="polite">
            {sent
              ? "WhatsApp opened with your intake pre-filled — press send there to deliver it to the studio."
              : "Submitting opens WhatsApp with your details pre-filled. Nothing is stored on this site."}
          </p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-ink text-bone">
      <div className="mx-auto max-w-[1440px] border-t border-rule-dark px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95]">
              Fabric keeps time <br />
              <span className="italic text-brass">the way trees keep rings.</span>
            </p>
            <p className="mt-6 max-w-sm text-sm text-bone/60">It isn't fashion. It's a conversation.</p>
          </div>
          <div className="md:col-span-3">
            <h2 className="eyebrow text-bone/50">Contact</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a className="hover:text-brass" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp +27 73 645 3141</a></li>
              <li><a className="break-all hover:text-brass" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h2 className="eyebrow text-bone/50">Follow</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a className="hover:text-brass" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram — @Bulkchaser1212</a></li>
              <li><a className="hover:text-brass" href={FACEBOOK} target="_blank" rel="noopener noreferrer">Facebook — Bulkchaser</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-wrap justify-between gap-4 border-t border-rule-dark pt-6">
          <span className="eyebrow text-bone/40">© {new Date().getFullYear()} Edmond Clinton Inc. — Cape Town</span>
          <span className="eyebrow text-bone/40">Wear the history. Make new stories.</span>
        </div>
      </div>
    </footer>
  );
}