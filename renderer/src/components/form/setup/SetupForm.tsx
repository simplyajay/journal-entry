import { useSetupForm } from "./useSetupForm";
import {
  organizationSection,
  accountSection,
  personalInfoSection,
  roleSection,
} from "./_fields";
import { InputRenderer } from "../../common/field/RHFInputRenderer";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/common/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionDialog from "@/components/common/dialog/ActionDialog";
import type { SetupSchemaType } from "./_schema";
import type { InputField } from "@/components/common/field/_types";
import type { UseFormReturn } from "react-hook-form";

type FormSectionProps = {
  form: UseFormReturn<SetupSchemaType>;
  label: string;
  fields: InputField<SetupSchemaType>[];
};

const FormSection = ({ label, fields, form }: FormSectionProps) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex w-full flex-col justify-evenly gap-2">
        <label
          htmlFor={`${label}-section-label`}
          className="text-xs font-semibold text-gray-500"
        >
          {label}
        </label>
        <div className="flex w-full flex-col gap-2">
          {fields.map((field, index) => {
            return (
              <InputRenderer<SetupSchemaType>
                key={index}
                field={field}
                form={form}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CreateOrganizationForm = () => {
  const {
    form,
    onSubmit,
    loading,
    setupError,
    setSetupError,
    showDialog,
    setShowDialog,
  } = useSetupForm();

  const { handleSubmit } = form;

  const navigate = useNavigate();

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
        onFocus={() => setSetupError(undefined)}
      >
        <div className="flex w-full items-center justify-center py-4">
          <h1 className="font-manrope text-3xl text-gray-700">
            CREATE ORGANIZATION
          </h1>
        </div>

        <div className="flex flex-1 items-start justify-center gap-8 p-2">
          <div className="flex w-full flex-1 flex-col gap-6">
            <FormSection
              label="ORGANIZATION"
              fields={organizationSection(loading)}
              form={form}
            />
            <FormSection
              label="ACCOUNT"
              fields={accountSection(loading)}
              form={form}
            />
          </div>

          <div className="flex w-full flex-1 flex-col gap-6">
            <FormSection
              label="ROLE"
              fields={roleSection(loading)}
              form={form}
            />
            <FormSection
              label="PERSONAL INFORMATION"
              fields={personalInfoSection(loading)}
              form={form}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          {setupError && (
            <div className="font-manrope w-1/2 rounded-sm bg-red-50 p-2 text-xs text-red-500">
              {setupError}
            </div>
          )}
          <Button
            className="font-manrope w-1/2 self-center p-5 text-gray-800"
            type="submit"
            variant="secondary"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 size-6 animate-spin" />
            ) : (
              <p>Create Organization</p>
            )}
          </Button>
          <span className="flex gap-1">
            <p className="font-manrope text-xs font-semibold text-gray-600">
              Already have an organization?
            </p>
            <NavLink
              className="text-xs font-bold text-gray-600 hover:text-gray-700"
              to="/login"
            >
              Login
            </NavLink>
          </span>
        </div>
      </form>

      <ActionDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        dialogTitle="Organization Created"
        dialogDescription="Your organization has been set up successfully."
        dialogFooter={
          <Button
            onClick={() => navigate("/login")}
            type="button"
            variant="secondary"
          >
            Go to Login
          </Button>
        }
      />
    </>
  );
};

export default CreateOrganizationForm;
