"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import BasicModal from "@/components/Modal";

const page = () => {
  return (
    <div className="w-full grid-cols-2 grid max-md:grid-cols-1">
      <div>
        <button type="button">toggle create page</button>
      </div>
      <div>2</div>
    </div>
  );
};

export default page;
