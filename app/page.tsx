"use client";

import { PrimaryButton, SuccessButton } from "./components/core/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { CountUp } from "./components/landing/CountUp";
import { LiveChartPreview } from "./components/landing/LiveChartPreview";
import { TickerMarquee } from "./components/landing/TickerMarquee";
import { MarketsPreview } from "./components/landing/MarketsPreview";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const Reveal = ({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={reveal}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <TickerMarquee />
      <Hero />
      <StatsBand />
      <FeaturesBento />
      <HowItWorks />
      <MarketsPreviewSection />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

const Hero = () => {
  const router = useRouter();
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-11 pt-12 sm:pt-16 pb-16 sm:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-[1.04fr_0.96fr] gap-10 lg:gap-14 items-center">
        <div>
          <Reveal className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-[#1A2438] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[0.74rem] font-semibold tracking-wide uppercase text-baseTextMedEmphasis">Live market data · Backpack</span>
          </Reveal>
          <h1 className="m-0 font-extrabold leading-[0.98] tracking-tight text-[2.8rem] sm:text-[4rem] lg:text-[5.4rem]">
            <Reveal className="block text-baseTextHighEmphasis" delay={0.05}>Look First.</Reveal>
            <Reveal className="block text-baseTextHighEmphasis" delay={0.18}>Then <span className="text-teal-500">Leap.</span></Reveal>
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-[440px] text-lg leading-relaxed text-baseTextMedEmphasis">
              The best trades require research, then commitment. Screen every market, read the book, watch the chart — then act with conviction.
            </p>
          </Reveal>
          <Reveal delay={0.42} className="flex flex-wrap gap-3.5 mt-9">
            <SuccessButton className="h-[52px] w-auto px-6" textSize="1.05rem" onClick={() => router.push("/markets")}>
              Explore Markets
            </SuccessButton>
            <PrimaryButton className="h-[52px] w-auto px-6" textSize="1.05rem" onClick={() => router.push("/trade/SOL_USDC")}>
              Trade SOL / USDC
            </PrimaryButton>
          </Reveal>
          <Reveal delay={0.54} className="flex flex-wrap gap-8 mt-11">
            <div>
              <div className="text-2xl font-bold text-baseTextHighEmphasis tabular-nums">$79.0B</div>
              <div className="text-xs text-slate-500">24h volume</div>
            </div>
            <div className="w-px bg-slate-800" />
            <div>
              <div className="text-2xl font-bold text-baseTextHighEmphasis tabular-nums">340+</div>
              <div className="text-xs text-slate-500">Markets</div>
            </div>
            <div className="w-px bg-slate-800" />
            <div>
              <div className="text-2xl font-bold text-baseTextHighEmphasis tabular-nums">2.1M</div>
              <div className="text-xs text-slate-500">Traders</div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.24}>
          <LiveChartPreview />
        </Reveal>
      </div>
    </section>
  );
};

const StatsBand = () => (
  <section className="border-y border-slate-800 bg-[#1A2438]">
    <div className="max-w-[1240px] mx-auto px-5 sm:px-11 py-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
      <Reveal className="text-center">
        <CountUp target={79} decimals={1} prefix="$" suffix="B" className="text-[2.6rem] font-extrabold tracking-tight text-baseTextHighEmphasis tabular-nums" />
        <div className="text-sm text-baseTextMedEmphasis mt-1">24h volume traded</div>
      </Reveal>
      <Reveal delay={0.1} className="text-center">
        <CountUp target={340} decimals={0} suffix="+" className="text-[2.6rem] font-extrabold tracking-tight text-baseTextHighEmphasis tabular-nums" />
        <div className="text-sm text-baseTextMedEmphasis mt-1">Markets listed</div>
      </Reveal>
      <Reveal delay={0.2} className="text-center">
        <CountUp target={99.99} decimals={2} suffix="%" className="text-[2.6rem] font-extrabold tracking-tight text-teal-500 tabular-nums" />
        <div className="text-sm text-baseTextMedEmphasis mt-1">Feed uptime</div>
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
  <div className={`${small ? "w-10 h-10" : "w-[42px] h-[42px]"} rounded-[11px] bg-[#243049] inline-flex items-center justify-center text-teal-500`}>
    {children}
  </div>
);

const FeaturesBento = () => (
  <section id="features" className="max-w-[1240px] mx-auto px-5 sm:px-11 py-16 sm:py-32">
    <Reveal className="mb-12 max-w-xl">
      <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-teal-500 mb-3.5">The terminal</div>
      <h2 className="m-0 text-[1.85rem] sm:text-[2.7rem] leading-tight tracking-tight font-extrabold text-baseTextHighEmphasis">
        Everything a trader reads,<br />on one calm surface.
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-baseTextMedEmphasis">No noise, no clutter. Just the numbers that move markets — streaming in real time.</p>
    </Reveal>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(168px,auto)] gap-4">
      <Reveal className="sm:col-span-2 sm:row-span-2 border border-slate-800 rounded-xl bg-[#1A2438] p-7 flex flex-col justify-between hover:border-teal-500 transition-colors">
        <div>
          <IconTile><PathIcon d="M22 12h-4l-3 9L9 3l-3 9H2" /></IconTile>
          <h3 className="mt-5 mb-2 text-xl font-bold text-baseTextHighEmphasis">Real-time everything</h3>
          <p className="m-0 text-[0.98rem] leading-relaxed text-baseTextMedEmphasis max-w-[340px]">Prices, depth and trades stream live over WebSocket. No refresh button. No lag between the market and your screen.</p>
        </div>
        <div className="flex items-end gap-1 h-16 mt-5">
          {spark.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-teal-500 opacity-85" style={{ height: `${h}%` }} />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.06} className="sm:col-span-2 border border-slate-800 rounded-xl bg-[#1A2438] p-7 hover:border-teal-500 transition-colors">
        <IconTile><PathIcon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></IconTile>
        <h3 className="mt-4.5 mb-2 text-xl font-bold text-baseTextHighEmphasis">Deep order books</h3>
        <p className="m-0 mb-4 text-[0.95rem] leading-relaxed text-baseTextMedEmphasis">Every bid and ask, color-coded by depth.</p>
        <div className="flex flex-col gap-1">
          {[{ p: "178.06", q: "0.09", w: 72, sell: true }, { p: "177.94", q: "11.99", w: 54, sell: true }, { p: "177.70", q: "140.70", w: 88, sell: false }, { p: "177.61", q: "14.07", w: 40, sell: false }].map((r, i) => (
            <div key={i} className="relative h-4 rounded overflow-hidden">
              <div className={`absolute right-0 top-0 bottom-0 ${r.sell ? "bg-red-500/[0.325]" : "bg-green-500/[0.325]"}`} style={{ width: `${r.w}%` }} />
              <div className={`relative flex justify-between px-2 text-[0.68rem] tabular-nums leading-4 ${r.sell ? "text-red-500" : "text-green-500"}`}>
                <span>{r.p}</span><span>{r.q}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.12} className="border border-slate-800 rounded-xl bg-[#1A2438] p-6 hover:border-teal-500 transition-colors">
        <IconTile small><PathIcon d="M3 3v18h18M19 9l-5 5-4-4-3 3" /></IconTile>
        <h3 className="mt-4 mb-1.5 text-base font-bold text-baseTextHighEmphasis">Pro charts</h3>
        <p className="m-0 text-sm leading-snug text-baseTextMedEmphasis">Candlesticks with exchange-grade rendering.</p>
      </Reveal>

      <Reveal delay={0.18} className="border border-slate-800 rounded-xl bg-[#1A2438] p-6 hover:border-teal-500 transition-colors">
        <IconTile small><PathIcon d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></IconTile>
        <h3 className="mt-4 mb-1.5 text-base font-bold text-baseTextHighEmphasis">Smart alerts</h3>
        <p className="m-0 text-sm leading-snug text-baseTextMedEmphasis">Get pinged when price crosses your line.</p>
      </Reveal>

      <Reveal delay={0.24} className="sm:col-span-2 border border-slate-800 rounded-xl bg-[#1A2438] p-7 flex items-center justify-between gap-5 hover:border-teal-500 transition-colors">
        <div>
          <IconTile><PathIcon d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" circle /></IconTile>
          <h3 className="mt-4.5 mb-1.5 text-xl font-bold text-baseTextHighEmphasis">340+ markets, one screener</h3>
          <p className="m-0 text-[0.95rem] leading-relaxed text-baseTextMedEmphasis max-w-[320px]">Every major pair on Backpack, sorted by cap, volume or 24h move.</p>
        </div>
        <div className="text-[3.4rem] font-extrabold text-slate-700 tabular-nums tracking-tight leading-none">340+</div>
      </Reveal>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="border-t border-slate-800 bg-[#1A2438]">
    <div className="max-w-[1240px] mx-auto px-5 sm:px-11 py-16 sm:py-32">
      <Reveal className="text-center mb-14">
        <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-teal-500 mb-3.5">Three moves</div>
        <h2 className="m-0 text-[1.85rem] sm:text-[2.7rem] leading-tight tracking-tight font-extrabold text-baseTextHighEmphasis">Look. Study. Leap.</h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Reveal className="border border-slate-800 rounded-xl bg-[#0e0f14] p-8">
          <div className="text-sm font-bold text-teal-500 tabular-nums">01</div>
          <div className="w-11 h-11 rounded-xl bg-[#243049] inline-flex items-center justify-center text-baseTextHighEmphasis my-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <h3 className="m-0 mb-2 text-xl font-bold text-baseTextHighEmphasis">Look</h3>
          <p className="m-0 text-[0.96rem] leading-relaxed text-baseTextMedEmphasis">Screen the market. Sort by cap, volume, or 24h move to find what&apos;s alive today.</p>
        </Reveal>
        <Reveal delay={0.1} className="border border-slate-800 rounded-xl bg-[#0e0f14] p-8">
          <div className="text-sm font-bold text-teal-500 tabular-nums">02</div>
          <div className="w-11 h-11 rounded-xl bg-[#243049] inline-flex items-center justify-center text-baseTextHighEmphasis my-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          </div>
          <h3 className="m-0 mb-2 text-xl font-bold text-baseTextHighEmphasis">Study</h3>
          <p className="m-0 text-[0.96rem] leading-relaxed text-baseTextMedEmphasis">Open the trade view. Read the order book, read the candles, weigh the depth.</p>
        </Reveal>
        <Reveal delay={0.2} className="border border-slate-800 rounded-xl bg-[#0e0f14] p-8">
          <div className="text-sm font-bold text-teal-500 tabular-nums">03</div>
          <div className="w-11 h-11 rounded-xl bg-[#243049] inline-flex items-center justify-center text-green-500 my-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
          </div>
          <h3 className="m-0 mb-2 text-xl font-bold text-baseTextHighEmphasis">Leap</h3>
          <p className="m-0 text-[0.96rem] leading-relaxed text-baseTextMedEmphasis">Place your order. Limit or market, Post-Only or IOC — you&apos;re in full control.</p>
        </Reveal>
      </div>
    </div>
  </section>
);

const MarketsPreviewSection = () => {
  const router = useRouter();
  return (
    <section id="markets" className="max-w-[1240px] mx-auto px-5 sm:px-11 py-16 sm:py-32">
      <Reveal className="flex items-end justify-between gap-5 flex-wrap mb-8">
        <div>
          <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-teal-500 mb-3.5">The screener</div>
          <h2 className="m-0 text-[1.85rem] sm:text-[2.7rem] leading-tight tracking-tight font-extrabold text-baseTextHighEmphasis">Markets, at a glance.</h2>
        </div>
        <PrimaryButton className="h-11 w-auto px-5" textSize="0.95rem" onClick={() => router.push("/markets")}>
          View all markets
        </PrimaryButton>
      </Reveal>
      <Reveal>
        <MarketsPreview />
      </Reveal>
    </section>
  );
};

const tiers = [
  {
    name: "Explorer", price: "Free", sub: "For the crypto-curious",
    features: ["Real-time market screener", "Live charts & order books", "Up to 5 watchlists"],
    cta: "Get started", featured: false,
  },
  {
    name: "Trader", price: "$19", per: "/mo", sub: "For active traders",
    features: ["Everything in Explorer", "Unlimited smart alerts", "Full-depth order book", "Advanced chart tools"],
    cta: "Start trading", featured: true,
  },
  {
    name: "Pro", price: "$99", per: "/mo", sub: "For quants & desks",
    features: ["Everything in Trader", "REST & WebSocket API access", "Low-latency co-located feeds", "Priority support"],
    cta: "Contact sales", featured: false,
  },
];

const Pricing = () => {
  const router = useRouter();
  return (
    <section id="pricing" className="border-t border-slate-800 bg-[#1A2438]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-11 py-16 sm:py-32">
        <Reveal className="text-center mb-14">
          <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-teal-500 mb-3.5">Pricing</div>
          <h2 className="m-0 text-[1.85rem] sm:text-[2.7rem] leading-tight tracking-tight font-extrabold text-baseTextHighEmphasis">Start free. Scale when you&apos;re ready.</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className={`relative rounded-2xl bg-[#0e0f14] p-8 flex flex-col border ${t.featured ? "border-teal-500 shadow-[0_8px_24px_rgba(0,0,0,0.45)]" : "border-slate-800"}`}>
              {t.featured && (
                <div className="absolute -top-[11px] left-8 px-3 py-1 rounded-full bg-teal-500 text-[#062b26] text-[0.68rem] font-bold tracking-wide uppercase">Most popular</div>
              )}
              <div className="text-lg font-bold text-baseTextHighEmphasis">{t.name}</div>
              <div className="mt-3.5 mb-1 flex items-baseline gap-1">
                <span className="text-[2.6rem] font-extrabold tracking-tight text-baseTextHighEmphasis">{t.price}</span>
                {t.per && <span className="text-sm text-slate-500">{t.per}</span>}
              </div>
              <div className="text-[0.85rem] text-slate-500 mb-6">{t.sub}</div>
              <div className="flex flex-col gap-3 flex-1">
                {t.features.map(f => (
                  <div key={f} className="flex gap-2.5 items-start text-[0.92rem] text-baseTextMedEmphasis">
                    <span className="text-teal-500 shrink-0 mt-0.5">✓</span>{f}
                  </div>
                ))}
              </div>
              {t.featured ? (
                <SuccessButton className="h-11 w-full mt-7 mr-0" textSize="0.95rem" onClick={() => router.push("/trade/SOL_USDC")}>{t.cta}</SuccessButton>
              ) : (
                <PrimaryButton className="h-11 w-full mt-7 mr-0" textSize="0.95rem" onClick={() => router.push("/markets")}>{t.cta}</PrimaryButton>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  { quote: "I finally understand what I’m looking at before I buy. The screener made crypto make sense.", name: "Maya Chen", role: "New to crypto", initial: "M" },
  { quote: "The order book actually makes sense here — depth, spread, size, all readable at a glance.", name: "Dario Neri", role: "Swing trader", initial: "D" },
  { quote: "Fastest screener I’ve used. Period. It feels like a real terminal, not a toy.", name: "Priya Raman", role: "Day trader", initial: "P" },
];

const Testimonials = () => (
  <section className="max-w-[1240px] mx-auto px-5 sm:px-11 py-16 sm:py-32">
    <Reveal className="text-center mb-12">
      <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-teal-500 mb-3.5">Trusted by traders</div>
      <h2 className="m-0 text-[1.85rem] sm:text-[2.7rem] leading-tight tracking-tight font-extrabold text-baseTextHighEmphasis">Clarity, first.</h2>
    </Reveal>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {testimonials.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.08} className="border border-slate-800 rounded-xl bg-[#1A2438] p-7 flex flex-col gap-5">
          <p className="m-0 text-[1.05rem] leading-relaxed text-baseTextHighEmphasis">&ldquo;{t.quote}&rdquo;</p>
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-10 h-10 rounded-full bg-[#243049] flex items-center justify-center font-bold text-teal-500">{t.initial}</div>
            <div>
              <div className="text-sm font-semibold text-baseTextHighEmphasis">{t.name}</div>
              <div className="text-xs text-slate-500">{t.role}</div>
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
    <section id="faq" className="border-t border-slate-800 bg-[#1A2438]">
      <div className="max-w-[820px] mx-auto px-5 sm:px-11 py-16 sm:py-32">
        <Reveal className="text-center mb-12">
          <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-teal-500 mb-3.5">FAQ</div>
          <h2 className="m-0 text-[1.85rem] sm:text-[2.7rem] leading-tight tracking-tight font-extrabold text-baseTextHighEmphasis">Questions, answered.</h2>
        </Reveal>
        <Reveal className="flex flex-col gap-3">
          {faqData.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} onClick={() => setOpen(isOpen ? null : i)} className="border border-slate-800 rounded-xl bg-[#0e0f14] px-5 py-5 cursor-pointer hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[1.02rem] font-semibold text-baseTextHighEmphasis">{f.q}</span>
                  <span className={`shrink-0 text-baseTextMedEmphasis transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>
                <div className={`overflow-hidden transition-[max-height] duration-300 ${isOpen ? "max-h-40" : "max-h-0"}`}>
                  <p className="mt-3.5 mb-0 text-[0.95rem] leading-relaxed text-baseTextMedEmphasis">{f.a}</p>
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
    <section className="max-w-[1240px] mx-auto px-5 sm:px-11 py-16 sm:py-32">
      <Reveal className="relative border border-slate-800 rounded-[20px] bg-[#1A2438] p-10 sm:p-16 text-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 flex items-center justify-center font-black tracking-tight text-baseTextHighEmphasis opacity-[0.035] whitespace-nowrap pointer-events-none text-[6rem] sm:text-[10rem]">XCHANGE</div>
        <div className="relative">
          <h2 className="mx-auto max-w-[640px] text-[2rem] sm:text-[3.4rem] leading-tight tracking-tight font-extrabold text-baseTextHighEmphasis">Look first. Then leap.</h2>
          <p className="mt-5 mx-auto max-w-[460px] text-lg leading-relaxed text-baseTextMedEmphasis">Free to explore. No account needed to start reading the market.</p>
          <div className="flex flex-wrap gap-3.5 justify-center mt-8">
            <SuccessButton className="h-[52px] w-auto px-6" textSize="1.05rem" onClick={() => router.push("/markets")}>Explore Markets</SuccessButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-slate-800">
    <div className="max-w-[1240px] mx-auto px-5 sm:px-11 py-12 flex flex-wrap gap-8 items-start justify-between">
      <div className="max-w-[280px]">
        <div className="text-xl font-extrabold tracking-tight"><span className="text-green-500">X</span><span className="text-baseTextHighEmphasis">change</span></div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">A real-time crypto screener &amp; trading terminal built on Backpack Exchange data.</p>
      </div>
      <div className="flex gap-14 flex-wrap">
        <div className="flex flex-col gap-2.5">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Product</div>
          <a href="#markets" className="text-sm text-baseTextMedEmphasis hover:text-baseTextHighEmphasis">Markets</a>
          <a href="#features" className="text-sm text-baseTextMedEmphasis hover:text-baseTextHighEmphasis">Features</a>
          <a href="#pricing" className="text-sm text-baseTextMedEmphasis hover:text-baseTextHighEmphasis">Pricing</a>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Company</div>
          <a href="#top" className="text-sm text-baseTextMedEmphasis hover:text-baseTextHighEmphasis">About</a>
          <a href="#faq" className="text-sm text-baseTextMedEmphasis hover:text-baseTextHighEmphasis">FAQ</a>
          <a href="#top" className="text-sm text-baseTextMedEmphasis hover:text-baseTextHighEmphasis">Careers</a>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-11 py-5 flex flex-wrap gap-3 items-center justify-between text-sm text-slate-500">
        <div>© {new Date().getFullYear()} Xchange.inc · CEO: Ritik Bora</div>
        <div>Look First. Then Leap.</div>
      </div>
    </div>
  </footer>
);
