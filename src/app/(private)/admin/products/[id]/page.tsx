"use client";
import { PurchasedOrderList } from "@/schema/order";
import { ProductReturnList } from "@/schema/products";
import { getProductById } from "@/services/products";
import { MdClose, MdEditDocument } from "react-icons/md";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formattedTimeStamp } from "@/helpers/format/time";

import API_URL from "@/lib/api";
import { getPurchasedOrderByProductId } from "@/services/order";
import ReusableTable from "@/components/Table";
import { useForm } from "react-hook-form";
import { Column } from "@/constants/TableHead/Product";
import { Button, TextField } from "@mui/material";
import { CreateForm } from "../create/Form";
import { useAuthContext } from "@/context/AuthContext";
import InputField from "@/components/InputText";
import Form from "@/components/Form";

const Page = () => {
  const { isAuthorized } = useAuthContext();
  const [title, setTitle] = useState("");
  const params = useParams();
  const [product, setProduct] = useState<ProductReturnList | null>(null);
  const [purchasedOrders, setPurchasedOrders] = useState<PurchasedOrderList[]>(
    []
  );
  const methods = useForm({
    defaultValues: {
      purchasedId: "",
    },
  });
  const { watch } = methods;
  const purchasedId = watch("purchasedId");
  const [id, setId] = useState("");

  useEffect(() => {
    if (!params?.id) return; // Ensure params are available
    setId(params.id as string); // Extract id safely
  }, [params]);

  const columns: Column<PurchasedOrderList>[] = [
    {
      id: "purchasedId",
      label: "Purchased ID",
      minWidth: 100,
    },

    {
      id: "orders",
      label: "Sold Qty",
      minWidth: 100,
      render: (_: any, row: PurchasedOrderList) => {
        const matchingId = row.orders.find((order) => order._id === id);
        return matchingId ? (
          <p key={matchingId._id}>{matchingId.quantity}</p>
        ) : (
          <p>No match</p>
        );
      },
    },
    {
      id: "createdAt",
      label: "Purchased At",
      minWidth: 170,
      formatString: (value: string) =>
        formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
    },
  ];

  // const purchasedId = methods.watch("purchasedId");
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const [productData, orders] = await Promise.all([
          getProductById(id),
          getPurchasedOrderByProductId(id, purchasedId || ""),
        ]);
        setProduct(productData);
        setPurchasedOrders(orders);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProduct();
  }, [id, purchasedId]);

  useEffect(() => {
    if (product) {
      setTitle((document.title = product.name ?? "Create Next Page"));
    }
  }, [product]);
  if (!product) return <div>Loading product...</div>;
  // if (!isAuthorized(["seller"])) {
  //   return <div>You do not have permission to view this page.</div>;
  // }
  return (
    <div>
      <div className="grid grid-cols-2 p-4 gap-4 max-xl:grid-cols-1">
        <div className="shadow p-4 space-y-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl">{title}</h2>
          </div>
          <CreateForm createId={product._id} />
        </div>
        <div className="space-y-4">
          <Form methods={methods}>
            <InputField
              // className="w-1/2"
              // {...methods.register("purchasedId")}
              type="text"
              name="purchasedId"
              label="Search Purchased ID"
              placeholder="PO-00001"
            />
          </Form>

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
