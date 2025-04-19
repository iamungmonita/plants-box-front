"use client";
import { useEffect, useState } from "react";
import { formattedKHR } from "@/helpers/format/currency";
import { formattedTimeStamp } from "@/helpers/format/time";
import { PurchasedOrderList } from "@/models/Order";
import { getPurchasedOrderByPurchasedId } from "@/services/order";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useParams } from "next/navigation";

const ReceiptPage = () => {
  const params = useParams();
  const [purchasedId, setPurchasedId] = useState<string>("");
  const [order, setOrder] = useState<PurchasedOrderList | null>(null);
  const exchangeRate = useExchangeRate();

  useEffect(() => {
    if (!params?.orderId) return;
    setPurchasedId(params.orderId as string);
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

  useEffect(() => {
    if (order) {
      // Create a new window for printing
      const printWindow = window.open("", "", "width=800,height=600");

      // Inject Tailwind CSS into the print window
      printWindow?.document.write(`
        <html>
          <head>
            <title>Receipt</title>
                  <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;700&display=swap" rel="stylesheet">

            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
          <style>
                  @media print {
                  body * {
                    visibility: hidden;
                  }
                  #receipt,
                  #receipt * {
                    visibility: visible;
                          font-family: 'Red Hat Display', sans-serif;

                  }
                  #receipt {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 80mm;
                    min-height: auto;
                    font-size: 14px;
                    margin: 0;
                  }
                  #header {
                    font-size: 16px;
                  }
                  #payment {
                    font-size: 14px;
                  }
                  @page {
                    size: 88mm auto;
                    margin: 0;
                  }
                  table {
                    width: 100%; /* Keep table width 100% */
                    border-collapse: collapse; /* Collapse borders for clean appearance */
                  }
                  th, td {
                    text-align: left; /* Align content to the left */
                    padding: 2px; /* Reduce padding to make table smaller */
                    font-size: 14px; /* Adjust font size for compactness */
                  }
              hr {
                border: 1px dashed #ccc; /* Ensure it's a dashed line */
                border-width: 0.1px; /* Reduce thickness */
                margin: 4px 0; /* Adjust spacing */
                opacity: 0.6; /* Slightly reduce opacity for a finer look */
              }
                  .text-center {
                    text-align: center;
                  }
                  .font-bold {
                    font-weight: bold;
                  }
                  .flex {
                    display: flex;
                    justify-content: space-between;
                  }
                }
              </style>

            </head>
          <body>
      `);

      // Inject receipt HTML content with dynamic data
      printWindow?.document.write(`
        <div id="receipt">

          <div class="max-w-md mx-auto  p-4 border rounded-lg shadow-lg bg-white">
            <p id="header" class="font-black text-center text-lg uppercase my-5">Plants Box</p>
            <p class="text-center">St.478 TTP 1 Chamkarmon PP</p>
            <p class="text-center">All items sold as is no refunds and exchanges.</p>
            <p class="text-center">Phone: 098365155</p>
            <div class="flex items-center justify-center">
              <hr class=" flex-grow-0 w-2/4" />
              <strong>Invoice</strong>
              <hr class="  flex-grow-0 w-2/4" />
            </div>
            <div class="mt-2">
              <table class="table-auto w-full">
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="flex items-center justify-between w-full">
                    <td class="font-semibold">Invoice:</td>
                    <td>${order?.purchasedId}</td>
                  </tr>
                  <tr class="flex items-center justify-between w-full">
                    <td class="font-semibold">Payment Method:</td>
                    <td>${order?.paymentMethod.toUpperCase()}</td>
                  </tr>
                  <tr class="flex items-center justify-between w-full">
                    <td class="font-semibold">Seller:</td>
                    <td>${
                      typeof order?.createdBy === "object"
                        ? order?.createdBy?.firstName
                        : "N/A"
                    }</td>
                  </tr>
                  <tr class="flex items-center justify-between w-full">
                    <td class="font-semibold">Date:</td>
                    <td>${formattedTimeStamp(
                      order?.createdAt as string,
                      "DD-MM-YYYY (HH:MM a)"
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr class="my-3" />

            <table class="w-full mt-2">
              <thead>
                <tr>
                  <th class="text-left">#</th>
                  <th class="text-left">Item</th>
                  <th class="text-left">Qty</th>
                  <th class="text-left">Price</th>
                  <th class="text-right">Dis (%)</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order?.orders
                  .map(
                    (item, index) => `
                    <tr class="border-t mt-3">
                      <td>${index + 1}</td>
                      <td>${item.name}</td>
                      <td class="text-left">${item.quantity}</td>
                      <td class="text-left">$${item.price.toFixed(2)}</td>
                      <td class="text-right">${
                        item.discount || order?.totalDiscountPercentage || 0
                      }%</td>
                      <td class="text-right">$${(
                        item.price * item.quantity
                      ).toFixed(2)}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>

            <hr class="mb-3" />
            <table id="payment" class="table-auto w-full">
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold">Subtotal:</td>
                  <td>$${parseFloat(order?.amount as string).toFixed(2)}</td>
                </tr>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold"> (KHR) Subtotal:</td>
                  <td>៛${
                    formattedKHR(
                      parseFloat(order?.amount?.toString() ?? "0") *
                        exchangeRate
                    ) ?? 0
                  }</td>
                </tr>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold">Discount:</td>
                  <td>${order.totalDiscountPercentage ?? 0}%</td>
                </tr>

                <tr class="flex text-xl font-bold items-center justify-between w-full">
                  <td class="font-bold">Total:</td>
                  <td>$${order?.totalAmount.toFixed(2)}</td>
                </tr>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold">Paid Amount:</td>
                  <td>$${(order?.paidAmount ?? 0).toFixed(2)}</td>
                </tr>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold">Changes:</td>
                  <td>$${(order?.changeAmount ?? 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <hr class="my-3" />

            <p class="text-center font-semibold">Thank you for shopping with us!</p>
          </div>
        </div>
      `);

      printWindow?.document.write("</body></html>");
      printWindow?.document.close();
      printWindow?.addEventListener("load", () => {
        try {
          printWindow?.print();

          printWindow?.addEventListener("afterprint", () => {
            printWindow?.close();
            window.close();
          });
        } catch (error) {
          console.error("Error during printing:", error);
        }
      });
    }
  }, [order, exchangeRate]);

  return (
    <div>
      <p>Your receipt will be printed shortly...</p>
    </div>
  );
};

export default ReceiptPage;
