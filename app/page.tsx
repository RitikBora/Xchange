"use client";

import { Button } from "./components/core/Button";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CountUp } from "./components/landing/CountUp";
import { LiveChartPreview } from "./components/landing/LiveChartPreview";
import { TickerMarquee } from "./components/landing/TickerMarquee";
import { MarketsPreview } from "./components/landing/MarketsPreview";
import { getScrollDirection } from "./utils/scrollDirection";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

type PendingReveal = "animate" | "snap" | "hidden";

const Reveal = ({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => {
  const controls = useAnimation();
  const mountedRef = useRef(false);
  const pendingRef = useRef<PendingReveal | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    if (pendingRef.current === "animate") controls.start("visible");
    else if (pendingRef.current === "snap") controls.set("visible");
    else if (pendingRef.current === "hidden") controls.set("hidden");
    pendingRef.current = null;
    return () => {
      mountedRef.current = false;
    };
  }, [controls]);

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate={controls}
      variants={reveal}
      transition={{ delay }}
      viewport={{ amount: 0.15 }}
      onViewportEnter={() => {
        const wantAnimate = getScrollDirection() === "down";
        if (!mountedRef.current) {
          pendingRef.current = wantAnimate ? "animate" : "snap";
          return;
        }
        if (wantAnimate) controls.start("visible");
        else controls.set("visible");
      }}
      onViewportLeave={() => {
        if (!mountedRef.current) {
          pendingRef.current = "hidden";
          return;
        }
        controls.set("hidden");
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <TickerMarquee />
      <Hero />
      <StatsBand />
      <FeaturesBento />
      <HowItWorks />
      <MarketsPreviewSection />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  maxWidth: "var(--lp-maxw)",
  margin: "0 auto",
  padding: "0 var(--lp-pad)",
};

const Hero = () => {
  const router = useRouter();
  return (
    <section style={{ width: "100%", padding: "clamp(70px,10vw,80px) var(--lp-pad) var(--lp-sec)" }}>
      <div className="grid items-center" style={{ gridTemplateColumns: "0.8fr 1.0fr", gap: "var(--lp-hero-gap)" }}>
        <div>
          <h1 className="m-0 font-extrabold" style={{ fontSize: "var(--lp-display)", lineHeight: 0.98, letterSpacing: "-0.03em" }}>
            <div className="block" style={{ color: "var(--text-high-emphasis)" }}>Look First.</div>
            <div className="block" style={{ color: "var(--text-high-emphasis)" }}>Then <span style={{ color: "var(--accent)" }}>Leap.</span></div>
          </h1>
          <p className="mt-6 max-w-[440px] text-lg leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>
            The best trades require research, then commitment. Screen every market, read the book, watch the chart — then act with conviction.
          </p>
          <div className="flex flex-wrap gap-3.5 mt-9">
            <Button variant="success" size="lg" onClick={() => router.push("/markets")}>Explore Markets</Button>
            <Button variant="primary" size="lg" onClick={() => router.push("/trade/SOL_USDC")}>Trade SOL / USDC</Button>
          </div>
          <div className="flex flex-wrap gap-8 mt-11">
            <div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>$79.0B</div>
              <div className="text-xs" style={{ color: "var(--text-low-emphasis)" }}>24h volume</div>
            </div>
            <div className="w-px" style={{ background: "var(--border-hairline)" }} />
            <div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>340+</div>
              <div className="text-xs" style={{ color: "var(--text-low-emphasis)" }}>Markets</div>
            </div>
            <div className="w-px" style={{ background: "var(--border-hairline)" }} />
            <div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>2.1M</div>
              <div className="text-xs" style={{ color: "var(--text-low-emphasis)" }}>Traders</div>
            </div>
          </div>
        </div>
        <div>
          <LiveChartPreview />
        </div>
      </div>
    </section>
  );
};

const StatsBand = () => (
  <section style={{ borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)", background: "var(--surface-card)" }}>
    <div className="grid gap-8" style={{ ...sectionStyle, paddingTop: 56, paddingBottom: 56, gridTemplateColumns: "var(--lp-step-cols)" }}>
      <Reveal className="text-center">
        <CountUp target={79} decimals={1} prefix="$" suffix="B" className="text-[2.6rem] font-extrabold tracking-tight tabular-nums" style={{ color: "var(--text-high-emphasis)" }} />
        <div className="text-sm mt-1" style={{ color: "var(--text-med-emphasis)" }}>24h volume traded</div>
      </Reveal>
      <Reveal delay={0.1} className="text-center">
        <CountUp target={340} decimals={0} suffix="+" className="text-[2.6rem] font-extrabold tracking-tight tabular-nums" style={{ color: "var(--text-high-emphasis)" }} />
        <div className="text-sm mt-1" style={{ color: "var(--text-med-emphasis)" }}>Markets listed</div>
      </Reveal>
      <Reveal delay={0.2} className="text-center">
        <CountUp target={99.99} decimals={2} suffix="%" className="text-[2.6rem] font-extrabold tracking-tight tabular-nums" style={{ color: "var(--accent)" }} />
        <div className="text-sm mt-1" style={{ color: "var(--text-med-emphasis)" }}>Feed uptime</div>
      </Reveal>
    </div>
  </section>
);

const spark = [30, 44, 38, 52, 47, 61, 55, 68, 60, 74, 66, 80, 72, 86, 78, 64, 71, 83, 90, 76, 84, 92, 88, 96];

const PathIcon = ({ d, circle }: { d: string; circle?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    {circle && <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></>}
    <path d={d} />
  </svg>
);

const IconTile = ({ children, small }: { children: React.ReactNode; small?: boolean }) => (
  <div
    className={`${small ? "w-10 h-10" : "w-[42px] h-[42px]"} rounded-[11px] inline-flex items-center justify-center`}
    style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}
  >
    {children}
  </div>
);

const BentoCard = ({ children, cols, rows, delay, style }: { children: React.ReactNode; cols: string; rows: string; delay?: number; style?: React.CSSProperties }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal
      delay={delay}
      style={{
        gridColumn: cols,
        gridRow: rows,
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border-hairline)"}`,
        borderRadius: 14,
        background: "var(--surface-card)",
        transition: "border-color .15s var(--ease-in-out)",
        ...style,
      }}
    >
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ height: "100%" }}>
        {children}
      </div>
    </Reveal>
  );
};

