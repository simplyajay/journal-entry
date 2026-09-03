import JevForm from "../form/JevForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { useCurrentUser } from "@/contexts/useAuth";
import { useJevFormBase } from "../form/useJevFormBase";
import { mapJevDetailToFormValues } from "../form/_lib";
import type { DefaultValues, SubmitHandler } from "react-hook-form";
import type { JournalEntrySchemaType } from "../form/_schema";

const EditJevForm = ({
  defaultValues,
}: {
  defaultValues: DefaultValues<JournalEntrySchemaType>;
}) => {
  const navigate = useNavigate();
  const { form, scrollToFirstError } = useJevFormBase({ defaultValues });
  const [loading, setLoading] = useState(false);

  const backToList = () => navigate("/main/jev/list");

  const onSubmit: SubmitHandler<JournalEntrySchemaType> = async (data) => {
    setLoading(true);

    console.warn("[EditJev] update not implemented yet", data);

    setLoading(false);
    navigate("/main/jev/list");
  };

  return (
    <JevForm
      form={form}
      onSubmit={onSubmit}
      onInvalid={scrollToFirstError}
      title="EDIT JOURNAL ENTRY VOUCHER"
      loading={loading}
      submitLabel="Save changes"
      headerLeft={
        <Button
          className="text-gray-700"
          type="button"
          variant="secondary"
          onClick={backToList}
        >
          JEV List
        </Button>
      }
    />
  );
};

const EditJev = () => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  const { jevId } = useParams();

  const [defaultValues, setDefaultValues] =
    useState<DefaultValues<JournalEntrySchemaType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const ownerId = currentUser.organizationId;

  useEffect(() => {
    let cancelled = false;

    const getJev = async () => {
      if (!jevId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const res = await window.api.jev.getJev({ ownerId, jevId });

      if (cancelled) return;

      if (res.success && res.data) {
        setDefaultValues(mapJevDetailToFormValues(res.data));
      } else {
        setNotFound(true);
      }

      setLoading(false);
    };

    getJev();

    return () => {
      cancelled = true;
    };
  }, [ownerId, jevId]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (notFound || !defaultValues) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-gray-600">
        <p>Journal entry voucher not found.</p>
        <button
          className="text-blue-500 hover:cursor-pointer hover:underline"
          onClick={() => navigate("/main/jev/list")}
        >
          Back to list
        </button>
      </div>
    );
  }

  return <EditJevForm defaultValues={defaultValues} />;
};

export default EditJev;
