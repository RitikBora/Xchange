"use client";
import { useEffect, useState } from "react";
// @ts-ignore
import { Ticker } from "../utils/types";
import { getTicker } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";

export const MarketBar = ({market}: {market: string}) => {
    const [ticker, setTicker] = useState<Ticker | null>(null);

    useEffect(() => {
        getTicker(market).then(setTicker);
        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>)  =>  setTicker(prevTicker => ({
            firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
            high: data?.high ?? prevTicker?.high ?? '',
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
            low: data?.low ?? prevTicker?.low ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
            priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
            quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
            symbol: data?.symbol ?? prevTicker?.symbol ?? '',
            trades: data?.trades ?? prevTicker?.trades ?? '',
            volume: data?.volume ?? prevTicker?.volume ?? '',
        })), market);
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]}	);

        return () => {
            SignalingManager.getInstance().deRegisterCallback("ticker", market);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]}	);
        }
    }, [market])
    // 

    return <div>
        <div className="flex items-center flex-row relative w-full overflow-hidden" style={{ borderBottom: "1px solid var(--border-hairline)" }}>
            <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
                    <Ticker market={market} />
                    <div className="flex items-center flex-row space-x-8 pl-4">
                        <div className="flex flex-col">
                            <p className="font-medium text-xs text-sm" style={{ color: "var(--text-low-emphasis)" }}>Price</p>
                            <p className="text-sm font-medium tabular-nums leading-5 text-sm" style={{ color: "var(--text-high-emphasis)" }}>${ticker?.lastPrice}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-medium text-xs text-sm" style={{ color: "var(--text-low-emphasis)" }}>24H Change</p>
                            <p className="text-sm font-medium tabular-nums leading-5 text-sm" style={{ color: Number(ticker?.priceChange) > 0 ? "var(--buy)" : "var(--sell)" }}>{Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} ({(Number(ticker?.priceChangePercent) * 100).toFixed(2)}%)</p></div><div className="flex flex-col">
                                <p className="font-medium text-xs text-sm" style={{ color: "var(--text-low-emphasis)" }}>24H High</p>
                                <p className="text-sm font-medium tabular-nums leading-5 text-sm" style={{ color: "var(--text-high-emphasis)" }}>{ticker?.high}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-medium text-xs text-sm" style={{ color: "var(--text-low-emphasis)" }}>24H Low</p>
                                    <p className="text-sm font-medium tabular-nums leading-5 text-sm" style={{ color: "var(--text-high-emphasis)" }}>{ticker?.low}</p>
                                </div>
                            <button type="button" className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left" data-rac="">
                                <div className="flex flex-col">
                                    <p className="font-medium text-xs text-sm" style={{ color: "var(--text-low-emphasis)" }}>24H Volume</p>
                                    <p className="mt-1 text-sm font-medium tabular-nums leading-5 text-sm" style={{ color: "var(--text-high-emphasis)" }}>{ticker?.volume}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

}

function Ticker({market}: {market: string}) {
    return <div className="flex h-[60px] shrink-0 space-x-4">
        <div className="flex flex-row relative ml-2 -mr-4">
            <img alt="SOL Logo" loading="lazy" decoding="async" data-nimg="1" className="z-10 rounded-full h-6 w-6 mt-4" src="/sol.webp" />
            <img alt="USDC Logo" loading="lazy"decoding="async" data-nimg="1" className="h-6 w-6 -ml-2 mt-4 rounded-full" src="/usdc.webp" />
        </div>
    <button type="button" className="react-aria-Button">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
            <div className="flex items-center flex-row gap-2" style={{ color: "var(--text-high-emphasis)" }}>
                <div className="flex flex-row relative">
                    <p className="font-medium text-sm">{market.replace("_", " / ")}</p>
                </div>
            </div>
        </div>
    </button>
    </div>
}