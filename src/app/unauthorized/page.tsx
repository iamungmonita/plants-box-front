// app/unauthorized.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.back();
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="mt-2 text-gray-700">You don’t have access to this page.</p>
      <p className="text-sm text-gray-500 mt-1">Redirecting back...</p>
    </div>
  );
}
