"use client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import { useAuthContext } from "@/context/AuthContext";

import Style from "./style.module.scss";
import Image from "next/image";
import { sidebar } from "@/constants/sidebar";
import { Button } from "@mui/material";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

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
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dropdown)) {
        newSet.delete(dropdown); // Close dropdown if it's already open
      } else {
        newSet.add(dropdown); // Open the dropdown
      }
      return newSet;
    });
  };

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
            src="/assets/plant.jpg"
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
              className="py-3 border-b px-4 rounded hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}
          <div
            className={`${Style.dropdown} ${
              openDropdowns.has("system") ? Style.open : ""
            }`}
          >
            <button
              type="button"
              onClick={() => toggleDropdown("system")}
              className="flex items-center justify-between w-full px-4 py-3  text-base text-gray-900 transition duration-300 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              system
              <MdOutlineKeyboardArrowRight
                className={`${
                  openDropdowns.has("system") ? "rotate-90" : "-rotate-60"
                } dark:invert transition-transform`}
              />
              {/* <Image
                src="/assets/icons/arrow-right.svg"
                width="12"
                height="12"
                alt=""
                className={`${
                  openDropdowns.has("system") ? "-rotate-90" : "rotate-90"
                } dark:invert transition-transform`}
              /> */}
            </button>
            {openDropdowns.has("system") && (
              <ul>
                <li className="!pl-6">
                  <Link href="/admin/system/users">Users</Link>
                </li>
                <li className="!pl-6">
                  <Link href="/admin/system/roles">Roles</Link>
                </li>
              </ul>
            )}
          </div>
        </ul>

        {/* Logout Button (Pushed to Bottom) */}
        <div className="mb-10">
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
