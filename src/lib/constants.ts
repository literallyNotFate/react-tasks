import { cva } from "class-variance-authority";

export const BASE_URL: string = "https://test-backend-bm5r.onrender.com/api/";

export const CURRENCIES: string[] = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SEK",
  "NZD",
];

export const variants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-150 bg-transparent border disabled:pointer-events-none hover:text-white",
  {
    variants: {
      variant: {
        default: "border-white text-white hover:bg-white hover:text-black",
        danger: "border-red-500 text-red-500 hover:bg-red-500",
        success: "border-green-500 text-green-500 hover:bg-green-500",
        warning:
          "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black",
        primary: "border-blue-500 text-blue-500 hover:bg-blue-500",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
