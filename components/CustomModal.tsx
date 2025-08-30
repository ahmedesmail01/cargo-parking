"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CustomModalProps = {
  title: string;
  open: boolean;
  handleCancel: () => void; // called when user closes (overlay click, ESC, etc.)
  children: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  open,
  handleCancel,
  children,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        // only fire cancel when toggled closed
        if (!o) handleCancel();
      }}
    >
      <DialogContent
        // 1000px like AntD `width={1000}`, with mobile-friendly width
        className=" flex flex-col !p-4 items-center h-50Vh justify-center "
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        {/* No footer/actions -> matches AntD with hidden ok/cancel */}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
