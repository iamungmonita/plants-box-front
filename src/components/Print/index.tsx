import React, { useRef } from "react";

export default function ReceiptPrinter() {
  const receiptRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printSection = document.createElement("div");
      printSection.innerHTML = receiptRef.current.innerHTML;

      // Add Tailwind CSS styles to the print section
      printSection.style.fontFamily = "Arial, sans-serif";
      printSection.style.padding = "20px";
      printSection.style.border = "1px solid #ddd";
      printSection.style.maxWidth = "300px";
      printSection.style.margin = "0 auto";

      // Append the print section to the body and trigger the print
      document.body.appendChild(printSection);
      window.print();

      // Clean up by removing the print section after printing
      document.body.removeChild(printSection);
    }
  };

  return (
    <div>
      <div ref={receiptRef} className="receipt">
        <h2 className="text-2xl font-semibold text-blue-600">Receipt</h2>
        <p className="text-sm">Item: Product A</p>
        <p className="text-sm">Quantity: 2</p>
        <p className="text-lg font-bold text-green-600">Total: $20.00</p>
      </div>
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Print Receipt
      </button>
    </div>
  );
}
