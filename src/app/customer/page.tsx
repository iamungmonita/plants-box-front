"use client";
import { ShoppingCartProduct } from "@/models/Cart";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import LocalTime from "@/components/RealTime";
import CustomerCard from "@/components/CustomerCard";
import BasicModal from "@/components/Modal";
import PaymentQRCode from "@/components/Modals/QRcode";

export interface PaymentSummary {
  total: number;
  discount: number;
  point: number;
  voucher: string;
  paidAmount: number;
  amount: number;
  changeAmount: number;
  toggle: boolean;
}

const Page = () => {
  const [cart, setCart] = useState<ShoppingCartProduct[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null
  );
  const getCartFromStorage = useCallback(() => {
    const storedCart = localStorage.getItem("plants");
    return storedCart ? JSON.parse(storedCart) : [];
  }, []);
  const getPaymentSummary = useCallback(() => {
    const storedPayment = localStorage.getItem("paymentSummary");
    return storedPayment ? JSON.parse(storedPayment) : {};
  }, []);

  useEffect(() => {
    setCart(getCartFromStorage());
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "plants") {
        setCart(getCartFromStorage());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [getCartFromStorage]);

  useEffect(() => {
    setPaymentSummary(getPaymentSummary());
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "paymentSummary") {
        setPaymentSummary(getPaymentSummary()) ?? [];
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [getPaymentSummary]);

  return (
    <div className="max-w-7xl gap-4 w-full mx-auto">
      {paymentSummary?.toggle && (
        <BasicModal
          ContentComponent={PaymentQRCode}
          open={paymentSummary.toggle}
          text={String(paymentSummary?.total)}
        />
      )}
      <div className="w-full flex justify-between items-center">
        <div className="relative w-[150px] flex justify-center h-[100px]">
          <Image
            src={"/assets/plant-no-bg.png"}
            alt={"/assets/plant.jpg"}
            width={100}
            height={100}
            className="w-full h-full object-cover rounded p-1"
          />
        </div>
        <LocalTime />
      </div>

      <div className="max-w-7xl gap-4 w-full mx-auto grid grid-cols-2 min-h-[75vh] h-full max-h-[75vh]">
        <div className="max-h-[75vh] bg-white rounded-lg border py-4 px-10 h-full overflow-y-scroll scroll-container">
          <div className="flex justify-between w-full border-b pb-4 items-center">
            <h2 className="text-xl font-black flex justify-between w-full">
              <span>Order Summary</span>
              <span>({cart.length})</span>
            </h2>
          </div>
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="grid grid-cols-7 py-2 bg-gray-100 px-2 gap-4 border-b first-line:items-center">
                <th className="">No</th>
                <th className="col-span-2">Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Disc (%)</th>
                <th>Subtotal</th>
              </tr>
            </thead>
          </table>
          <table className="w-full text-left text-gray-700">
            <tbody>
              {cart.map((item, idx) => (
                <tr
                  key={item._id}
                  className="grid grid-cols-7 gap-4 px-2 text-sm border-b items-center"
                >
                  <CustomerCard key={item._id} item={item} idx={idx} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="max-h-[75vh] min-h-[75vh] flex gap-4 h-full flex-col">
          <div className="rounded-lg py-4 px-10 h-full text-lg border">
            <div className="flex flex-col ">
              <div className="flex justify-between w-full border-b pb-4 items-center">
                <h2 className="text-xl font-black">Payment Summary</h2>
              </div>
              <p className="flex justify-between mt-4">
                <span>Subtotal</span>
                <span>${(paymentSummary?.amount || 0).toFixed(2)}</span>
              </p>

              <div className="flex gap-1 flex-col">
                <p className="flex justify-between">
                  <span>Discount:</span>
                  <span>{paymentSummary?.discount || 0}%</span>
                </p>
              </div>
              <div className="flex gap-1 flex-col">
                <p className="flex justify-between">
                  <span>Point:</span>
                  <span>${(paymentSummary?.point || 0).toFixed(2)}</span>
                </p>
              </div>
              <div className="flex gap-1 flex-col">
                <p className="flex justify-between">
                  <span>Voucher:</span>
                  <span>{paymentSummary?.voucher || "-"}</span>
                </p>
              </div>
              <br />
              <hr />
              <br />
              <div className="flex text-xl gap-1 flex-col">
                <h2 className="flex justify-between">
                  <span className="font-black">Total:</span>
                  <span>${(paymentSummary?.total || 0).toFixed(2)}</span>
                </h2>
              </div>
              <div className="flex gap-1 flex-col">
                <p className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span>${(paymentSummary?.paidAmount || 0).toFixed(2)}</span>
                </p>
              </div>
              <div className="flex gap-1 flex-col">
                <p className="flex justify-between">
                  <span>Changes:</span>
                  <span>${(paymentSummary?.changeAmount || 0).toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
