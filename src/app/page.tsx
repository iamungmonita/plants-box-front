"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    } else if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated]);
};

export default Page;
