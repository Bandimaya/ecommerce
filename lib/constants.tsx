export const apiUrl = "/api";


export const CURRENCY_OPTIONS = [
    { code: "USD", label: "USD - US Dollar", symbol: "$" },
    { code: "INR", label: "INR - Indian Rupee", symbol: "₹" },
    { code: "EUR", label: "EUR - Euro", symbol: "€" },
    { code: "GBP", label: "GBP - British Pound", symbol: "£" },
    { code: "AED", label: "AED - UAE Dirham", symbol: "د.إ" },
    { code: "QAR", label: "QAR - Qatari Riyal", symbol: "ر.ق" },
];

export const countryToCurrency: any = {
    "IN": "INR",
    "QA": "QAR",
    "US": "USD",
    "AE": "AED",
    "GB": "GBP",
    "DE": "EUR",
    "FR": "EUR",
};