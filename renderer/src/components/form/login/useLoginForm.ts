import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "./_schema";
import { useAuth } from "@/pages/protected/AuthContext";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    const result = await window.api.auth.login(data);

    if (result.success) {
      const user = result.data;
      login(user);

      navigate("/jev/new");
    } else {
      console.error("[Login] Login failed.", result.error);
    }
  };

  return { register, control, handleSubmit, clearErrors, formState, onSubmit };
};
