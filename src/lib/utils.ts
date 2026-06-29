import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencyConfig() {
  const pref = localStorage.getItem("currency_preference") || "USD";
  switch (pref) {
    case "EUR":
      return { symbol: "€", code: "EUR", rate: 0.92, label: "Euro (€)" };
    case "PKR":
      return { symbol: "Rs. ", code: "PKR", rate: 278, label: "Pakistani Rupee (PKR)" };
    case "USD":
    default:
      return { symbol: "$", code: "USD", rate: 1.0, label: "US Dollar ($)" };
  }
}

export function useCurrency() {
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency_preference") || "USD");

  useEffect(() => {
    const handleStorage = () => {
      setCurrency(localStorage.getItem("currency_preference") || "USD");
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("currency_change", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("currency_change", handleStorage);
    };
  }, []);

  const config = getCurrencyConfig();

  const convertAndFormat = (amountOrStr: number | string) => {
    if (typeof amountOrStr === "string" && amountOrStr === "—") {
      return "—";
    }
    let numeric = 0;
    if (typeof amountOrStr === "string") {
      numeric = parseFloat(amountOrStr.replace(/[$,\s]/g, "")) || 0;
    } else {
      numeric = amountOrStr;
    }
    const converted = numeric * config.rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  const convertValue = (amountOrStr: number | string) => {
    let numeric = 0;
    if (typeof amountOrStr === "string") {
      numeric = parseFloat(amountOrStr.replace(/[$,\s]/g, "")) || 0;
    } else {
      numeric = amountOrStr;
    }
    return Math.round(numeric * config.rate);
  };

  return {
    currency,
    symbol: config.symbol,
    rate: config.rate,
    format: convertAndFormat,
    convertValue,
    label: config.label,
  };
}

export function formatCurrency(value: number) {
  const { code, rate } = getCurrencyConfig();
  const converted = value * rate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
  }).format(converted);
}