const FeaturesBento = () => (
  <section id="features" style={{ ...sectionStyle, paddingTop: "var(--lp-sec)", paddingBottom: "var(--lp-sec)" }}>
    <Reveal className="mb-12 max-w-xl">
      <div className="text-[0.78rem] font-semibold tracking-widest uppercase mb-3.5" style={{ color: "var(--accent)" }}>The terminal</div>
      <h2 className="m-0 leading-tight tracking-tight font-extrabold" style={{ fontSize: "var(--lp-h2)", color: "var(--text-high-emphasis)" }}>
        Everything a trader reads,<br />on one calm surface.
      </h2>
      <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>No noise, no clutter. Just the numbers that move markets — streaming in real time.</p>
    </Reveal>
    <div className="grid auto-rows-[minmax(168px,auto)] gap-4" style={{ gridTemplateColumns: "var(--lp-bento-cols)" }}>
      <BentoCard cols="var(--lp-b1c)" rows="var(--lp-b1r)" style={{ padding: 28 }}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <IconTile><PathIcon d="M22 12h-4l-3 9L9 3l-3 9H2" /></IconTile>
            <h3 className="mt-5 mb-2 text-xl font-bold" style={{ color: "var(--text-high-emphasis)" }}>Real-time everything</h3>
            <p className="m-0 text-[0.98rem] leading-relaxed max-w-[340px]" style={{ color: "var(--text-med-emphasis)" }}>Prices, depth and trades stream live over WebSocket. No refresh button. No lag between the market and your screen.</p>
          </div>
          <div className="flex items-end gap-1 h-16 mt-5">
            {spark.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: "var(--accent)", opacity: 0.85 }} />
            ))}
          </div>
        </div>
      </BentoCard>

      <BentoCard cols="var(--lp-b2c)" rows="var(--lp-b2r)" delay={0.06} style={{ padding: 28 }}>
        <IconTile><PathIcon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></IconTile>
        <h3 className="mt-4.5 mb-2 text-xl font-bold" style={{ color: "var(--text-high-emphasis)" }}>Deep order books</h3>
        <p className="m-0 mb-4 text-[0.95rem] leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>Every bid and ask, color-coded by depth.</p>
        <div className="flex flex-col gap-1">
          {[{ p: "178.06", q: "0.09", w: 72, sell: true }, { p: "177.94", q: "11.99", w: 54, sell: true }, { p: "177.70", q: "140.70", w: 88, sell: false }, { p: "177.61", q: "14.07", w: 40, sell: false }].map((r, i) => (
            <div key={i} className="relative h-4 rounded overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0" style={{ width: `${r.w}%`, background: r.sell ? "var(--sell-depth)" : "var(--buy-depth)" }} />
              <div className="relative flex justify-between px-2 text-[0.68rem] tabular-nums leading-4" style={{ color: r.sell ? "var(--sell)" : "var(--buy)" }}>
                <span>{r.p}</span><span>{r.q}</span>
              </div>
            </div>
          ))}
        </div>
      </BentoCard>

      <BentoCard cols="var(--lp-b3c)" rows="var(--lp-b3r)" delay={0.12} style={{ padding: 24 }}>
        <IconTile small><PathIcon d="M3 3v18h18M19 9l-5 5-4-4-3 3" /></IconTile>
        <h3 className="mt-4 mb-1.5 text-base font-bold" style={{ color: "var(--text-high-emphasis)" }}>Pro charts</h3>
        <p className="m-0 text-sm leading-snug" style={{ color: "var(--text-med-emphasis)" }}>Candlesticks with exchange-grade rendering.</p>
      </BentoCard>

      <BentoCard cols="var(--lp-b4c)" rows="var(--lp-b4r)" delay={0.18} style={{ padding: 24 }}>
        <IconTile small><PathIcon d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></IconTile>
        <h3 className="mt-4 mb-1.5 text-base font-bold" style={{ color: "var(--text-high-emphasis)" }}>Smart alerts</h3>
        <p className="m-0 text-sm leading-snug" style={{ color: "var(--text-med-emphasis)" }}>Get pinged when price crosses your line.</p>
      </BentoCard>

      <BentoCard cols="var(--lp-b5c)" rows="var(--lp-b5r)" delay={0.24} style={{ padding: 28 }}>
        <div className="flex items-center justify-between gap-5 h-full">
          <div>
            <IconTile><PathIcon d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" circle /></IconTile>
            <h3 className="mt-4.5 mb-1.5 text-xl font-bold" style={{ color: "var(--text-high-emphasis)" }}>340+ markets, one screener</h3>
            <p className="m-0 text-[0.95rem] leading-relaxed max-w-[320px]" style={{ color: "var(--text-med-emphasis)" }}>Every major pair on Backpack, sorted by cap, volume or 24h move.</p>
          </div>
          <div className="text-[3.4rem] font-extrabold tabular-nums tracking-tight leading-none" style={{ color: "var(--border-med)" }}>340+</div>
        </div>
      </BentoCard>
    </div>
  </section>
);

