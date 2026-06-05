import { config } from "../config";
import es from "./es.json";
import en from "./en.json";

const dictionaries: Record<string, Record<string, string>> = { es, en };

function getDict(): Record<string, string> {
  return dictionaries[config.defaultLocale] || dictionaries.es;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = getDict();
  let value = dict[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "Z").toLocaleString(config.defaultLocale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
