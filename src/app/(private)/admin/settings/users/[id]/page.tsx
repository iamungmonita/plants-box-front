"use client";
import React from "react";
import dynamic from "next/dynamic";

const CreatePage = dynamic(() => import("../create/page"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <div className="grid grid-cols-2 p-4 gap-4 max-xl:grid-cols-1">
        <div className="shadow p-4 space-y-4">
          <div className="flex items-center justify-between w-full"></div>
          <CreatePage />
        </div>
      </div>
    </div>
  );
};

export default Page;
