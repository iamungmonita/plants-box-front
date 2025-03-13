"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";
const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/sign-in");
  }, []);
  return <></>;
};

export default Page;
