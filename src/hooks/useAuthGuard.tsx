"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routePermissions } from "@/utils/routeAuthorization";
import { useAuthContext } from "@/context/AuthContext";

export const useAuthGuard = () => {
  const router = useRouter();
  const { profile } = useAuthContext();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(true); // Start checking

    const requiredCodes = routePermissions[pathname] || [];
    const isAllowed =
      requiredCodes.length === 0 ||
      requiredCodes.some((code) => profile?.codes.includes(code));

    const timeout = setTimeout(() => {
      if (!isAllowed) {
        router.replace("/unauthorized");
      } else {
        setChecking(false); // Done checking
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [profile, pathname]);

  return { checking };
};
