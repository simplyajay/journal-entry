import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/contexts/useAuth";
import { Button } from "@/components/common/ui/button";
import ActionDialog from "@/components/common/dialog/ActionDialog";
import JevForm from "../form/JevForm";
import { EMPTY_JEV_FORM_VALUES, useJevFormBase } from "../form/useJevFormBase";
import { mapFormValuesToCreateDTO } from "../form/_lib";
import type { SubmitHandler } from "react-hook-form";
import type { JournalEntrySchemaType } from "../form/_schema";

const CreateJev = () => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const { form, scrollToFirstError } = useJevFormBase();

  const backToList = () => navigate("/main/jev/list");

  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const onSubmit: SubmitHandler<JournalEntrySchemaType> = async (data) => {
    setLoading(true);

    const result = await window.api.jev.createJev(
      mapFormValuesToCreateDTO(data, {
        createdBy: currentUser.id,
        ownerId: currentUser.organizationId,
      }),
    );

    if (result.success) {
      setShowDialog(true);
      form.reset(EMPTY_JEV_FORM_VALUES);
    } else {
      if (
        result.error.type === "field" &&
        result.error.field === "journalEntryVoucherNumber"
      ) {
        form.setError(result.error.field, { message: result.error.message });
        scrollToFirstError();
      }
      console.error("[CreateJev] Failed to create JEV:", result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <JevForm
        form={form}
        onSubmit={onSubmit}
        onInvalid={scrollToFirstError}
        title="NEW JOURNAL ENTRY VOUCHER"
        loading={loading}
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

      <ActionDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        dialogTitle="Journal Entry Voucher"
        dialogDescription="Successfully created new Journal Entry Voucher."
        dialogFooter={
          <Button
            onClick={() => setShowDialog(false)}
            type="button"
            variant="secondary"
          >
            Close
          </Button>
        }
      />
    </>
  );
};

export default CreateJev;
