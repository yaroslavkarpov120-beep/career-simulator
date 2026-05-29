export type CountryCode = "RU" | "KZ" | "UZ" | "BY" | "KG" | "REMOTE";
export type CurrencyCode = "RUB" | "KZT" | "UZS" | "USD" | "BYN";

export type RegionConfig = {
  id: string;
  countryCode: CountryCode;
  cityLabelKey: string;
  currency: CurrencyCode;
  salaryDefaults: { min: number; max: number };
  salaryRange: { min: number; max: number; step: number };
  costMultiplier: number;
};

export const COUNTRIES: { code: CountryCode; labelKey: string; flag: string }[] = [
  { code: "RU", labelKey: "country.RU", flag: "🇷🇺" },
  { code: "KZ", labelKey: "country.KZ", flag: "🇰🇿" },
  { code: "UZ", labelKey: "country.UZ", flag: "🇺🇿" },
  { code: "BY", labelKey: "country.BY", flag: "🇧🇾" },
  { code: "KG", labelKey: "country.KG", flag: "🇰🇬" },
  { code: "REMOTE", labelKey: "country.REMOTE", flag: "🌍" },
];

export const REGIONS: RegionConfig[] = [
  // Russia
  { id: "ru-moscow", countryCode: "RU", cityLabelKey: "city.ru_moscow", currency: "RUB", salaryDefaults: { min: 100000, max: 200000 }, salaryRange: { min: 30000, max: 500000, step: 5000 }, costMultiplier: 1.25 },
  { id: "ru-spb", countryCode: "RU", cityLabelKey: "city.ru_spb", currency: "RUB", salaryDefaults: { min: 90000, max: 180000 }, salaryRange: { min: 30000, max: 450000, step: 5000 }, costMultiplier: 1.15 },
  { id: "ru-kazan", countryCode: "RU", cityLabelKey: "city.ru_kazan", currency: "RUB", salaryDefaults: { min: 60000, max: 120000 }, salaryRange: { min: 25000, max: 300000, step: 5000 }, costMultiplier: 0.85 },
  { id: "ru-novosibirsk", countryCode: "RU", cityLabelKey: "city.ru_novosibirsk", currency: "RUB", salaryDefaults: { min: 65000, max: 130000 }, salaryRange: { min: 25000, max: 320000, step: 5000 }, costMultiplier: 0.9 },
  { id: "ru-ekb", countryCode: "RU", cityLabelKey: "city.ru_ekb", currency: "RUB", salaryDefaults: { min: 70000, max: 140000 }, salaryRange: { min: 25000, max: 350000, step: 5000 }, costMultiplier: 0.95 },
  { id: "ru-regions", countryCode: "RU", cityLabelKey: "city.ru_regions", currency: "RUB", salaryDefaults: { min: 45000, max: 90000 }, salaryRange: { min: 20000, max: 200000, step: 5000 }, costMultiplier: 0.75 },
  { id: "ru-remote", countryCode: "RU", cityLabelKey: "city.ru_remote", currency: "RUB", salaryDefaults: { min: 80000, max: 160000 }, salaryRange: { min: 30000, max: 400000, step: 5000 }, costMultiplier: 1.0 },
  // Kazakhstan
  { id: "kz-almaty", countryCode: "KZ", cityLabelKey: "city.kz_almaty", currency: "KZT", salaryDefaults: { min: 350000, max: 700000 }, salaryRange: { min: 150000, max: 1500000, step: 25000 }, costMultiplier: 1.2 },
  { id: "kz-astana", countryCode: "KZ", cityLabelKey: "city.kz_astana", currency: "KZT", salaryDefaults: { min: 320000, max: 650000 }, salaryRange: { min: 150000, max: 1400000, step: 25000 }, costMultiplier: 1.1 },
  { id: "kz-shymkent", countryCode: "KZ", cityLabelKey: "city.kz_shymkent", currency: "KZT", salaryDefaults: { min: 250000, max: 500000 }, salaryRange: { min: 120000, max: 1000000, step: 20000 }, costMultiplier: 0.85 },
  { id: "kz-remote", countryCode: "KZ", cityLabelKey: "city.kz_remote", currency: "KZT", salaryDefaults: { min: 300000, max: 600000 }, salaryRange: { min: 150000, max: 1200000, step: 25000 }, costMultiplier: 1.0 },
  // Uzbekistan
  { id: "uz-tashkent", countryCode: "UZ", cityLabelKey: "city.uz_tashkent", currency: "UZS", salaryDefaults: { min: 8000000, max: 18000000 }, salaryRange: { min: 3000000, max: 35000000, step: 500000 }, costMultiplier: 1.15 },
  { id: "uz-samarkand", countryCode: "UZ", cityLabelKey: "city.uz_samarkand", currency: "UZS", salaryDefaults: { min: 5000000, max: 12000000 }, salaryRange: { min: 2500000, max: 25000000, step: 500000 }, costMultiplier: 0.9 },
  { id: "uz-remote", countryCode: "UZ", cityLabelKey: "city.uz_remote", currency: "UZS", salaryDefaults: { min: 7000000, max: 15000000 }, salaryRange: { min: 3000000, max: 30000000, step: 500000 }, costMultiplier: 1.0 },
  // Belarus
  { id: "by-minsk", countryCode: "BY", cityLabelKey: "city.by_minsk", currency: "BYN", salaryDefaults: { min: 2500, max: 5000 }, salaryRange: { min: 1000, max: 10000, step: 100 }, costMultiplier: 1.1 },
  { id: "by-regions", countryCode: "BY", cityLabelKey: "city.by_regions", currency: "BYN", salaryDefaults: { min: 1800, max: 3500 }, salaryRange: { min: 800, max: 7000, step: 100 }, costMultiplier: 0.8 },
  { id: "by-remote", countryCode: "BY", cityLabelKey: "city.by_remote", currency: "BYN", salaryDefaults: { min: 2200, max: 4500 }, salaryRange: { min: 1000, max: 9000, step: 100 }, costMultiplier: 1.0 },
  // Kyrgyzstan
  { id: "kg-bishkek", countryCode: "KG", cityLabelKey: "city.kg_bishkek", currency: "USD", salaryDefaults: { min: 800, max: 1800 }, salaryRange: { min: 400, max: 4000, step: 50 }, costMultiplier: 1.0 },
  { id: "kg-regions", countryCode: "KG", cityLabelKey: "city.kg_regions", currency: "USD", salaryDefaults: { min: 500, max: 1200 }, salaryRange: { min: 300, max: 3000, step: 50 }, costMultiplier: 0.75 },
  { id: "kg-remote", countryCode: "KG", cityLabelKey: "city.kg_remote", currency: "USD", salaryDefaults: { min: 700, max: 1500 }, salaryRange: { min: 400, max: 3500, step: 50 }, costMultiplier: 1.0 },
  // Global remote
  { id: "remote-global", countryCode: "REMOTE", cityLabelKey: "city.remote_global", currency: "USD", salaryDefaults: { min: 3000, max: 8000 }, salaryRange: { min: 1000, max: 15000, step: 100 }, costMultiplier: 1.0 },
];

export function getRegion(id: string): RegionConfig | undefined {
  return REGIONS.find((r) => r.id === id);
}

export function getRegionsByCountry(countryCode: CountryCode): RegionConfig[] {
  return REGIONS.filter((r) => r.countryCode === countryCode);
}

export function getDefaultRegion(countryCode: CountryCode = "RU"): RegionConfig {
  return getRegionsByCountry(countryCode)[0] ?? REGIONS[0];
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  RUB: "₽",
  KZT: "₸",
  UZS: "so'm",
  USD: "$",
  BYN: "Br",
};

export function formatMoney(amount: number, currency: string, locale: string): string {
  const sym = CURRENCY_SYMBOLS[currency as CurrencyCode] ?? currency;
  const formatted = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "kk" ? "kk-KZ" : locale === "uz" ? "uz-UZ" : "en-US").format(amount);
  if (currency === "USD") return `$${formatted}`;
  if (currency === "RUB") return `${formatted} ₽`;
  if (currency === "KZT") return `${formatted} ₸`;
  if (currency === "UZS") return `${formatted} so'm`;
  if (currency === "BYN") return `${formatted} Br`;
  return `${formatted} ${sym}`;
}
