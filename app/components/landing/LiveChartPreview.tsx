"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/components/theme-provider";
import { getTicker } from "@/app/utils/httpClient";

type Candle = { o: number; h: number; l: number; c: number };

const SYNC_INTERVAL_MS = 5 * 60 * 1000;

export const LiveChartPreview = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [change, setChange] = useState<number | null>(null);
    const [dayHigh, setDayHigh] = useState<number | null>(null);
    const [dayLow, setDayLow] = useState<number | null>(null);
    const [dayVolume, setDayVolume] = useState<number | null>(null);
    const { theme } = useTheme();
    const themeRef = useRef(theme);
    themeRef.current = theme;

    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;

        let cancelled = false;
        let raf = 0;
        let syncTimer: ReturnType<typeof setInterval> | undefined;

        let cw = 0, ch = 0;
        const fit = () => {
            const dpr = window.devicePixelRatio || 1;
            const r = cv.getBoundingClientRect();
            if (!r.width) return;
            cv.width = Math.round(r.width * dpr);
            cv.height = Math.round(r.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cw = r.width; ch = r.height;
        };
        fit();
        window.addEventListener("resize", fit);

        // Anchor + spread define the band the fake random-walk oscillates within.
        // We resolve the real price BEFORE building any candles so the very first
        // frame is already centered on reality — no post-load correction dip.
        // spread is a % of anchor (not a fixed dollar amount) so the band scales
        // correctly whatever the real price happens to be.
        let anchor = 177;
        let spread = anchor * 0.04;

        const fetchAnchor = async () => {
            try {
                const ticker = await getTicker("SOL_USDC");
                const real = parseFloat(ticker.lastPrice);
                if (!isNaN(real) && real > 0) {
                    anchor = real;
                    spread = anchor * 0.04;
                }
                const high = parseFloat(ticker.high);
                const low = parseFloat(ticker.low);
                const volume = parseFloat(ticker.volume);
                if (!isNaN(high)) setDayHigh(high);
                if (!isNaN(low)) setDayLow(low);
                if (!isNaN(volume)) setDayVolume(volume);
            } catch (e) { }
        };

        const start = async () => {
            await fetchAnchor();
            if (cancelled) return;

            // Seed history reads as a cup-and-handle: a rounded dip, a shallow
            // pullback, then a breakout that resolves bullish right into the
            // live anchor price — never a straight drop into "now".
            const N = 46;
            const cupEnd = Math.round(N * 0.58);
            const handleEnd = Math.round(N * 0.78);
            const lip = anchor + spread * 0.12;
            const cupBottom = anchor - spread * 0.85;
            const handleLow = lip - spread * 0.30;

            const levelAt = (i: number) => {
                if (i <= cupEnd) {
                    const t = i / cupEnd;
                    return lip - (lip - cupBottom) * Math.sin(Math.PI * t);
                }
                if (i <= handleEnd) {
                    const t = (i - cupEnd) / (handleEnd - cupEnd);
                    return lip - (lip - handleLow) * t;
                }
                const t = (i - handleEnd) / (N - 1 - handleEnd);
                return handleLow + (anchor - handleLow) * t;
            };

            const noiseAmt = spread * 0.10;
            const wickAmt = spread * 0.12;
            const minBody = spread * 0.05;
            const cs: Candle[] = [];
            let p = levelAt(0);
            for (let i = 0; i < N; i++) {
                const o = p;
                let c = levelAt(i) + (Math.random() - 0.5) * noiseAmt;
                if (Math.abs(c - o) < minBody) {
                    c = o + (c >= o ? minBody : -minBody);
                }
                const hi = Math.max(o, c) + Math.random() * wickAmt;
                const lo = Math.min(o, c) - Math.random() * wickAmt;
                cs.push({ o, h: hi, l: lo, c });
                p = c;
            }
            const base = cs[0].c;
            let target = cs[cs.length - 1].c;
            let lastShift = performance.now();

            syncTimer = setInterval(fetchAnchor, SYNC_INTERVAL_MS);

            const draw = () => {
                if (!cw || !ch) return;
                ctx.clearRect(0, 0, cw, ch);
                const light = themeRef.current === "light";
                const pad = { t: 18, b: 18, l: 8, r: 58 };
                let mn = Infinity, mx = -Infinity;
                cs.forEach(k => { mn = Math.min(mn, k.l); mx = Math.max(mx, k.h); });
                const rng = (mx - mn) || 1;
                mn -= rng * 0.1; mx += rng * 0.1;
                const X = cw - pad.l - pad.r, Y = ch - pad.t - pad.b;
                const yfor = (v: number) => pad.t + (1 - (v - mn) / (mx - mn)) * Y;

                ctx.strokeStyle = light ? "rgba(15,23,42,0.06)" : "rgba(148,163,184,0.10)";
                ctx.fillStyle = light ? "rgba(15,23,42,0.32)" : "rgba(150,159,175,0.55)";
                ctx.lineWidth = 1;
                ctx.font = "10px Inter, sans-serif";
                ctx.textAlign = "left";
                const steps = 4;
                for (let i = 0; i <= steps; i++) {
                    const v = mn + (mx - mn) * i / steps;
                    const y = yfor(v);
                    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(cw - pad.r, y); ctx.stroke();
                    ctx.fillText("$" + v.toFixed(0), cw - pad.r + 8, y + 3);
                }

                const n = cs.length;
                const cwUnit = X / n;
                const bw = Math.max(2, cwUnit * 0.58);
                cs.forEach((k, i) => {
                    const cx = pad.l + i * cwUnit + cwUnit / 2;
                    const up = k.c >= k.o;
                    const col = up ? "#22C55E" : "#EF4444";
                    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(cx, yfor(k.h)); ctx.lineTo(cx, yfor(k.l)); ctx.stroke();
                    const yo = yfor(k.o), yc = yfor(k.c);
                    const top = Math.min(yo, yc);
                    const bh = Math.max(1, Math.abs(yc - yo));
                    ctx.fillRect(cx - bw / 2, top, bw, bh);
                });

                const last = cs[n - 1];
                const ly = yfor(last.c);
                const up = last.c >= last.o;
                const col = up ? "#22C55E" : "#EF4444";
                ctx.strokeStyle = col; ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.moveTo(pad.l, ly); ctx.lineTo(cw - pad.r, ly); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = col; ctx.fillRect(cw - pad.r, ly - 9, pad.r, 18);
                ctx.fillStyle = up ? "#062b1a" : "#2b0808";
                ctx.font = "600 10px Inter, sans-serif";
                ctx.fillText(last.c.toFixed(2), cw - pad.r + 6, ly + 3);

                setPrice(last.c);
                setChange((last.c - base) / base * 100);
            };

            const loop = (now: number) => {
                const last = cs[cs.length - 1];
                last.c += (target - last.c) * 0.08 + (Math.random() - 0.5) * (spread * 0.0311);
                last.h = Math.max(last.h, last.c); last.l = Math.min(last.l, last.c);
                if (now - lastShift > 2200) {
                    lastShift = now;
                    const o = last.c;
                    const d = Math.sin(now / 2200) * (spread * 0.2444) + (Math.random() - 0.5) * (spread * 0.4444) + (anchor - o) * 0.13;
                    const nc = Math.min(anchor + spread, Math.max(anchor - spread, o + d));
                    cs.push({ o, h: Math.max(o, nc) + Math.random() * (spread * 0.0889), l: Math.min(o, nc) - Math.random() * (spread * 0.0889), c: nc });
                    cs.shift();
                    target = Math.min(anchor + spread, Math.max(anchor - spread, nc + (Math.random() - 0.5) * (spread * 0.4)));
                }
                draw();
                raf = requestAnimationFrame(loop);
            };
            raf = requestAnimationFrame(loop);
        };
        start();

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", fit);
            if (syncTimer) clearInterval(syncTimer);
        };
    }, []);

    return (
        <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 14, background: "var(--surface-card)", overflow: "hidden", boxShadow: "var(--shadow-overlay)" }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                <div className="flex items-center gap-2.5">
                    <img src="/sol.webp" width={26} height={26} className="rounded-full" alt="SOL" />
                    <div>
                        <div className="text-sm font-semibold" style={{ color: "var(--text-high-emphasis)" }}>SOL / USDC</div>
                        <div className="text-[0.7rem]" style={{ color: "var(--text-low-emphasis)" }}>Solana</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[1.15rem] font-bold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>{price === null ? "—" : `$${price.toFixed(2)}`}</div>
                    <div className="text-sm font-medium tabular-nums" style={{ color: change === null ? "var(--text-low-emphasis)" : change >= 0 ? "var(--buy)" : "var(--sell)" }}>
                        {change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
                    </div>
                </div>
            </div>
            <div className="relative" style={{ height: 360 }}>
                <div
                    className="absolute top-3 left-3.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: "color-mix(in srgb, var(--surface-elevated) 80%, transparent)", border: "1px solid var(--border-hairline)" }}
                >
                    <span className="w-1.5 h-1.5 rounded-full animate-[lp-pulse_1.6s_ease-in-out_infinite]" style={{ background: "var(--buy)" }} />
                    <span className="text-[0.66rem] font-semibold tracking-wide" style={{ color: "var(--text-med-emphasis)" }}>LIVE</span>
                </div>
                <canvas ref={canvasRef} className="block w-full h-full" />
            </div>
            <div className="flex" style={{ borderTop: "1px solid var(--border-hairline)" }}>
                <div className="flex-1 px-4 py-3" style={{ borderRight: "1px solid var(--border-hairline)" }}>
                    <div className="text-[0.68rem] uppercase tracking-wide" style={{ color: "var(--text-low-emphasis)" }}>24H High</div>
                    <div className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>{dayHigh === null ? "—" : dayHigh.toFixed(2)}</div>
                </div>
                <div className="flex-1 px-4 py-3" style={{ borderRight: "1px solid var(--border-hairline)" }}>
                    <div className="text-[0.68rem] uppercase tracking-wide" style={{ color: "var(--text-low-emphasis)" }}>24H Low</div>
                    <div className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>{dayLow === null ? "—" : dayLow.toFixed(2)}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                    <div className="text-[0.68rem] uppercase tracking-wide" style={{ color: "var(--text-low-emphasis)" }}>24H Volume</div>
                    <div className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>{dayVolume === null ? "—" : dayVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
            </div>
        </div>
    );
};
