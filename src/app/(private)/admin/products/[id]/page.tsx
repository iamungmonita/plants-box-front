"use client";

import { getProductById } from "@/services/products";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/Table";
import { singleProductColumn } from "@/constants/TableHead/Product";
import { CreateForm } from "../../../../../components/Form/Product";
import useFetch from "@/hooks/useFetch";
import AlertPopUp from "@/components/AlertPopUp";

const Page = () => {
  const [title, setTitle] = useState("");
  const [toggleAlert, setToggleAlert] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;
  const { asObject: product, error: fetchError } = useFetch(
    getProductById,
    { params: { id: id } },
    [id]
  );

  useEffect(() => {
    if (!id) return;
    if (product) {
      setTitle((document.title = product.name ?? "Create Next Page"));
    } else if (fetchError) {
      setAlertMessage(fetchError);
      setToggleAlert(true);
      setError(true);
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  }, [id, fetchError]);

  return (
    <div>
      <AlertPopUp
        open={toggleAlert}
        onClose={() => setToggleAlert(false)}
        message={alertMessage}
        error={error}
      />
      <div className="grid grid-cols-2 p-4 gap-4 max-xl:grid-cols-1">
        <div className="shadow p-4 space-y-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl">{title}</h2>
          </div>
          <CreateForm createId={id} />
        </div>
        <div className="space-y-4">
          <ReusableTable
            columns={singleProductColumn}
            data={product ? product.updatedCount : []}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
