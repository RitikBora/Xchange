"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { useParams } from "next/navigation";


export default function Page() {
    const { market } = useParams();

    return <div className="flex flex-row flex-1" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col flex-1">
            <MarketBar market={market as string} />
            <div className="flex flex-row flex-1" style={{ borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
                <div className="flex flex-col flex-1" style={{ background: "var(--surface-card)", margin: "12px", borderRadius: "14px", border: "1px solid var(--border-hairline)", overflow: "hidden" }}>
                    <TradeView market={market as string} />
                </div>
                <div className="flex flex-col" style={{ width: "250px", overflow: "hidden", background: "var(--surface-card)", margin: "12px", marginLeft: "0", borderRadius: "14px", border: "1px solid var(--border-hairline)" }}>
                    <Depth market={market as string}/>
                </div>
            </div>
        </div>
        <div style={{ width: "1px", borderLeft: "1px solid var(--border-hairline)" }}></div>
        <div style={{ background: "var(--surface-card)", margin: "12px", width: "250px", borderRadius: "14px", border: "1px solid var(--border-hairline)", overflow: "hidden" }}>
            <SwapUI market={market as string} />
        </div>
    </div>
}