import { InputRenderer } from "@/components/common/field/RHFInputRenderer";
import { accountFormFields, profileFormFields } from "./_fields";
import {
  useAccountInformationForm,
  useProfileInformationForm,
} from "./useAccountForms";
import { Button } from "@/components/common/ui/button";
import { Loader2 } from "lucide-react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import type { InputField } from "@/components/common/field/_types";

type AccountFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fields: InputField<T>[];
  onSubmit: SubmitHandler<T>;
  handleFocus: () => void;
  updateError: string | null;
  loading: boolean;
  isDirty: boolean;
  submitButtonLabel: string;
};

const UserAccountForm = <T extends FieldValues>({
  form,
  fields,
  onSubmit,
  handleFocus,
  updateError,
  loading,
  isDirty,
  submitButtonLabel,
}: AccountFormProps<T>) => {
  const { handleSubmit } = form;
  return (
    <form
      className="w-full"
      onSubmit={handleSubmit(onSubmit)}
      onFocus={handleFocus}
    >
      <div className="flex w-full flex-col gap-4">
        {fields.map((field) => (
          <InputRenderer key={field.name} field={field} form={form} />
        ))}
        {updateError && (
          <div className="font-manrope rounded-sm bg-red-50 p-2 text-xs text-red-500">
            {updateError}
          </div>
        )}
        <div className="flex w-full justify-end">
          <Button
            className="font-manrope p-5 text-gray-800"
            type="submit"
            variant="secondary"
            disabled={loading || !isDirty}
          >
            {loading ? (
              <Loader2 className="mr-2 size-6 animate-spin" />
            ) : (
              <p>{submitButtonLabel}</p>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export const ProfileInformationForm = () => {
  const { onSubmit, form, loading, updateError, setUpdateError } =
    useProfileInformationForm();

  const {
    formState: { isDirty },
  } = form;

  return (
    <UserAccountForm
      form={form}
      fields={profileFormFields(loading)}
      onSubmit={onSubmit}
      handleFocus={() => setUpdateError(null)}
      updateError={updateError}
      loading={loading}
      isDirty={isDirty}
      submitButtonLabel="Update Profile"
    />
  );
};

export const AccountInformationForm = () => {
  const { onSubmit, form, loading, updateError, setUpdateError } =
    useAccountInformationForm();

  const {
    formState: { dirtyFields },
  } = form;

  const isDirty = Object.keys(dirtyFields).some(
    (field) => field !== "currentPassword",
  );
  return (
    <UserAccountForm
      form={form}
      fields={accountFormFields(loading)}
      onSubmit={onSubmit}
      handleFocus={() => setUpdateError(null)}
      updateError={updateError}
      loading={loading}
      isDirty={isDirty}
      submitButtonLabel="Update Account"
    />
  );
};
