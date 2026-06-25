import { useLoginForm } from "./useLoginForm";
import { LabeledTextInput } from "@/components/common/field/TextInput";
import { Button } from "@/components/common/ui/button";

const LoginForm = () => {
  const { register, handleSubmit, clearErrors, formState, onSubmit } =
    useLoginForm();
  const { errors } = formState;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-5">
        <LabeledTextInput
          register={register}
          fieldName="username"
          label="Username"
          errors={errors}
          clearErrors={clearErrors}
        />

        <LabeledTextInput
          register={register}
          fieldName="password"
          label="Password"
          errors={errors}
          type="password"
          clearErrors={clearErrors}
        />

        <Button
          className="font-manrope p-6 text-lg text-gray-800"
          type="submit"
          variant="secondary"
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
