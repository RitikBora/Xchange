import { Trade } from "../utils/types";

export const Trades = ({trades} : { trades : Trade[]}) =>
{
    
    
    return (
        <div>
            <div className="flex flex-row w-full flex-1 pb-1" style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                <p className="w-[33.3%] px-1 text-left text-xs font-semibold" style={{ color: "var(--text-med-emphasis)" }}>Price (USDC)</p>
                <p className="w-[33.3%] px-1 text-right text-xs font-semibold" style={{ color: "var(--text-med-emphasis)" }}>Qty (SOL)</p>
            </div>
        <div className="flex flex-col">
            {trades.map((trade : Trade) => {
                return <TradeRow isBuyerMaker={trade.isBuyerMaker} price={trade.price} quantity={trade.quantity}
                timestamp = {trade.timestamp}/>
            })}
        </div>
        </div>
    )
}

function TradeRow({isBuyerMaker , price , quantity , timestamp} : {isBuyerMaker: Boolean , price : string , quantity: string , timestamp : number}) {
    return(
            <div className="flex flex-row w-full cursor-default bg-transparent hover:opacity-80">
                <div className="flex items-center flex-row py-2 w-[33.3%] !py-1">
                    <div className="w-full text-sm font-normal capitalize tabular-nums px-1 text-left" style={{ color: isBuyerMaker === false ? "var(--buy)" : "var(--sell)" }}>
                        {price}
                    </div>
                </div>
                <div className="flex items-center flex-row py-2 w-[33.3%] !py-1">
                    <div className="w-full text-sm font-normal capitalize tabular-nums text-right" style={{ color: "var(--text-high-emphasis)" }}>
                        {quantity}
                    </div>
                </div>
                <div className="flex items-center flex-row py-2 w-[33.3%] !py-1">
                    <div className="w-full text-sm font-normal capitalize tabular-nums text-right" style={{ color: "var(--text-med-emphasis)" }}>
                        {convertTimestampToTime(timestamp)}
                    </div>
                </div>
        </div>
    )
}

function convertTimestampToTime(timestamp : number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

