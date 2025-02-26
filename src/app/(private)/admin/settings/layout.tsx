"use client";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthorized } = useAuthContext();
  if (!isAuthorized(["owner"])) {
    return <div>You do not have permission to view this page.</div>;
  }
  return (
    <div>
      <p>this is layout for system</p>
      <div>{children}</div>
    </div>
  );
};

export default layout;
