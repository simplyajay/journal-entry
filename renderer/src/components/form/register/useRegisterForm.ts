import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "./_schema";
import type { RegisterSchemaType } from "./_schema";
import { useState } from "react";

export const useRegisterForm = () => {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return { form, onSubmit, loading };
};
