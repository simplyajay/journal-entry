import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/common/ui/dialog";

type DialogProps = {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  dialogTitle: string;
  dialogDescription: string;
  dialogFooter: React.ReactNode;
};

const ActionDialog = ({
  isOpen,
  onOpenChange,
  dialogTitle,
  dialogDescription,
  dialogFooter,
}: DialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>{dialogFooter}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
