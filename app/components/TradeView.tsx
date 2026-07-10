"use client";
import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";
import { useTheme } from "./theme-provider";

const INTERVALS: { label: string; value: string; lookbackMs: number }[] = [
  { label: "1m", value: "1m", lookbackMs: 1000 * 60 * 60 * 12 },
  { label: "3m", value: "3m", lookbackMs: 1000 * 60 * 60 * 24 },
  { label: "15m", value: "15m", lookbackMs: 1000 * 60 * 60 * 24 * 3 },
  { label: "1H", value: "1h", lookbackMs: 1000 * 60 * 60 * 24 * 7 },
  { label: "4H", value: "4h", lookbackMs: 1000 * 60 * 60 * 24 * 30 },
  { label: "1D", value: "1d", lookbackMs: 1000 * 60 * 60 * 24 * 180 },
];

export function TradeView({
  market,
}: {
  market: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const [selectedInterval, setSelectedInterval] = useState("1h");

  useEffect(() => {
    const init = async () => {
      const cfg = INTERVALS.find((i) => i.value === selectedInterval) ?? INTERVALS[3];
      let klineData: KLine[] = [];
      try {
        klineData = await getKlines(market, selectedInterval, Math.floor((new Date().getTime() - cfg.lookbackMs) / 1000), Math.floor(new Date().getTime() / 1000));
      } catch (e) { }

      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        const isDark = themeRef.current === "dark";
        const chartManager = new ChartManager(
          chartRef.current,
          [
            ...klineData?.map((x) => ({
              close: parseFloat(x.close),
              high: parseFloat(x.high),
              low: parseFloat(x.low),
              open: parseFloat(x.open),
              timestamp: new Date(x.end),
            })),
          ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
          {
            background: isDark ? "#0e0f14" : "#ffffff",
            color: isDark ? "white" : "#0f172a",
          }
        );
        //@ts-ignore
        chartManagerRef.current = chartManager;
      }
    };
    init();
  }, [market, chartRef, selectedInterval]);

  useEffect(() => {
    const isDark = theme === "dark";
    chartManagerRef.current?.applyTheme({
      background: isDark ? "#0e0f14" : "#ffffff",
      color: isDark ? "white" : "#0f172a",
    });
  }, [theme]);

  return (
    <>
      <div className="flex items-center gap-1 px-3 pt-2.5">
        {INTERVALS.map((i) => (
          <button
            key={i.value}
            onClick={() => setSelectedInterval(i.value)}
            className="text-xs font-medium rounded-md px-2.5 py-1 transition"
            style={{
              color: selectedInterval === i.value ? "var(--text-high-emphasis)" : "var(--text-med-emphasis)",
              background: selectedInterval === i.value ? "var(--surface-elevated)" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (selectedInterval !== i.value) e.currentTarget.style.background = "var(--surface-hover)";
            }}
            onMouseLeave={(e) => {
              if (selectedInterval !== i.value) e.currentTarget.style.background = "transparent";
            }}
          >
            {i.label}
          </button>
        ))}
      </div>
      <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
    </>
  );
}
