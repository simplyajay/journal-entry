import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AccountSchema,
  ProfileSchema,
  type AccountSchemaType,
  type ProfileSchemaType,
} from "./_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/pages/contexts/AuthContext";

export const useProfileForm = () => {
  const { currentUser } = useAuth();

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      firstName: currentUser ? currentUser.firstName : undefined,
      middleName: currentUser ? currentUser.middleName : undefined,
      lastName: currentUser ? currentUser.lastName : undefined,
      position: currentUser ? currentUser.position : undefined,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ProfileSchemaType) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);

    setLoading(false);
  };

  return { onSubmit, form, loading };
};

export const useAccountForm = () => {
  const { currentUser } = useAuth();

  const form = useForm<AccountSchemaType>({
    resolver: zodResolver(AccountSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues: { username: currentUser ? currentUser.username : undefined },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: AccountSchemaType) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);

    setLoading(false);
  };

  return { onSubmit, form, loading };
};
