"use client";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthorized } = useAuthContext();
  if (!isAuthorized(["Cashier"])) {
    return <div>You do not have permission to view this page.</div>;
  }
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default layout;
