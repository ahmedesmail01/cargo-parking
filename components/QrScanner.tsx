"use client";
import React from "react";
import { QrReader } from "react-qr-reader";

const QrScanner = () => {
  const handleScan = async (data: string) => {
    console.log(data);

    // if (data) {
    //   const parsedData: UserQrCodeData = JSON.parse(data);
    //   setScanResult({
    //     ...parsedData,
    //     name: decodeURIComponent(parsedData.name),
    //   });
    //   try {
    //     await api.post(`/form_responses/confirm-attendance`, {
    //       form_submission_id: parsedData.id,
    //     });
    //     MakeToast({
    //       message: "Success",
    //       type: "success",
    //       description: "Attendance confirmed successfully",
    //     });
    //     setShowQrScanner(false);
    //   } catch (e) {
    //     MakeToast({
    //       message: "Error",
    //       type: "error",
    //       description: "Error confirming attendance",
    //     });
    //   }
    // }
  };

  return (
    <div className="w-full">
      <h1>QR Code Scanner</h1>
      {
        <QrReader
          className="qr-code-reader"
          scanDelay={200}
          containerStyle={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
          videoContainerStyle={{
            width: "100%",
            height: "auto",
            border: "2px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
          }}
          videoStyle={{
            width: "100%",
            objectFit: "cover !important",
          }}
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result.getText());
            }

            if (!!error) {
              // console.log(error);
            }
          }}
          constraints={{ facingMode: "environment" }}
        />
      }
    </div>
  );
};

export default QrScanner;
