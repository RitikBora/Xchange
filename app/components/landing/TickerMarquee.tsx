"use client";

import { getMarketData, getTickers } from "@/app/utils/httpClient";
import { useEffect, useState } from "react";

type TickerCoin = {
    symbol: string;
    image: string;
    price: string;
    chg: number;
};

export const TickerMarquee = () => {
    const [coins, setCoins] = useState<TickerCoin[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [marketdata, tickers] = await Promise.all([getMarketData(), getTickers()]);
                const marketDataMap = new Map(marketdata.map(m => [m.symbol.toLowerCase(), m]));

                const merged: TickerCoin[] = tickers
                    .filter(ticker => !ticker.symbol.endsWith("_PERP"))
                    .reduce<TickerCoin[]>((acc, ticker) => {
                        const symbol = ticker.symbol.split("_")[0].toLowerCase();
                        const marketData = marketDataMap.get(symbol);
                        if (marketData) {
                            acc.push({
                                symbol: marketData.symbol.toUpperCase(),
                                image: marketData.image,
                                price: Number(ticker.lastPrice).toLocaleString(undefined, { maximumFractionDigits: 4 }),
                                chg: Number(ticker.priceChangePercent) * 100,
                            });
                        }
                        return acc;
                    }, []);

                merged.sort((a, b) => Math.abs(b.chg) - Math.abs(a.chg));
                setCoins(merged.slice(0, 12));
            } catch (error) {
                console.error("Failed to fetch ticker data:", error);
            }
        };
        fetchData();
    }, []);

    if (coins.length === 0) return null;

    const row = (keySuffix: string) => (
        <div className="flex" aria-hidden={keySuffix === "b" ? true : undefined}>
            {coins.map((c, i) => (
                <div
                    key={`${keySuffix}-${i}`}
                    className="flex items-center gap-2.5 px-5 whitespace-nowrap"
                    style={{ borderRight: "1px solid var(--border-hairline)" }}
                >
                    <img src={c.image} width={20} height={20} className="rounded-full object-cover" alt={c.symbol} />
                    <span className="text-sm font-semibold" style={{ color: "var(--text-high-emphasis)" }}>{c.symbol}</span>
                    <span className="text-sm tabular-nums" style={{ color: "var(--text-med-emphasis)", fontFamily: "var(--font-mono)" }}>{c.price}</span>
                    <span
                        className="text-[0.78rem] font-medium tabular-nums"
                        style={{ color: c.chg >= 0 ? "var(--buy)" : "var(--sell)" }}
                    >
                        {c.chg >= 0 ? "+" : ""}{c.chg.toFixed(2)}%
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div
            className="overflow-hidden h-11 flex items-center relative"
            style={{ borderBottom: "1px solid var(--border-hairline)", background: "var(--surface-card)" }}
        >
            <div
                className="absolute left-0 top-0 bottom-0 w-6 z-10"
                style={{ background: "linear-gradient(to right, var(--surface-card), transparent)" }}
            />
            <div
                className="absolute right-0 top-0 bottom-0 w-6 z-10"
                style={{ background: "linear-gradient(to left, var(--surface-card), transparent)" }}
            />
            <div className="flex w-max animate-[marquee_46s_linear_infinite]">
                {row("a")}
                {row("b")}
            </div>
        </div>
    );
};
