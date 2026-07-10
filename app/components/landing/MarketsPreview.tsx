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
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [marketdata, tickers] = await Promise.all([getMarketData(), getTickers()]);
                const marketDataMap = new Map(marketdata.map(m => [m.symbol.toLowerCase(), m]));

                const updatedMarkets: Market[] = tickers.reduce<Market[]>((acc, ticker) => {
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
        <div className="border border-slate-800 rounded-xl bg-[#1A2438] overflow-hidden">
            <div className="grid grid-cols-[2.4fr_1.2fr_1.2fr_1fr] px-6 py-3.5 border-b border-slate-800 text-[0.7rem] uppercase tracking-wide text-slate-500">
                <div>Name</div>
                <div className="text-right">Price</div>
                <div className="text-right">Market Cap</div>
                <div className="text-right">24H</div>
            </div>
            {markets.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="px-6 py-4 border-b border-slate-800 last:border-b-0">
                        <div className="h-5 rounded bg-slate-800 animate-pulse w-2/3" />
                    </div>
                ))
                : markets.map((c) => (
                    <div
                        key={c.marketSymbol}
                        onClick={() => router.push(`/trade/${c.marketSymbol}`)}
                        className="grid grid-cols-[2.4fr_1.2fr_1.2fr_1fr] items-center px-6 py-3.5 border-b border-slate-800 last:border-b-0 cursor-pointer hover:bg-[#243049] transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <img src={c.image} width={30} height={30} className="rounded-full object-cover" alt={c.name} />
                            <div>
                                <div className="text-sm font-semibold text-baseTextHighEmphasis">{c.name}</div>
                                <div className="text-xs text-slate-500">{c.symbol.toUpperCase()}</div>
                            </div>
                        </div>
                        <div className="text-right text-sm font-medium tabular-nums text-baseTextHighEmphasis">${c.lastPrice}</div>
                        <div className="text-right text-sm tabular-nums text-baseTextMedEmphasis">{formatMarketCap(c.market_cap)}</div>
                        <div className={`text-right text-sm font-medium tabular-nums ${Number(c.priceChangePercent) < 0 ? "text-red-500" : "text-green-500"}`}>
                            {Number(c.priceChangePercent) < 0 ? "" : "+"}{(Number(c.priceChangePercent) * 100).toFixed(2)}%
                        </div>
                    </div>
                ))}
        </div>
    );
};
