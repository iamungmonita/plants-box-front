"use client";
import React from "react";

import CreateForm from "./Form";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[500px] w-full">
        <h2 className="text-center font-bold text-xl mb-5">
          Create Membership
        </h2>
        <CreateForm />
      </div>
    </div>
  );
};

export default Page;
