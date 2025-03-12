"use client";

import React from "react";
import { useParams } from "next/navigation";
import { CreateForm } from "../../../../../components/Form/Product";
const Page: React.FC = () => {
  const searchParam = useParams();
  const createId = searchParam.id as string;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-[600px] w-full">
        {!createId && (
          <h2 className="text-center text-lg font-extrabold uppercase mb-10">
            Create Product
          </h2>
        )}
        <CreateForm createId={createId} />
      </div>
    </div>
  );
};

export default Page;
