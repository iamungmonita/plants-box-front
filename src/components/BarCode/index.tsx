import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const BarcodeGenerator = ({ barcodeValue }: { barcodeValue: string }) => {
  // Create a reference to the DOM element where barcode will be rendered
  const barcodeRef = useRef(null);

  // Generate the barcode when the component mounts or barcodeValue changes
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, barcodeValue, {
        format: "CODE128", // You can change the barcode format if needed
        width: 1, // Width of the bars
        height: 25, // Height of the barcode
        displayValue: false, // Show the value below the barcode
      });
    }
  }, [barcodeValue]); // Re-run this effect when barcodeValue changes

  return (
    <div>
      {/* Barcode will be rendered here */}
      <svg ref={barcodeRef}></svg>
    </div>
  );
};

export default BarcodeGenerator;
