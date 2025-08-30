import React from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

interface Props {
  setTicketId: (ticketId: string) => void;
  handleCancel: () => void;
}

const QrScanner = ({ setTicketId, handleCancel }: Props) => {
  return (
    <div className="w-full flex items-center justify-center">
      <BarcodeScanner
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (err) {
            console.log(err);
          }
          if (result) {
            setTicketId(result.getText());
            handleCancel();
          } else setTicketId("");
        }}
      />
    </div>
  );
};

export default QrScanner;
