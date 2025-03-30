"use client";
import { ScreenProvider, useScreenContext } from "@/context/ScreenContext";
import { ShoppingCartProduct } from "@/models/Cart";
import React, { useEffect, useState } from "react";

const Page = () => {
  return (
    <ScreenProvider>
      <div>
        <ScreenContent />
      </div>
    </ScreenProvider>
  );
};
const ScreenContent = () => {
  const { cart } = useScreenContext();
  return <div>{cart.map((row) => row.name)}</div>;
};

export default Page;
