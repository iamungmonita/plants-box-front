"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated) {
        router.push("/admin/dashboard");
      } else {
        router.push("/auth/sign-in");
      }
    }, 3000);
  }, []);
  return (
    <div className="text-center">
      <h2 className="text-6xl font-bold">404</h2>
      <h2 className="text-sm font-normal">
        The page you are looking does not exist.
      </h2>
    </div>
  );
}
