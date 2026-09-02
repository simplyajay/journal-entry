export const toCents = (n: unknown): number =>
  typeof n === "number" && !isNaN(n) ? Math.round(n * 100) : 0;
