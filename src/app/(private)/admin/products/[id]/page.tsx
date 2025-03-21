"use client";
import { getProductById } from "@/services/products";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formattedTimeStamp } from "@/helpers/format/time";
import ReusableTable from "@/components/Table";
import { useForm } from "react-hook-form";
import { Column } from "@/constants/TableHead/Product";
import { CreateForm } from "../../../../../components/Form/Product";
import { ProductResponse } from "@/models/Product";

const Page = () => {
  const [title, setTitle] = useState("");
  const params = useParams();
  const [product, setProduct] = useState<ProductResponse | null>(null);
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

  const columns: Column<{
    updateNumber: number;
    addedStock: number;
    oldStock: number;
    createdAt: string;
    updatedAt: string;
  }>[] = [
    {
      id: "updateNumber",
      label: "Update No.",
      minWidth: 100,
    },
    {
      id: "oldStock",
      label: "Old Stock",
      minWidth: 100,
    },
    {
      id: "addedStock",
      label: "Added Stock",
      minWidth: 100,
    },

    {
      id: "updatedAt",
      label: "Updated At",
      minWidth: 170,
      formatString: (value: string) =>
        formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
    },
  ];

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.data) {
          setProduct(response.data);
        }
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
          </div>
          <CreateForm createId={product._id} />
        </div>
        <div className="space-y-4">
          <ReusableTable columns={columns} data={product.updatedCount} />
        </div>
      </div>
    </div>
  );
};

export default Page;
