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
import { getPurchasedOrderByProductId } from "@/services/order";
import ReusableTable from "@/components/Table";
import { useForm } from "react-hook-form";
import { Column } from "@/constants/TableHead/Product";
import { Button, TextField } from "@mui/material";
import Head from "next/head"; // Use next/head for title
import { useTitleContext } from "@/context/TitleContext";
import { CreateForm } from "../create/Form";
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

  const columns: Column<PurchasedOrderList>[] = [
    {
      id: "purchasedId",
      label: "Purchased ID",
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
      id: "orders",
      label: "Qty",
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
  ];

  const purchasedId = methods.watch("purchasedId");
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

  return (
    <div>
      <div className="grid grid-cols-2 p-4 gap-4 max-xl:grid-cols-1">
        <div className="shadow p-4 space-y-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl">{title}</h2>
            <Button
              onClick={() => setToggle(!toggle)}
              variant="outlined"
              sx={{
                backgroundColor: "var(--medium-light)",
                color: "white",
                padding: 1,
                border: "none",
              }}
            >
              {!toggle ? (
                <MdEditDocument className="text-2xl" />
              ) : (
                <MdClose className="text-2xl" />
              )}
            </Button>
          </div>
          <div>
            {toggle ? (
              <div>
                <CreateForm createId={product._id} />
              </div>
            ) : (
              <div>
                <div>
                  <p>Description: {product.description}</p>
                  <p>Price: ${Number(product.price).toFixed(2)}</p>
                  <p>Stock: {product.stock}</p>
                  <p>Instruction: {product.instruction}</p>
                  <p>Size: {product.size}</p>
                </div>
                <div>
                  <p>Created At: {product.createdAt}</p>
                  <p>Updated At: {product.updatedAt}</p>
                </div>
                <div className="grid grid-cols-5">
                  {product.pictures?.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 cursor-grab">
                      <Image
                        src={`${API_URL}${img}`}
                        alt="Product Image"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover rounded shadow-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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

      <BasicModal
        open={print}
        onClose={() => setPrint(false)}
        content={<div>Print Content</div>}
      />
    </div>
  );
};

export default Page;
