import { MarketTable } from "../components/market/MarketTable";

export default function Page() {
    return (
        <div className="h-screen" style={{ background: "var(--bg-base)" }}>
            <div className="flex flex-row flex-1">
                <div className="flex justify-center flex-row flex-1">
                    <div className="flex flex-col flex-1 max-w-[1280px]">
                        <div className="flex flex-col pb-8">
                            <div className="flex items-center flex-row my-4">
                                <p className="text-[28px] font-semibold" style={{ color: "var(--text-high-emphasis)" }}>Markets</p>
                            </div>
                            <div className="flex flex-col w-full rounded-lg py-3" style={{ background: "var(--surface-card)", border: "1px solid var(--border-hairline)" }}>
                                <MarketTable/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}