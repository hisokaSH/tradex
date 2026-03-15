"use client";

import { useEffect, useRef, memo } from "react";

interface Props {
  symbol?: string;
  interval?: string;
  height?: number;
}

function TradingViewWidget({ symbol = "BINANCE:BTCUSDT", interval = "60", height = 480 }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const scriptAdded = useRef(false);

  useEffect(() => {
    if (!container.current || scriptAdded.current) return;
    scriptAdded.current = true;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#0D1117",
      gridColor: "rgba(255,255,255,0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);
  }, [symbol, interval]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height, width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);
