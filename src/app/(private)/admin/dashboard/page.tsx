"use client";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const { isAuthenticated, signOut, profile } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, []);

  const onSubmitSignOut = () => {
    signOut();
    router.push("/auth/sign-in");
  };
  console.log(profile);
  return (
    <div>
      {isAuthenticated && (
        <div>
          <p>{profile?.username}</p>
          <p>{profile?.email}</p>
          <button onClick={onSubmitSignOut}>sign out</button>
        </div>
      )}
    </div>
  );
};

export default page;
