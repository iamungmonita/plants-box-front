"use client";
import React from "react";
import dynamic from "next/dynamic";

const CreatePage = dynamic(() => import("../create/page"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <CreatePage />
    </div>
  );
};

export default Page;