const HowItWorks = () => (
  <section style={{ borderTop: "1px solid var(--border-hairline)", background: "var(--surface-card)" }}>
    <div style={{ ...sectionStyle, paddingTop: "var(--lp-sec)", paddingBottom: "var(--lp-sec)" }}>
      <Reveal className="text-center mb-14">
        <div className="text-[0.78rem] font-semibold tracking-widest uppercase mb-3.5" style={{ color: "var(--accent)" }}>Three moves</div>
        <h2 className="m-0 leading-tight tracking-tight font-extrabold" style={{ fontSize: "var(--lp-h2)", color: "var(--text-high-emphasis)" }}>Look. Study. Leap.</h2>
      </Reveal>
      <div className="grid gap-5" style={{ gridTemplateColumns: "var(--lp-step-cols)" }}>
        <Reveal style={{ border: "1px solid var(--border-hairline)", borderRadius: 14, background: "var(--bg-base)", padding: 32 }}>
          <div className="text-sm font-bold tabular-nums" style={{ color: "var(--accent)" }}>01</div>
          <div className="w-11 h-11 rounded-xl inline-flex items-center justify-center my-4" style={{ background: "var(--surface-elevated)", color: "var(--text-high-emphasis)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <h3 className="m-0 mb-2 text-xl font-bold" style={{ color: "var(--text-high-emphasis)" }}>Look</h3>
          <p className="m-0 text-[0.96rem] leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>Screen the market. Sort by cap, volume, or 24h move to find what&apos;s alive today.</p>
        </Reveal>
        <Reveal delay={0.1} style={{ border: "1px solid var(--border-hairline)", borderRadius: 14, background: "var(--bg-base)", padding: 32 }}>
          <div className="text-sm font-bold tabular-nums" style={{ color: "var(--accent)" }}>02</div>
          <div className="w-11 h-11 rounded-xl inline-flex items-center justify-center my-4" style={{ background: "var(--surface-elevated)", color: "var(--text-high-emphasis)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          </div>
          <h3 className="m-0 mb-2 text-xl font-bold" style={{ color: "var(--text-high-emphasis)" }}>Study</h3>
          <p className="m-0 text-[0.96rem] leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>Open the trade view. Read the order book, read the candles, weigh the depth.</p>
        </Reveal>
        <Reveal delay={0.2} style={{ border: "1px solid var(--border-hairline)", borderRadius: 14, background: "var(--bg-base)", padding: 32 }}>
          <div className="text-sm font-bold tabular-nums" style={{ color: "var(--accent)" }}>03</div>
          <div className="w-11 h-11 rounded-xl inline-flex items-center justify-center my-4" style={{ background: "var(--surface-elevated)", color: "var(--buy)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
          </div>
          <h3 className="m-0 mb-2 text-xl font-bold" style={{ color: "var(--text-high-emphasis)" }}>Leap</h3>
          <p className="m-0 text-[0.96rem] leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>Place your order. Limit or market, Post-Only or IOC — you&apos;re in full control.</p>
        </Reveal>
      </div>
    </div>
  </section>
);

const MarketsPreviewSection = () => {
  const router = useRouter();
  return (
    <section id="markets" style={{ ...sectionStyle, paddingTop: "var(--lp-sec)", paddingBottom: "var(--lp-sec)" }}>
      <Reveal className="flex items-end justify-between gap-5 flex-wrap mb-8">
        <div>
          <div className="text-[0.78rem] font-semibold tracking-widest uppercase mb-3.5" style={{ color: "var(--accent)" }}>The screener</div>
          <h2 className="m-0 leading-tight tracking-tight font-extrabold" style={{ fontSize: "var(--lp-h2)", color: "var(--text-high-emphasis)" }}>Markets, at a glance.</h2>
        </div>
        <Button variant="primary" size="md" onClick={() => router.push("/markets")}>View all markets</Button>
      </Reveal>
      <Reveal>
        <MarketsPreview />
      </Reveal>
    </section>
  );
};

const testimonials = [
  { quote: "I finally understand what I’m looking at before I buy. The screener made crypto make sense.", name: "Maya Chen", role: "New to crypto", initial: "M" },
  { quote: "The order book actually makes sense here — depth, spread, size, all readable at a glance.", name: "Dario Neri", role: "Swing trader", initial: "D" },
  { quote: "Fastest screener I’ve used. Period. It feels like a real terminal, not a toy.", name: "Priya Raman", role: "Day trader", initial: "P" },
];

const Testimonials = () => (
  <section style={{ ...sectionStyle, paddingTop: "var(--lp-sec)", paddingBottom: "var(--lp-sec)" }}>
    <Reveal className="text-center mb-12">
      <div className="text-[0.78rem] font-semibold tracking-widest uppercase mb-3.5" style={{ color: "var(--accent)" }}>Trusted by traders</div>
      <h2 className="m-0 leading-tight tracking-tight font-extrabold" style={{ fontSize: "var(--lp-h2)", color: "var(--text-high-emphasis)" }}>Clarity, first.</h2>
    </Reveal>
    <div className="grid gap-5" style={{ gridTemplateColumns: "var(--lp-test-cols)" }}>
      {testimonials.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.08} className="flex flex-col gap-5" style={{ border: "1px solid var(--border-hairline)", borderRadius: 14, background: "var(--surface-card)", padding: 28 }}>
          <p className="m-0 text-[1.05rem] leading-relaxed" style={{ color: "var(--text-high-emphasis)" }}>&ldquo;{t.quote}&rdquo;</p>
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}>{t.initial}</div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-high-emphasis)" }}>{t.name}</div>
              <div className="text-xs" style={{ color: "var(--text-low-emphasis)" }}>{t.role}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const faqData = [
  { q: "Is Xchange a custodial exchange?", a: "No. Xchange is a screener and trading interface built on public market data from Backpack Exchange. It surfaces prices, depth and trades — you keep custody of your own assets." },
  { q: "Do I need an account to browse markets?", a: "No account required to explore. The screener, charts and order books are open to everyone. An account only unlocks alerts, watchlists and personalized settings." },
  { q: "Where does the market data come from?", a: "Live price, depth and trade data stream over WebSocket from Backpack Exchange’s public market feeds — the same data professional traders read." },
  { q: "Is there a mobile app?", a: "Xchange is fully responsive and works beautifully in any mobile browser. Native iOS and Android apps are on the roadmap." },
  { q: "What does it cost to start?", a: "Exploring is free forever. Paid Trader and Pro plans add unlimited alerts, full-depth books, advanced charting and API access when you’re ready to scale." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ borderTop: "1px solid var(--border-hairline)", background: "var(--surface-card)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "var(--lp-sec) var(--lp-pad)" }}>
        <Reveal className="text-center mb-12">
          <div className="text-[0.78rem] font-semibold tracking-widest uppercase mb-3.5" style={{ color: "var(--accent)" }}>FAQ</div>
          <h2 className="m-0 leading-tight tracking-tight font-extrabold" style={{ fontSize: "var(--lp-h2)", color: "var(--text-high-emphasis)" }}>Questions, answered.</h2>
        </Reveal>
        <Reveal className="flex flex-col gap-3">
          {faqData.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="cursor-pointer"
                style={{ border: "1px solid var(--border-hairline)", borderRadius: 12, background: "var(--bg-base)", padding: "20px 22px" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[1.02rem] font-semibold" style={{ color: "var(--text-high-emphasis)" }}>{f.q}</span>
                  <span
                    className="shrink-0"
                    style={{ color: "var(--text-med-emphasis)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .25s var(--ease-in-out)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>
                <div className="overflow-hidden" style={{ maxHeight: isOpen ? 160 : 0, transition: "max-height .3s var(--ease-in-out)" }}>
                  <p className="mt-3.5 mb-0 text-[0.95rem] leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>{f.a}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const router = useRouter();
  return (
    <section style={{ ...sectionStyle, paddingTop: "var(--lp-sec)", paddingBottom: "var(--lp-sec)" }}>
      <Reveal
        className="relative text-center overflow-hidden"
        style={{ border: "1px solid var(--border-hairline)", borderRadius: 20, background: "var(--surface-card)", padding: "clamp(40px,7vw,80px)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-black tracking-tight whitespace-nowrap pointer-events-none"
          style={{ fontSize: "clamp(6rem,18vw,15rem)", color: "var(--text-high-emphasis)", opacity: 0.035, letterSpacing: "-0.04em" }}
        >XCHANGE</div>
        <div className="relative">
          <h2 className="mx-auto max-w-[640px] leading-tight tracking-tight font-extrabold" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", color: "var(--text-high-emphasis)" }}>Look first. Then leap.</h2>
          <p className="mt-5 mx-auto max-w-[460px] text-lg leading-relaxed" style={{ color: "var(--text-med-emphasis)" }}>Free to explore. No account needed to start reading the market.</p>
          <div className="flex flex-wrap gap-3.5 justify-center mt-8">
            <Button variant="success" size="lg" onClick={() => router.push("/markets")}>Explore Markets</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

