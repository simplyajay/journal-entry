import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { useFieldBase } from "./_useFieldBase";
import { withFieldWrapper } from "./withFieldWrapper";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import type { FieldValues } from "react-hook-form";
import type { ComboboxInputProps, ComboOption } from "./_types";
import type { WithFieldWrapperProps } from "./withFieldWrapper";

export const Combobox = <T extends FieldValues>({
  control,
  fieldName,
  placeholder,
  clearErrors,
  errors,
  options,
  variant = "default",
  disabled,
  allowCustom = false,
  emptyMessage = "No matches",
  maxResults = 50,
}: ComboboxInputProps<T>) => {
  const { errorMessage } = useFieldBase({ fieldName, clearErrors, errors });

  const { field } = useController({ name: fieldName, control, disabled });

  const formContext = useFormContext();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const focusedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const committed = typeof field.value === "string" ? field.value : "";

  useEffect(() => {
    if (focusedRef.current) return;
    setQuery(committed);
  }, [committed]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
    return base.slice(0, maxResults);
  }, [options, query, maxResults]);

  const findExact = (text: string) =>
    options.find((o) => o.label.toLowerCase() === text.trim().toLowerCase());

  const parentPath = fieldName.includes(".")
    ? fieldName.slice(0, fieldName.lastIndexOf("."))
    : "";

  const pairKeys = useMemo(() => {
    const sample = options.find((o) => o.data)?.data;
    return sample ? Object.keys(sample) : [];
  }, [options]);

  const setPaired = (values: Record<string, string | number | undefined>) => {
    if (!formContext || !parentPath) return;
    Object.entries(values).forEach(([key, value]) => {
      formContext.setValue(`${parentPath}.${key}`, value, {
        shouldDirty: true,
        shouldValidate: false,
      });
    });
  };

  const commit = (option: ComboOption) => {
    field.onChange(option.value);
    setQuery(option.label);
    setOpen(false);
    if (option.data) setPaired(option.data);
  };

  const clearPair = () => {
    field.onChange("");
    setQuery("");
    setPaired(Object.fromEntries(pairKeys.map((key) => [key, ""])));
  };

  return (
    <Popover open={open && !field.disabled} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          ref={(el) => {
            inputRef.current = el;
            field.ref(el);
          }}
          value={query}
          disabled={field.disabled}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-invalid={!!errorMessage}
          spellCheck={false}
          autoComplete="off"
          className={clsx(INPUT_BASE, INPUT_VARIANTS[variant], {
            "bg-muted": field.disabled,
          })}
          onFocus={() => {
            focusedRef.current = true;
            clearErrors(fieldName);
            setOpen(true);
          }}
          onBlur={() => {
            focusedRef.current = false;
            field.onBlur();

            if (query.trim() === "") {
              clearPair();
              return;
            }

            const exact = findExact(query);
            if (exact) {
              commit(exact);
              return;
            }

            if (allowCustom) field.onChange(query);
            else setQuery(committed);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
            if (allowCustom) field.onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              if (open && filtered[activeIndex]) {
                e.preventDefault();
                commit(filtered[activeIndex]);
              }
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </PopoverAnchor>

      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (e.target === inputRef.current) e.preventDefault();
        }}
        className="max-h-56 w-(--radix-popover-trigger-width) gap-0.5 overflow-auto p-1"
      >
        {filtered.length === 0 ? (
          <p className="text-muted-foreground px-2 py-1.5 text-sm">
            {emptyMessage}
          </p>
        ) : (
          filtered.map((option, i) => (
            <button
              key={option.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(option)}
              onMouseEnter={() => setActiveIndex(i)}
              className={clsx(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm",
                i === activeIndex
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-800",
              )}
            >
              {option.label}
            </button>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};

export const LabeledCombobox = withFieldWrapper(Combobox) as <
  T extends FieldValues,
>(
  props: ComboboxInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;
