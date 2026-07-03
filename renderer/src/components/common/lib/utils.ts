import type React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const blockInvalidNumberKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Tab",
  ];
  if (allowedKeys.includes(e.key)) return;
  if (/^\d$/.test(e.key)) return;
  if (e.key === "." && !e.currentTarget.value.includes(".")) return;
  e.preventDefault();
};

export const blockPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pasted = e.clipboardData.getData("text");
  if (!/^\d*\.?\d*$/.test(pasted)) {
    e.preventDefault();
  }
};

export const formatNumber = (value: number) => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
