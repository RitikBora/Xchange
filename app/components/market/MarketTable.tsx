"use client";
import {  getAllKlines, getMarketData, getTickers } from "@/app/utils/httpClient";
import {  Market, MarketData, Ticker } from "@/app/utils/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export const MarketTable= () =>
{
    const marketDataMap = new Map(); 
    const [market , setMarket] = useState<Market[]>([]);
    const[loading , setLoading] = useState(true);
    const router = useRouter();
   

     useEffect(() => {
        const fetchData = async () => {
            try {
                
                const [marketdata, tickers] = await Promise.all([getMarketData(), getTickers() ]);

                

                marketdata.forEach(m => marketDataMap.set(m.symbol.toLowerCase(), m));

                const updatedMarkets: Market[] = tickers.filter(ticker => !ticker.symbol.endsWith("_PERP")).reduce<Market[]>((acc, ticker) => {
                    const symbol = ticker.symbol.split("_")[0].toLowerCase();
                    const marketData = marketDataMap.get(symbol);

                    if (marketData) {
                        const { name, symbol, image, market_cap } = marketData;
                        const { lastPrice: last_price, priceChangePercent, volume, quoteVolume } = ticker;

                        acc.push({ 
                            name, 
                            symbol, 
                            image, 
                            market_cap, 
                            lastPrice: last_price, 
                            priceChangePercent, 
                            marketSymbol : ticker.symbol, 
                            quoteVolume 
                        });
                    }
                    return acc;
                }, []);

                
                updatedMarkets.sort((a, b) => b.market_cap - a.market_cap);
                
                setMarket(updatedMarkets);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);
 

    return (
        <table className="w-full border-separate border-spacing-y-4">
            <thead>
                <tr>
                <th className="px-2 py-3 w-1/3 text-left text-5xl font-normal" style={{ color: "var(--text-med-emphasis)" }}>
                    <div className="flex items-center gap-1 select-none">
                        Name
                        <span className="w-[16px]"></span>
                    </div>
                </th>
                 <th className="px-2 py-3 w-1/6 text-left text-xl font-normal" style={{ color: "var(--text-med-emphasis)" }}>
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            Price
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                    <th className="px-2 py-3 w-1/6 text-left text-xl font-normal" style={{ color: "var(--text-med-emphasis)" }}>
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            Market Cap
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down h-4 w-4">
                                <path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>
                            </svg>
                        </div>
                    </th>
                    <th className="px-2 py-3 w-1/6 text-left text-xl font-normal" style={{ color: "var(--text-med-emphasis)" }}>
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            24h Volume
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                    <th className="px-2 py-3 w-1/6 text-left text-xl font-normal" style={{ color: "var(--text-med-emphasis)" }}>
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            24h Change
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                </tr>
            </thead>
             <tbody >
               {
                loading ? <>
                     {Array.from({ length: 8}).map((_, index) => (
                    <SkeletonRow key={index}/>
                    ))}
                </>:
                <>
                    {market.map((coin : Market) =>
                    {
                        return <MarketRow key={coin.marketSymbol} price={coin.lastPrice} symbol={coin.symbol}  name = {coin.name}  market_cap ={coin.market_cap}  quoteVolume= {coin.quoteVolume} image = {coin.image} priceChangePercent = {coin.priceChangePercent} marketSymbol = {coin.marketSymbol} router = {router}/>
                    })}
                </>
               }
            </tbody>
        </table>
    )
}

function MarketRow({price , symbol , name , market_cap , image , priceChangePercent , quoteVolume , marketSymbol , router} : {price : string , symbol : string , name : string  , market_cap : number  , image : string , priceChangePercent : string , quoteVolume: string , marketSymbol : string , router : any}) {
    return (
        <tr
            className="cursor-pointer transition"
            style={{ borderTop: "1px solid var(--border-hairline)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => router.push(`/trade/${marketSymbol}`) }
        >
                        <td className="px-2 py-3 ">
                            <div className="flex shrink">
                                <div className="flex items-center">
                                    <div className="relative flex-none overflow-hidden rounded-full w-10 h-10" style={{ border: "1px solid var(--border-med)" }}>
                                        <div className="relative">
                                            <img alt={`${name} Logo`} loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className=""  src={image} />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex flex-col">
                                        <p className="whitespace-nowrap text-base font-medium" style={{ color: "var(--text-high-emphasis)" }}>{name}</p>
                                    <div className="flex items-center justify-start flex-row gap-2">
                                        <p className="flex-medium text-left text-xs leading-5" style={{ color: "var(--text-med-emphasis)" }}>{symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-2 py-3 ">
                        <p className="text-base font-medium tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>${price}</p>
                    </td>
                    <td className="px-2 py-3 ">
                        <p className="text-base font-medium tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>{formatMarketCap(market_cap)}</p>
                    </td>
                    <td className="px-2 py-3 ">
                        <p className="text-base font-medium tabular-nums" style={{ color: "var(--text-high-emphasis)" }}>{formatMarketCap(Number(quoteVolume))}</p>
                    </td>
                    <td className="px-2 py-3 ">
                        <PricePercent priceChangePercent={priceChangePercent}/>
                    </td>

                </tr>
    )
}


function SkeletonRow() {
    return (
        <tr>
            <td className="px-2 py-3">
                <div className="flex items-center">
                    <Skeleton className="rounded-full animate-pulse w-10 h-10 shrink-0" style={{ background: "var(--surface-elevated)" }} />
                    <div className="ml-4 flex flex-col gap-2">
                        <Skeleton className="rounded-md animate-pulse w-24 h-4" style={{ background: "var(--surface-elevated)" }} />
                        <Skeleton className="rounded-md animate-pulse w-12 h-3" style={{ background: "var(--surface-elevated)" }} />
                    </div>
                </div>
            </td>
            <td className="px-2 py-3">
                <Skeleton className="rounded-md animate-pulse w-16 h-4" style={{ background: "var(--surface-elevated)" }} />
            </td>
            <td className="px-2 py-3">
                <Skeleton className="rounded-md animate-pulse w-16 h-4" style={{ background: "var(--surface-elevated)" }} />
            </td>
            <td className="px-2 py-3">
                <Skeleton className="rounded-md animate-pulse w-16 h-4" style={{ background: "var(--surface-elevated)" }} />
            </td>
            <td className="px-2 py-3">
                <Skeleton className="rounded-md animate-pulse w-14 h-4" style={{ background: "var(--surface-elevated)" }} />
            </td>
        </tr>
    );
}




function formatMarketCap(num : number) {



  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(1)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(1)}K`;
  } else {
    return `$${num}`;
  }
}


function PricePercent({priceChangePercent} : {priceChangePercent : string})
{
    let number = parseFloat(priceChangePercent); // Convert string to number
    let percent = (number * 100).toFixed(2) + '%';

    return number < 0 ?  <p className="text-base font-medium tabular-nums" style={{ color: "var(--sell)" }}>{percent}</p> :
        <p className="text-base font-medium tabular-nums" style={{ color: "var(--buy)" }}>+{percent}</p>
}

