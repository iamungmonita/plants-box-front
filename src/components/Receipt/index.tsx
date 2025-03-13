import { formattedKHR } from "@/helpers/format/currency";
import { formattedTimeStamp } from "@/helpers/format/time";
import { PurchasedOrderList } from "@/models/Order";
import React from "react";

interface PrintButtonProps {
  order: PurchasedOrderList | null;
  exchangeRate: number;
}

const PrintButton: React.FC<PrintButtonProps> = ({ order, exchangeRate }) => {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "", "width=800,height=600");

    // Inject Tailwind CSS into the print window
    printWindow?.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
    `);

    // Inject receipt HTML content with dynamic data
    printWindow?.document.write(`
      <div id="receipt">
        <h2>${order?.purchasedId}</h2>
        <div class="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">
          <p id="header" class="font-black text-center text-lg uppercase my-5">Plants Box</p>
          <p class="text-center">St.478 TTP 1 Chamkarmon PP</p>
          <p class="text-center">All items sold as is no refunds and exchanges.</p>
          <p class="text-center">Phone: 098365155</p>
          <div class="flex items-center justify-center">
            <hr class="border-dashed border-gray-400 flex-grow-0 w-1/4" />
            <strong>Invoice</strong>
            <hr class="border-dashed border-gray-400 flex-grow-0 w-1/4" />
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
                  <td class="font-semibold">Customer:</td>
                  <td>${
                    order?.member
                      ? `${order?.member.fullname} (${order?.member.type})`
                      : "Walk-in Customer"
                  }</td>
                </tr>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold">Mobile Number:</td>
                  <td>${order?.member ? order?.member.phoneNumber : "-"}</td>
                </tr>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold">Payment Method:</td>
                  <td>${order?.paymentMethod.toUpperCase()}</td>
                </tr>
                <tr class="flex items-center justify-between w-full">
                  <td class="font-semibold">Seller:</td>
                  <td>${order?.createdBy}</td>
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
                    item.discount || order?.totalDiscountValue || 0
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
                    parseFloat(order?.amount?.toString() ?? "0") * exchangeRate
                  ) ?? 0
                }</td>
              </tr>
              <tr class="flex items-center justify-between w-full">
                <td class="font-semibold">Discount:</td>
                <td>${order?.totalDiscountPercentage ?? 0}%</td>
              </tr>
              <tr class="flex items-center justify-between w-full">
                <td class="font-semibold">Points:</td>
                <td>$${(order?.totalPoints ?? 0).toFixed(2)}</td>
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

    // Close the HTML tags and initiate the print command
    printWindow?.document.write("</body></html>");
    printWindow?.document.close(); // Close document to load the content
    printWindow?.print(); // Initiates the print dialog
  };

  return <button onClick={handlePrint}>Print Receipt</button>;
};

export default PrintButton;
