"use client";
import ProfileSidebar from "@/components/ProfileSideBar";
import { useAuthContext } from "@/context/AuthContext";
import { Menu } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface RootLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: Readonly<RootLayoutProps>) => {
  const { isAuthenticated } = useAuthContext();
  const [toggle, setToggle] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("bg-gray");
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.classList.remove("bg-gray");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, []);

  return (
    <>
      {isAuthenticated && (
        <>
          <div className="min-h-screen w-full flex max-md:flex-col gap-y-4 relative bg-background dark:bg-darkBackground">
            <div className="max-md:hidden">
              <ProfileSidebar />
            </div>

            <main className="flex-1 px-0  bg-contentBackground dark:bg-darkContentBackground">
              <div className="p-4 relative">
                <div className="absolute right-4 justify-center hidden items-center max-md:flex rounded-lg ">
                  <Menu
                    onClick={() => setToggle(!toggle)}
                    className="max-md:block w-7 h-7 cursor-pointer dark:invert"
                  />
                </div>
                {children}
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default PrivateLayout;
