import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SetupSchema } from "./_schema";
import type { SetupSchemaType } from "./_schema";

export const useSetupForm = () => {
  const form = useForm<SetupSchemaType>({
    resolver: zodResolver(SetupSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
  });

  const { setError } = form;
  const [setupError, setSetupError] = useState<string | undefined>(undefined);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SetupSchemaType) => {
    setLoading(true);

    const result = await window.api.org.createOrganization(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (result.success) {
      setShowDialog(true);
    } else {
      if (result.error.type === "field") {
        setError("organizationName", { message: result.error.message });
      } else {
        setSetupError(result.error.message);
      }
    }
    setLoading(false);
  };

  return {
    form,
    onSubmit,
    loading,
    setupError,
    setSetupError,
    showDialog,
    setShowDialog,
  };
};
