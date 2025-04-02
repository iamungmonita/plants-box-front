"use client";
import React from "react";

import dynamic from "next/dynamic";
const CreatePage = dynamic(() => import("../create/page"));

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full">
      <CreatePage />
    </div>
  );
};

export default Page;
