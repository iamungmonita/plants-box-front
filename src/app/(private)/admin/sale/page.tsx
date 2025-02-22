"use client";
import { PurchasedOrderList } from "@/schema/order";
import { ProductReturnList } from "@/schema/products";
import { getProductById } from "@/services/products";
import { MdClose, MdEditDocument } from "react-icons/md";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formattedTimeStamp } from "@/helpers/format-time";
import BasicModal from "@/components/Modal";
import dynamic from "next/dynamic";
import API_URL from "@/lib/api";
import { getOrder, getPurchasedOrderByProductId } from "@/services/order";
import ReusableTable from "@/components/Table";
import { useForm } from "react-hook-form";
import { Column } from "@/constants/TableHead/Product";
import { Button, TextField } from "@mui/material";
import Head from "next/head"; // Use next/head for title
import { useTitleContext } from "@/context/TitleContext";

const Page = () => {
  const [title, setTitle] = useState("");
  const params = useParams();
  const [product, setProduct] = useState<ProductReturnList | null>(null);
  const [purchasedOrders, setPurchasedOrders] = useState<PurchasedOrderList[]>(
    []
  );
  const [toggle, setToggle] = useState(false);
  const [print, setPrint] = useState(false);
  const methods = useForm();
  const [id, setId] = useState("");

  useEffect(() => {
    if (!params?.id) return; // Ensure params are available
    setId(params.id as string); // Extract id safely
  }, [params]);

  const purchasedId = methods.watch("purchasedId");

  const columns: Column<PurchasedOrderList>[] = [
    {
      id: "purchasedId",
      label: "Purchased ID",
      minWidth: 100,
    },
    {
      id: "orders",
      label: "Sold Items",
      minWidth: 100,
      render: (_: any, row: PurchasedOrderList) => {
        return row.orders.length || "N/A";
      },
    },

    {
      id: "discount",
      label: "Discount",
      minWidth: 100,
      format: (value: number) =>
        value !== undefined && value !== null ? `${value}%` : "0%",
    },
    {
      id: "totalAmount",
      label: "Total Amount",
      minWidth: 100,
      format: (value: number) =>
        value !== undefined && value !== null
          ? `$${value.toFixed(2)}`
          : "$0.00",
    },
    {
      id: "paymentMethod",
      label: "Payment Method",
      minWidth: 100,
    },
    {
      id: "createdAt",
      label: "Purchased At",
      minWidth: 170,
      formatString: (value: string) =>
        formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
    },
    {
      id: "createdBy",
      label: "Seller",
      minWidth: 170,
    },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const orders = await getOrder({ purchasedId });
        setPurchasedOrders(orders);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProduct();
  }, [purchasedId]);

  return (
    <div>
      <div className="">
        <div className="space-y-4">
          <TextField
            className="w-1/2"
            {...methods.register("purchasedId")}
            type="text"
            label="Search Purchased ID"
            placeholder="PO-00001"
          />

          {purchasedOrders.length > 0 ? (
            <ReusableTable
              columns={columns}
              data={purchasedOrders}
              onRowClick={() =>
                console.log(purchasedOrders.map((order) => order))
              }
            />
          ) : (
            <div>No orders have been recorded for this product.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
