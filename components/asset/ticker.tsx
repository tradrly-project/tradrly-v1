"use client";
import { useEffect } from "react";

const defaultPairs = [
  { symbol: "BTCUSD", proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
  { symbol: "XAUUSD", proName: "OANDA:XAUUSD", title: "Gold" },
  { symbol: "EURUSD", proName: "FX_IDC:EURUSD", title: "EUR/USD" },
  { symbol: "GBPUSD", proName: "FX_IDC:GBPUSD", title: "GBP/USD" },
  { symbol: "USDJPY", proName: "FX_IDC:USDJPY", title: "USD/JPY" },
  { symbol: "USDCAD", proName: "FX_IDC:USDCAD", title: "USD/CAD" },
  { symbol: "AUDUSD", proName: "FX_IDC:AUDUSD", title: "AUD/USD" },
  { symbol: "US30", proName: "FOREXCOM:DJI", title: "Dow Jones (US30)" },
  { symbol: "US100", proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100 (US100)" },
];

const TradingViewTicker = () => {
  useEffect(() => {
    const container = document.getElementById("tradingview-widget");
    if (container) container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: defaultPairs.map((pair) => ({
        proName: pair.proName,
        title: pair.title,
      })),
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    container?.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview-widget" />
    </div>
  );
};

export default TradingViewTicker;
