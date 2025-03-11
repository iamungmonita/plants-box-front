"use client";
import React, { useEffect, useState } from "react";

import ReceiptPrinter from "@/components/Print";
import { getOrder } from "@/services/order";
import query from "query-string";

import { useCartItems } from "@/hooks/useCartItems";
const page = () => {
  const [base, setBase] = useState<string | null>(null);
  const { items } = useCartItems();
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string); // Resolve with Base64 string
      };

      reader.onerror = (error) => {
        reject(error); // Reject on error
      };

      reader.readAsDataURL(file); // Convert file to Base64
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setBase(base64);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };
  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrder();
      console.log(response);
    };
    fetchOrder();
  }, []);

  const params = { name: "daisy", type: "exterior", category: "plant" };
  const queryString = query.stringify(params);
  console.log(`localhost:4002/product/retrieve?${queryString}`);
  return (
    <div>
      <div>
        <ReceiptPrinter items={items} />
      </div>
    </div>
  );
};

export default page;
