"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/components/theme-provider";

type Candle = { o: number; h: number; l: number; c: number };

export const LiveChartPreview = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [price, setPrice] = useState(177.68);
    const [change, setChange] = useState(3.8);
    const { theme } = useTheme();
    const themeRef = useRef(theme);
    themeRef.current = theme;

    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;

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

        const N = 46;
        let p = 174;
        const cs: Candle[] = [];
        for (let i = 0; i < N; i++) {
            const o = p;
            const d = Math.sin(i / 6) * 1.9 + (Math.random() - 0.5) * 2.2 + (177 - o) * 0.07;
            const c = Math.min(182, Math.max(173, o + d));
            const hi = Math.max(o, c) + Math.random() * 1.4;
            const lo = Math.min(o, c) - Math.random() * 1.4;
            cs.push({ o, h: hi, l: lo, c });
            p = c;
        }
        const base = cs[0].c;
        let target = cs[cs.length - 1].c;
        let lastShift = performance.now();

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

        let raf = 0;
        const loop = (now: number) => {
            const last = cs[cs.length - 1];
            last.c += (target - last.c) * 0.08 + (Math.random() - 0.5) * 0.14;
            last.h = Math.max(last.h, last.c); last.l = Math.min(last.l, last.c);
            if (now - lastShift > 1150) {
                lastShift = now;
                const o = last.c;
                const d = Math.sin(now / 2200) * 1.1 + (Math.random() - 0.5) * 2.0 + (177 - o) * 0.13;
                const nc = Math.min(182, Math.max(173, o + d));
                cs.push({ o, h: Math.max(o, nc) + Math.random() * 0.4, l: Math.min(o, nc) - Math.random() * 0.4, c: nc });
                cs.shift();
                target = Math.min(182, Math.max(173, nc + (Math.random() - 0.5) * 1.8));
            }
            draw();
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", fit);
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
                    <div className="text-[1.15rem] font-bold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>${price.toFixed(2)}</div>
                    <div className="text-sm font-medium tabular-nums" style={{ color: change >= 0 ? "var(--buy)" : "var(--sell)" }}>
                        {change >= 0 ? "+" : ""}{change.toFixed(2)}%
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
                    <div className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>178.28</div>
                </div>
                <div className="flex-1 px-4 py-3" style={{ borderRight: "1px solid var(--border-hairline)" }}>
                    <div className="text-[0.68rem] uppercase tracking-wide" style={{ color: "var(--text-low-emphasis)" }}>24H Low</div>
                    <div className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>172.97</div>
                </div>
                <div className="flex-1 px-4 py-3">
                    <div className="text-[0.68rem] uppercase tracking-wide" style={{ color: "var(--text-low-emphasis)" }}>24H Volume</div>
                    <div className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>9,931</div>
                </div>
            </div>
        </div>
    );
};
