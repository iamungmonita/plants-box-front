"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPurchasedOrderByPurchasedId } from "@/services/order";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { formattedTimeStamp } from "@/helpers/format/time";
import { formattedKHR } from "@/helpers/format/currency";
import { PurchasedOrderList } from "@/models/Order";

const Invoice = () => {
  const params = useParams();
  const [purchasedId, setPurchasedId] = useState<string>("");
  const [order, setOrder] = useState<PurchasedOrderList | null>(null);
  const exchangeRate = useExchangeRate();

  useEffect(() => {
    if (!params?.purchasedId) return;
    setPurchasedId(params.purchasedId as string);
  }, [params]);

  useEffect(() => {
    if (!purchasedId) return;
    const fetchProduct = async () => {
      try {
        const response = await getPurchasedOrderByPurchasedId(purchasedId);
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setOrder(response.data[0]);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProduct();
  }, [purchasedId]);

  return (
    <div>
      <button onClick={() => window.print()} className="">
        Print Receipt
      </button>
      <div id="receipt">
        {order?.orders && order?.orders.length > 0 && (
          <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">
            <p
              id="header"
              className=" font-black text-center text-lg uppercase my-5"
            >
              Plants Box
            </p>
            <p className="text-center">St.478 TTP 1 Chamkarmon PP</p>
            <p className="text-center">
              All items sold as is no refunds and exchanges.
            </p>
            <p className="text-center">Phone: 098365155</p>
            <div className="flex items-center justify-center">
              <hr className=" border-dashed border-gray-400 flex-grow-0 w-1/4" />
              <strong>Invoice</strong>
              <hr className=" border-dashed border-gray-400 flex-grow-0 w-1/4" />
            </div>
            <div className="mt-2">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="text-left"></th>
                    <th className="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="flex items-center justify-between w-full">
                    <td className="font-semibold">Invoice:</td>
                    <td>{order.purchasedId}</td>
                  </tr>
                  <tr className="flex items-center justify-between w-full">
                    <td className="font-semibold">Customer:</td>
                    <td>
                      {order.member
                        ? `${order.member.fullname}  (${order.member.type})`
                        : "Walk-in Customer"}
                    </td>
                  </tr>
                  <tr className="flex items-center justify-between w-full">
                    <td className="font-semibold">Mobile Number:</td>
                    <td>{order.member ? order.member.phoneNumber : "-"}</td>
                  </tr>
                  <tr className="flex items-center justify-between w-full">
                    <td className="font-semibold">Payment Method:</td>
                    <td>{order.paymentMethod.toUpperCase()}</td>
                  </tr>
                  <tr className="flex items-center justify-between w-full">
                    <td className="font-semibold">Seller:</td>
                    <td>{order.createdBy}</td>
                  </tr>
                  <tr className="flex items-center justify-between w-full">
                    <td className="font-semibold">Date:</td>
                    <td>
                      {formattedTimeStamp(
                        order.createdAt,
                        "DD-MM-YYYY (HH:MM a)"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr className="my-3" />

            <table className="w-full mt-2">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Item</th>
                  <th className="text-left">Qty</th>
                  <th className="text-left">Price</th>
                  <th className="text-right">Dis (%)</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orders.map((item, index) => (
                  <tr key={item._id} className="border-t mt-3">
                    <td className="">{index + 1}</td>
                    <td className="">{item.name}</td>
                    <td className="text-left">{item.quantity}</td>
                    <td className="text-left">${item.price.toFixed(2)}</td>
                    <td className="text-right">
                      {item.discount || order.totalDiscountValue || 0}%
                    </td>

                    <td className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className="mb-3" />
            <table id="payment" className="table-auto w-full">
              <thead>
                <tr>
                  <th className="text-left"></th>
                  <th className="text-left"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="flex items-center justify-between w-full">
                  <td className="font-semibold">Subtotal:</td>
                  <td>${parseFloat(order.amount).toFixed(2)} </td>
                </tr>
                <tr className="flex items-center justify-between w-full">
                  <td className="font-semibold"> (KHR) Subtotal:</td>
                  <td>
                    ៛
                    {formattedKHR(parseFloat(order.amount) * exchangeRate) ?? 0}
                  </td>
                </tr>
                <tr className="flex items-center justify-between w-full">
                  <td className="font-semibold">Discount:</td>
                  <td>{order.totalDiscountPercentage ?? 0}%</td>
                </tr>
                <tr className="flex items-center justify-between w-full">
                  <td className="font-semibold">Points:</td>
                  <td>${(order.totalPoints ?? 0).toFixed(2)} </td>
                </tr>
                <tr
                  id="header"
                  className="flex text-xl font-bold items-center justify-between w-full"
                >
                  <td className="font-bold ">Total:</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                </tr>
                <tr className="flex items-center justify-between w-full">
                  <td className="font-semibold">Paid Amount:</td>
                  <td>${(order.paidAmount ?? 0).toFixed(2)}</td>
                </tr>
                <tr className="flex items-center justify-between w-full">
                  <td className="font-semibold">Changes:</td>
                  <td>${(order.changeAmount ?? 0).toFixed(2)} </td>
                </tr>
              </tbody>
            </table>

            <hr className="my-3" />

            <p className="text-center font-semibold">
              Thank you for shopping with us!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
