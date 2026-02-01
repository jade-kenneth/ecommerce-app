import { useCallback, useState } from 'react';

export interface DisclosureState {
  open: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useDisclosure = (initial = false): DisclosureState => {
  const [open, setOpen] = useState<boolean>(initial);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    isOpen: open,
    onOpen,
    onClose,
    onToggle,
    setOpen,
  };
};
