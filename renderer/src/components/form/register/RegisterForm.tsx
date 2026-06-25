import { useRegisterForm } from "./useRegisterForm";
import { firstRow, secondRow, thirdRow } from "./_fields";
import { InputRenderer } from "../../common/field/RHFInputRenderer";
import type { RegisterSchemaType } from "./_schema";

const RegisterForm = () => {
  const { form, onSubmit, loading } = useRegisterForm();

  const { handleSubmit } = form;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full justify-evenly gap-6">
        {firstRow(loading).map((field, index) => {
          return (
            <InputRenderer<RegisterSchemaType>
              key={index}
              field={field}
              form={form}
            />
          );
        })}
      </div>

      <div className="flex w-full justify-evenly gap-4">
        {secondRow(loading).map((field, index) => {
          return (
            <InputRenderer<RegisterSchemaType>
              key={index}
              field={field}
              form={form}
            />
          );
        })}
      </div>

      <div className="flex w-full justify-evenly gap-4">
        {thirdRow(loading).map((field, index) => {
          return (
            <InputRenderer<RegisterSchemaType>
              key={index}
              field={field}
              form={form}
            />
          );
        })}
      </div>
    </form>
  );
};

export default RegisterForm;
