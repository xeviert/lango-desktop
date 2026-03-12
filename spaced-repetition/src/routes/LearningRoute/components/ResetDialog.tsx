import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResetDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetDialog({ open, onConfirm, onCancel }: ResetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset all counts?</DialogTitle>
          <DialogDescription>
            This will reset the score and all correct/incorrect counts to zero. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
