import { useState } from "react";
import { useForm } from "react-hook-form";
import { AccountSchema, ProfileSchema } from "./_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/pages/contexts/AuthContext";
import { useSettingsDialog } from "@/components/common/dialog/SettingsDialog/SettingsDialogContext";
import type { AccountSchemaType, ProfileSchemaType } from "./_schema";
import type { DefaultValues, FieldValues, Resolver } from "react-hook-form";
import type { User } from "@/types/user";
import type { IpcResult } from "@/types/electron";

interface UseAccountFormOptions<T extends FieldValues> {
  resolver: Resolver<T>;
  defaultValues: DefaultValues<T>;
  submit: (data: T) => Promise<IpcResult<User>>;
  getResetValues?: (data: T, result: User) => T;
  successDialog: { title: string; description: string; confirmLabel: string };
}

const useAccountForm = <T extends FieldValues>({
  resolver,
  defaultValues,
  submit,
  getResetValues,
  successDialog,
}: UseAccountFormOptions<T>) => {
  const { setCurrentUser } = useAuth();

  const form = useForm<T>({
    resolver,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues,
  });

  const { setError, reset } = form;
  const [loading, setLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const dialog = useSettingsDialog();

  const onSubmit = async (data: T) => {
    setLoading(true);
    setUpdateError(null);

    const [result] = await Promise.all([
      submit(data),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);

    if (!result.success) {
      if (result.error.type === "general") {
        setUpdateError(result.error.message);
      } else {
        setError(result.error.field as any, { message: result.error.message });
      }
      setLoading(false);
      return;
    }

    dialog.action({
      type: "open",
      payload: {
        title: successDialog.title,
        description: successDialog.description,
        confirmLabel: successDialog.confirmLabel,
        onConfirm: () => dialog.action({ type: "close" }),
      },
    });
    setCurrentUser(result.data);
    reset(getResetValues ? getResetValues(data, result.data) : data);
    setLoading(false);
  };

  return { onSubmit, form, loading, updateError, setUpdateError };
};

export const useProfileInformationForm = () => {
  const { currentUser } = useAuth();

  return useAccountForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: currentUser?.firstName,
      middleName: currentUser?.middleName,
      lastName: currentUser?.lastName,
      position: currentUser?.position,
    },
    submit: (data) => window.api.user.updateUserProfile(data),
    successDialog: {
      title: "Update Profile",
      description: "Profile Information updated successfully.",
      confirmLabel: "Close",
    },
  });
};

export const useAccountInformationForm = () => {
  const { currentUser } = useAuth();

  return useAccountForm<AccountSchemaType>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      username: currentUser ? currentUser.username : undefined,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    submit: (data) => {
      const { confirmPassword, ...rest } = data;
      return window.api.user.updateUserAccount(rest);
    },
    getResetValues: (_data, result) => ({
      username: result.username,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }),
    successDialog: {
      title: "Update Profile",
      description: "Profile Information updated successfully.",
      confirmLabel: "Close",
    },
  });
};
