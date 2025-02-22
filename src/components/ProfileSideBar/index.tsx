"use client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";

import { useAuthContext } from "@/context/AuthContext";

import Style from "./style.module.scss";
import Image from "next/image";
import { sidebar } from "@/constants/sidebar";
import { Button } from "@mui/material";

function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapse, setIsCollapse] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set()); // Track multiple open dropdowns

  const { signOut, profile } = useAuthContext();

  const collapsibleCtx = classNames({
    "max-w-20 ": isCollapse,
    [Style["is-collapse"]]: isCollapse,
    "min-w-[250px] max-md:max-w-full h-full": !isCollapse,
  });

  function onLogoutOut() {
    signOut();
    router.push("/auth/sign-in");
  }

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside
      className={classNames(
        collapsibleCtx,
        "md:relative shadow-lg",
        Style["sidebar-wrapper"]
      )}
    >
      <div className={`${Style["sidebar-content"]} flex flex-col h-full`}>
        {/* Logo Section */}
        <div className="h-[140px] py-4 px-6 flex items-center max-md:hidden -mt-2 -ml-2 w-[calc(100%+1.125rem)] mb-4">
          <Image
            src="/plant.jpg"
            alt="/assets/logo/logo-text"
            className="dark:invert"
            width={100}
            height={100}
          />
        </div>

        {/* Sidebar Items (Takes Up Remaining Space) */}
        <ul className="flex flex-col flex-grow">
          {sidebar.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              style={{
                backgroundColor: isActive(item.path)
                  ? "var(--medium-light)"
                  : "",
                color: isActive(item.path) ? "white" : "",
              }}
              className="py-3 border-b px-4 rounded"
            >
              {item.name}
            </Link>
          ))}
        </ul>

        {/* Logout Button (Pushed to Bottom) */}
        <div className="">
          <Button
            variant="text"
            sx={{
              fontFamily: "var(--text)",
              backgroundColor: "gray",
              color: "white",
              padding: 1.5,
              width: "100%",
            }}
            onClick={() => onLogoutOut()}
          >
            Log Out
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default ProfileSidebar;
