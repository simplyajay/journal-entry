import { useLoginForm } from "./useLoginForm";
import { LabeledTextInput } from "@/components/common/field/TextInput";
import { Button } from "@/components/common/ui/button";
import { useAuth } from "@/pages/AuthContext";
import { Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const LoginForm = () => {
  const { register, handleSubmit, clearErrors, formState, onSubmit } =
    useLoginForm();

  const { loginLoading: loading, loginError, setLoginError } = useAuth();
  const { errors } = formState;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-8"
    >
      <div className="flex w-full items-center justify-center">
        <h1 className="font-manrope text-3xl text-gray-700">LOGIN</h1>
      </div>

      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full flex-col gap-4">
          <LabeledTextInput
            register={register}
            fieldName="username"
            label="Username"
            errors={errors}
            clearErrors={() => {
              clearErrors();
              setLoginError(undefined);
            }}
            disabled={loading}
          />

          <LabeledTextInput
            register={register}
            fieldName="password"
            label="Password"
            errors={errors}
            type="password"
            clearErrors={() => {
              clearErrors();
              setLoginError(undefined);
            }}
            disabled={loading}
          />

          {loginError && (
            <div className="font-manrope rounded-sm bg-red-50 p-2 text-xs text-red-500">
              {loginError}
            </div>
          )}
        </div>
        <div className="flex w-full flex-col items-center gap-4">
          <Button
            className="font-manrope w-full p-5 text-gray-800"
            type="submit"
            variant="secondary"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 size-6 animate-spin" />
            ) : (
              <p>Login</p>
            )}
          </Button>

          <span className="flex gap-1">
            <p className="font-manrope text-xs font-semibold text-gray-600">
              Dont' have an account?
            </p>
            <NavLink
              className="text-xs font-bold text-gray-600 hover:text-gray-700"
              to="/create-organization"
            >
              Create organization
            </NavLink>
          </span>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
