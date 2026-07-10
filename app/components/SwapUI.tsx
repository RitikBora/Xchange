"use client";
import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { SignalingManager } from "../utils/SignalingManager";
import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function SwapUI({ market }: {market: string}) {
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState('buy');
    const [type, setType] = useState('limit');
    const [lastPrice , setLastPrice] = useState(0);

    const showAlert = () =>
    {
        toast.warn('Application for Trade license pending! Inconvenience regretted.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
    }

    useEffect(() =>
    {
        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>)  =>  {
            // @ts-ignore
            setLastPrice(data.lastPrice);
        } , market);
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]}	);

        return(() =>
        {
            SignalingManager.getInstance().deRegisterCallback("ticker", market);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]}	);
        
        })
    } , []);
    return <div>
        <div className="flex flex-col">
            <div className="flex flex-row h-[60px]">
                <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
                <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex flex-col gap-1">
                <div className="px-3">
                    <div className="flex flex-row flex-0 gap-5">
                        <LimitButton type={type} setType={setType} />
                        <MarketButton type={type} setType={setType} />
                    </div>
                </div>
                <div className="flex flex-col px-3">
                    <div className="flex flex-col flex-1 gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between flex-row">
                                <p className="text-xs font-normal" style={{ color: "var(--text-med-emphasis)" }}>Available Balance</p>
                                <p className="font-medium text-xs" style={{ color: "var(--text-high-emphasis)" }}>36.94 USDC</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-normal" style={{ color: "var(--text-med-emphasis)" }}>
                                Price
                            </p>
                            <div className="flex flex-col relative">
                                <input
                                    step="0.01"
                                    placeholder="0"
                                    className="h-12 rounded-lg border-2 border-solid pr-12 text-right text-2xl leading-9 ring-0 transition focus:ring-0"
                                    style={{ borderColor: "var(--border-hairline)", background: "var(--surface-card)", color: "var(--text-high-emphasis)" }}
                                    type="text"
                                    value={lastPrice}
                                    readOnly
                                />
                                <div className="flex flex-row absolute right-1 top-1 p-2">
                                    <div className="relative">
                                        <img src="/usdc.webp" className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2" onClick={showAlert}>
                        <p className="text-xs font-normal" style={{ color: "var(--text-med-emphasis)" }}>
                            Quantity
                        </p>
                        <div className="flex flex-col relative">
                            <input
                                step="0.01"
                                placeholder="0"
                                className="h-12 rounded-lg border-2 border-solid pr-12 text-right text-2xl leading-9 ring-0 transition focus:ring-0"
                                style={{ borderColor: "var(--border-hairline)", background: "var(--surface-card)", color: "var(--text-high-emphasis)" }}
                                type="text"
                                value="123"
                                readOnly
                            />
                            <div className="flex flex-row absolute right-1 top-1 p-2">
                                <div className="relative">
                                    <img src="/sol.webp" className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end flex-row">
                            <p className="font-medium pr-2 text-xs" style={{ color: "var(--text-med-emphasis)" }}>≈ 0.00 USDC</p>
                        </div>
                        <div className="flex justify-between flex-row mt-2 gap-1.5">
                            {["25%", "50%", "75%", "Max"].map((label) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-center flex-row rounded-full flex-1 px-[6px] py-[6px] text-xs cursor-pointer transition"
                                    style={{ background: "var(--surface-elevated)", color: "var(--text-high-emphasis)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-elevated)")}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                    {activeTab === 'buy' ? (
                        <button
                            type="button"
                            className="font-semibold focus:none focus:outline-none text-center h-12 rounded-xl text-base px-4 py-2 my-4 active:scale-98"
                            style={{ background: "var(--buy-solid)", color: "var(--buy-solid-text)" }}
                            onClick={showAlert}
                        >Buy</button>
                    ) : (
                        <button
                            type="button"
                            className="font-semibold focus:none focus:outline-none text-center h-12 rounded-xl text-base px-4 py-2 my-4 active:scale-98"
                            style={{ background: "var(--sell-solid)", color: "var(--sell-solid-text)" }}
                            onClick={showAlert}
                        >Sell</button>
                    )}


                    <div className="flex justify-between flex-row mt-1">
                        <div className="flex flex-row gap-2">
                            <div className="flex items-center">
                                <input className="cursor-pointer h-5 w-5" id="postOnly" type="checkbox" style={{ accentColor: "var(--accent)" }} />
                                <label className="ml-2 text-xs" style={{ color: "var(--text-high-emphasis)" }}>Post Only</label>
                            </div>
                            <div className="flex items-center">
                                <input className="cursor-pointer h-5 w-5" id="ioc" type="checkbox" style={{ accentColor: "var(--accent)" }} />
                                <label className="ml-2 text-xs" style={{ color: "var(--text-high-emphasis)" }}>IOC</label>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
    <ToastContainer
        />
</div>
}

function LimitButton({ type, setType }: { type: string, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('limit')}>
    <div
        className="text-sm font-medium py-1"
        style={{
            borderBottom: `2px solid ${type === 'limit' ? "var(--accent-active)" : "transparent"}`,
            color: type === 'limit' ? "var(--text-high-emphasis)" : "var(--text-med-emphasis)",
        }}
    >
        Limit
    </div>
</div>
}

function MarketButton({ type, setType }: { type: string, setType: any }) {
    return  <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('market')}>
    <div
        className="text-sm font-medium py-1"
        style={{
            borderBottom: `2px solid ${type === 'market' ? "var(--accent-active)" : "transparent"}`,
            color: type === 'market' ? "var(--text-high-emphasis)" : "var(--text-med-emphasis)",
        }}
    >
        Market
    </div>
    </div>
}

function BuyButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return <div
        className="flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4"
        style={{
            borderColor: activeTab === 'buy' ? "var(--buy-border)" : "var(--border-med)",
            background: activeTab === 'buy' ? "var(--buy-surface)" : "transparent",
        }}
        onClick={() => setActiveTab('buy')}
    >
        <p className="text-center text-sm font-semibold" style={{ color: "var(--buy)" }}>
            Buy
        </p>
    </div>
}

function SellButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return <div
        className="flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4"
        style={{
            borderColor: activeTab === 'sell' ? "var(--sell-border)" : "var(--border-med)",
            background: activeTab === 'sell' ? "var(--sell-surface)" : "transparent",
        }}
        onClick={() => setActiveTab('sell')}
    >
        <p className="text-center text-sm font-semibold" style={{ color: "var(--sell)" }}>
            Sell
        </p>
    </div>
}