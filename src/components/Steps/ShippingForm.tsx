import React, { useState } from "react";
import { FiCheckCircle, FiShoppingCart, FiPrinter } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ShippingForm = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm text-center">
        {/* Success Icon */}
        <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
        <p className="text-gray-500 mt-2">
          Your order has been placed successfully.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 p-4 rounded-lg my-4 text-gray-700 text-sm">
          <p>
            <span className="font-semibold">Order ID:</span> #ORD-123456
          </p>
          <p>
            <span className="font-semibold">Date:</span> Feb 20, 2024
          </p>
          <p>
            <span className="font-semibold">Payment Method:</span> Credit Card
            (Visa)
          </p>
          <p>
            <span className="font-semibold">Total Amount:</span> $129.99
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link href="/orders">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              <FiShoppingCart /> View Order
            </button>
          </Link>

          <Link href="/products">
            <button className="w-full bg-gray-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition">
              Continue Shopping
            </button>
          </Link>

          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
            onClick={() => window.print()}
          >
            <FiPrinter /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
