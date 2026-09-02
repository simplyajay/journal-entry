import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/common/ui/dialog";
import { Button } from "../../../../components/common/ui/button";
import { LabeledTextInput } from "@/components/common/field/TextInput";
import { LabeledDatePicker } from "../../../../components/common/field/DatePicker";
import { useForm, type SubmitHandler } from "react-hook-form";
import { JEVSearchSchema, type JEVSearchSchemaType } from "./_schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface SearchDialogProps {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  handleSearch: (data: JEVSearchSchemaType) => Promise<void>;
}

const SearchDialog = ({ isOpen, setOpen, handleSearch }: SearchDialogProps) => {
  const {
    control,
    register,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JEVSearchSchemaType>({
    resolver: zodResolver(JEVSearchSchema),
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      keyword: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<JEVSearchSchemaType> = async (data) => {
    await handleSearch(data);
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setOpen(val)}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-125"
      >
        <DialogHeader>
          <DialogTitle>Search JEV</DialogTitle>
          <DialogDescription>
            Search by JEV number or description across all entries.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          id="search-jev-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4 py-6"
        >
          <LabeledTextInput
            register={register}
            fieldName="keyword"
            label="Keyword"
            placeholder='e.g. JEV-2024-0417 or "registration fee"'
            errors={errors}
            clearErrors={clearErrors}
          />

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-700">Range</p>
            <div className="flex items-center justify-around gap-4">
              <LabeledDatePicker
                control={control}
                fieldName="startDate"
                placeholder="Start Date"
                errors={errors}
                clearErrors={clearErrors}
              />

              <p className="text-xs text-gray-700">TO</p>

              <LabeledDatePicker
                control={control}
                fieldName="endDate"
                placeholder="End Date"
                errors={errors}
                clearErrors={clearErrors}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            className="flex w-16 items-center justify-center p-2"
            variant="secondary"
            type="submit"
            form="search-jev-form"
          >
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
