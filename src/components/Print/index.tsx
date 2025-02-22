import React, { useEffect, useRef, useState } from "react";
import { ShoppingCartProduct } from "../ShoppingCart";
import { updateCartItems } from "@/helpers/addToCart";

export default function ReceiptPrinter() {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const receiptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { items, total } = updateCartItems();
    setItems(items);
    setAmount(total);

    const handleCartUpdate = () => {
      const { items, total } = updateCartItems();
      setItems(items);
      setAmount(total);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const newWindow = window.open("", "_blank");

      if (newWindow) {
        newWindow.document.write(`
          <html>
          <head>
            <style>
              @media print {
                body {
                  width: 80mm; /* Set the receipt width for POS */
                  height: auto;
                  margin: 0;
                  padding: 0;
                }
                .receipt-container {
                  width: 100%;
                  padding: 10px;
                  text-align: left;
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  margin: 0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                }
                th, td {
                  border-bottom: 1px solid black;
                  padding: 3px;
                  text-align: left;
                }
                .total {
                  font-weight: bold;
                  font-size: 14px;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">${printContents}</div>
          </body>
          </html>
        `);

        newWindow.print();
      }
    }
  };

  return (
    <div>
      {/* Receipt content to be printed */}
      <div
        ref={receiptRef}
        className="receipt"
        style={{
          width: "80mm",
          padding: "10px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Receipt
        </h2>
        <table className="w-full text-left text-gray-700 mt-4">
          <thead>
            <tr className="border-b">
              <th className="py-1">Item</th>
              <th className="py-1">Qty</th>
              <th className="py-1">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-1">{item.name}</td>
                <td className="py-1">{item.quantity}</td>
                <td className="py-1">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 border-t pt-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>${(amount + amount * 0.01).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Print Receipt
      </button>
    </div>
  );
}
