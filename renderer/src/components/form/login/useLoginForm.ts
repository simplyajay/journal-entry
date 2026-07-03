import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "./_schema";
import { useAuth } from "@/pages/AuthContext";
import type { SubmitHandler } from "react-hook-form";
import type { LoginSchemaType } from "./_schema";

export const useLoginForm = () => {
  const { register, control, handleSubmit, clearErrors, formState } =
    useForm<LoginSchemaType>({
      resolver: zodResolver(LoginSchema),
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      shouldFocusError: false,
      defaultValues: {
        username: "",
        password: "",
      },
    });

  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    await login(data);
  };

  return {
    register,
    control,
    handleSubmit,
    clearErrors,
    formState,
    onSubmit,
  };
};
