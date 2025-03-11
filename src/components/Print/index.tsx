import { useCartItems } from "@/hooks/useCartItems";
import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ShoppingCartProduct } from "../ShoppingCart";
import CustomButton from "../Button";
import { useRouter } from "next/navigation";
// Props interface for the Receipt component
interface ReceiptProps {
  items?: ShoppingCartProduct[];
}

const Receipt: React.FC<ReceiptProps> = ({
  items,
}: {
  items?: ShoppingCartProduct[];
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handlePrint = useReactToPrint({
    contentRef,
  });
  useEffect(() => {
    handlePrint();
    setTimeout(() => {
      router.push("/admin/order");
    }, 1000);
  }, []);
  const calculateTotal = (): number =>
    (items || []).reduce(
      (acc, item) =>
        acc +
        item.price * item.quantity * (1 - (Number(item.discount) || 0) / 100),
      0
    );

  return (
    <div className="max-w-md  mx-auto">
      {/* Print button */}
      <button onClick={() => handlePrint()}>Print Receipt</button> // ✅ Correct
      way
      {/* Printable receipt */}
      <div
        ref={contentRef}
        className="w-[80mm] p-2 mt-4 border rounded bg-white shadow-lg"
      >
        <h2 className="text-lg font-bold text-center mb-2">
          🛒 Purchase Receipt
        </h2>

        <table className="w-full text-gray-700">
          <thead>
            <tr className="grid grid-cols-6 pl-2 bg-gray-200 text-[10px] font-semibold py-2">
              <th className="text-left">Qty</th>
              <th className="col-span-2 text-left">Item</th>
              <th className="text-left">Price</th>
              <th className="text-left">Disc</th>
              <th className="text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr
                key={item._id}
                className="grid grid-cols-6 pl-2 py-2 border-b text-[10px] items-center hover:bg-gray-100 transition"
              >
                <td>{item.quantity}</td>
                <td className="col-span-2">{item.name}</td>
                <td className="text-left">${item.price.toFixed(2)}</td>
                <td className="text-left">
                  {item.discount ? `${item.discount}%` : "-"}
                </td>
                <td className="text-left">
                  $
                  {(
                    item.price *
                    item.quantity *
                    (1 - (Number(item.discount) || 0) / 100)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="grid grid-cols-6 gap-4 px-2 py-3 font-semibold bg-gray-100">
              <td className="col-span-4 text-left">Grand Total:</td>
              <td className="col-span-2 text-left text-green-500">
                ${calculateTotal().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="text-center text-sm font-semibold mt-3">
          ✅ Thank you for shopping with us!
        </p>
      </div>
    </div>
  );
};

export default Receipt;
