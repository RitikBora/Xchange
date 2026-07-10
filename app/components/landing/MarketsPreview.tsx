"use client";

import { getMarketData, getTickers } from "@/app/utils/httpClient";
import { Market } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function formatMarketCap(num: number) {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
}

export const MarketsPreview = () => {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [hovered, setHovered] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [marketdata, tickers] = await Promise.all([getMarketData(), getTickers()]);
                const marketDataMap = new Map(marketdata.map(m => [m.symbol.toLowerCase(), m]));

                const updatedMarkets: Market[] = tickers
                    .filter(ticker => !ticker.symbol.endsWith("_PERP"))
                    .reduce<Market[]>((acc, ticker) => {
                        const symbol = ticker.symbol.split("_")[0].toLowerCase();
                        const marketData = marketDataMap.get(symbol);
                        if (marketData) {
                            const { name, symbol, image, market_cap } = marketData;
                            const { lastPrice, priceChangePercent, quoteVolume } = ticker;
                            acc.push({ name, symbol, image, market_cap, lastPrice, priceChangePercent, marketSymbol: ticker.symbol, quoteVolume });
                        }
                        return acc;
                    }, []);

                updatedMarkets.sort((a, b) => b.market_cap - a.market_cap);
                setMarkets(updatedMarkets.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch markets preview:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ border: "1px solid var(--border-hairline)", borderRadius: 14, background: "var(--surface-card)", overflow: "hidden" }}>
            <div
                className="grid px-6 py-3.5 text-[0.7rem] uppercase tracking-wide"
                style={{ gridTemplateColumns: "2.4fr 1.2fr 1.2fr 1fr", borderBottom: "1px solid var(--border-hairline)", color: "var(--text-low-emphasis)" }}
            >
                <div>Name</div>
                <div className="text-right">Price</div>
                <div className="text-right">Market Cap</div>
                <div className="text-right">24H</div>
            </div>
            {markets.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                        <div className="rounded-full animate-pulse shrink-0" style={{ width: 30, height: 30, background: "var(--surface-elevated)" }} />
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="h-3.5 rounded animate-pulse" style={{ width: "40%", background: "var(--surface-elevated)" }} />
                            <div className="h-2.5 rounded animate-pulse" style={{ width: "20%", background: "var(--surface-elevated)" }} />
                        </div>
                    </div>
                ))
                : markets.map((c) => (
                    <div
                        key={c.marketSymbol}
                        onClick={() => router.push(`/trade/${c.marketSymbol}`)}
                        onMouseEnter={() => setHovered(c.marketSymbol)}
                        onMouseLeave={() => setHovered(null)}
                        className="grid items-center px-6 py-3.5 cursor-pointer"
                        style={{
                            gridTemplateColumns: "2.4fr 1.2fr 1.2fr 1fr",
                            borderBottom: "1px solid var(--border-hairline)",
                            background: hovered === c.marketSymbol ? "var(--surface-elevated)" : "transparent",
                            transition: "background .15s var(--ease-in-out)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <img src={c.image} width={30} height={30} className="rounded-full object-cover" alt={c.name} />
                            <div>
                                <div className="text-sm font-semibold" style={{ color: "var(--text-high-emphasis)" }}>{c.name}</div>
                                <div className="text-xs" style={{ color: "var(--text-low-emphasis)" }}>{c.symbol.toUpperCase()}</div>
                            </div>
                        </div>
                        <div className="text-right text-sm font-medium tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>${c.lastPrice}</div>
                        <div className="text-right text-sm tabular-nums" style={{ color: "var(--text-med-emphasis)" }}>{formatMarketCap(c.market_cap)}</div>
                        <div className="text-right text-sm font-medium tabular-nums" style={{ color: Number(c.priceChangePercent) < 0 ? "var(--sell)" : "var(--buy)" }}>
                            {Number(c.priceChangePercent) < 0 ? "" : "+"}{(Number(c.priceChangePercent) * 100).toFixed(2)}%
                        </div>
                    </div>
                ))}
        </div>
    );
};
