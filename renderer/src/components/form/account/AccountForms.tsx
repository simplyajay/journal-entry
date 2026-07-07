import { InputRenderer } from "@/components/common/field/RHFInputRenderer";
import { accountFormFields, profileFormFormds } from "./_fields";
import { useAccountForm, useProfileForm } from "./useAccountForms";
import { Button } from "@/components/common/ui/button";
import { Loader2 } from "lucide-react";

export const ProfileForm = () => {
  const { onSubmit, form, loading } = useProfileForm();

  const { handleSubmit } = form;
  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-4">
        {profileFormFormds(loading).map((field) => (
          <InputRenderer key={field.name} field={field} form={form} />
        ))}
        <div className="flex w-full justify-end">
          <Button
            className="font-manrope p-5 text-gray-800"
            type="submit"
            variant="secondary"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 size-6 animate-spin" />
            ) : (
              <p>Update Profile</p>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export const AccountForm = () => {
  const { onSubmit, form, loading } = useAccountForm();

  const { handleSubmit } = form;

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-4">
        {accountFormFields(loading).map((field) => (
          <InputRenderer key={field.name} field={field} form={form} />
        ))}
        <div className="flex w-full justify-end">
          <Button
            className="font-manrope p-5 text-gray-800"
            type="submit"
            variant="secondary"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 size-6 animate-spin" />
            ) : (
              <p>Update Credentials</p>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
