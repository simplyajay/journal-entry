export const INPUT_BASE =
  "w-full min-w-0 min-h-10 font-manrope text-sm text-gray-800";

export const INPUT_VARIANTS = {
  default: "border border-gray-300 rounded-sm disabled: bg-muted/10",
  table:
    "border-transparent rounded-sm bg-transparent focus-visible:ring-1 hover:bg-white disabled:bg-transparent",
} as const;
