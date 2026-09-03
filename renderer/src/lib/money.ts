import type { Cents } from "@shared/types/jev";

export const toCents = (value: unknown): Cents =>
  typeof value === "number" && !isNaN(value) ? Math.round(value * 100) : 0;

export const fromCents = (cents: Cents | undefined): number | undefined =>
  cents === undefined || cents === null ? undefined : cents / 100;

export const formatNumber = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatCents = (cents: Cents) => formatNumber(cents / 100);
