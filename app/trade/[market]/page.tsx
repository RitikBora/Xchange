"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { useParams } from "next/navigation";


export default function Page() {
    const { market } = useParams();

    return <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1">
            <MarketBar market={market as string} />
            <div className="flex flex-row h-[920px]" style={{ borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
                <div className="flex flex-col flex-1">
                    <TradeView market={market as string} />
                </div>
                <div className="flex flex-col w-[250px] overflow-hidden">
                    <Depth market={market as string}/>
                </div>
            </div>
        </div>
        <div className="w-[10px] flex-col" style={{ borderLeft: "1px solid var(--border-hairline)" }}></div>
        <div>
            <div className="flex flex-col w-[250px]">
                <SwapUI market={market as string} />
            </div>
        </div>
    </div>
}