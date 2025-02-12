"use client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";

import { useAuthContext } from "@/context/AuthContext";

import Style from "./style.module.scss";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import CustomizedAccordions from "../Accordion";
import { Accordion } from "@mui/material";

function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapse, setIsCollapse] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set()); // Track multiple open dropdowns

  const { signOut } = useAuthContext();

  const collapsibleCtx = classNames({
    "max-w-20 ": isCollapse,
    [Style["is-collapse"]]: isCollapse,
    "max-w-[200px] max-md:max-w-full h-full": !isCollapse,
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
    <>
      <aside
        className={classNames(
          collapsibleCtx,
          "md:relative",
          Style["sidebar-wrapper"]
        )}
      >
        <div className={Style["sidebar-content"]}>
          <div className="h-[140px] py-4 px-6 flex items-center max-md:hidden -mt-2 -ml-2 w-[calc(100%+1.125rem)] border-b-[1px] border-borders dark:border-neutral-700 mb-4">
            <Image
              src="/plant.jpg"
              alt="/assets/logo/logo-text"
              className="dark:invert"
              width={100}
              height={100}
            />
          </div>
          <ul>
            <Link href="/admin/dashboard">
              <li
                className={
                  isActive("/admin/dashboard") ? Style["isActive"] : ""
                }
              >
                Dashboard
              </li>
            </Link>
            {/* <div
              className={`${Style.dropdown} ${
                openDropdowns.has("sales") ? Style.open : ""
              }`}
            >
              <button
                className="flex justify-between items-center w-full"
                onClick={() => toggleDropdown("sales")}
              >
                Sales
                <span
                  className={`${
                    openDropdowns.has("sales") ? "rotate-90" : "-rotate-15"
                  } `}
                >
                  <FiChevronRight width={12} height={12} />
                </span>
              </button>
              {openDropdowns.has("sales") && (
                <ul>
                  <li className="!pl-6">
                    <Link href="/admin/order/">Transactions</Link>
                  </li>
                  <li className="!pl-6">
                    <Link href="/admin/summary/">Summary</Link>
                  </li>
                </ul>
              )}
            </div> */}
            <Link href="/admin/products">
              <li
                className={isActive("/admin/products") ? Style["isActive"] : ""}
              >
                Products
              </li>
            </Link>
            {/* <Link href="/admin/vending-machine">
              <li
                className={
                  isActive("/admin/vending-machine") ? Style["isActive"] : ""
                }
              >
                Vending Machine
              </li>
            </Link> */}
            {/* <div
              className={`${Style.dropdown} ${
                openDropdowns.has("coupons") ? Style.open : ""
              }`}
            >
              <button
                className="flex justify-between items-center w-full"
                onClick={() => toggleDropdown("coupons")}
              >
                Coupons
                <span
                  className={`${
                    openDropdowns.has("coupons") ? "rotate-90" : "-rotate-15"
                  } `}
                >
                  <FiChevronRight width={12} height={12} />
                </span>
              </button>
              {openDropdowns.has("coupons") && (
                <ul>
                  <li className="!pl-6">
                    <Link href="/admin/coupons">All Coupons</Link>
                  </li>
                  <li className="!pl-6">
                    <Link href="/admin/coupons/redemption">Redemption</Link>
                  </li>
                </ul>
              )}
            </div> */}

            {/* <div
              className={`${Style.dropdown} ${
                openDropdowns.has("inventory") ? Style.open : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("inventory")}
                className="flex items-center justify-between w-full text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Inventory
                <Image
                  src="/assets/icons/arrow-right.svg"
                  width="12"
                  height="12"
                  alt=""
                  className={`${
                    openDropdowns.has("inventory") ? "-rotate-90" : "rotate-90"
                  } dark:invert transition-transform`}
                />
              </button>
              {openDropdowns.has("inventory") && (
                <ul>
                  <li className="!pl-6">
                    <Link href="/admin/inventory/suppliers">Suppliers</Link>
                  </li>
                  <li className="!pl-6">
                    <Link href="/admin/inventory/warehouse">Warehouse</Link>
                  </li>
                  <li className="!pl-6">
                    <Link href="/admin/inventory/purchase-orders">
                      Purchase Order
                    </Link>
                  </li>
                </ul>
              )}
            </div> */}

            <div
              className={`${Style.dropdown} ${
                openDropdowns.has("settings") ? Style.open : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("settings")}
                className="flex items-center justify-between w-full text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Settings
                <Image
                  src="/assets/icons/arrow-right.svg"
                  width="12"
                  height="12"
                  alt=""
                  className={`${
                    openDropdowns.has("settings") ? "-rotate-90" : "rotate-90"
                  } dark:invert transition-transform`}
                />
              </button>
              {openDropdowns.has("settings") && (
                <ul>
                  <li className="!pl-6">
                    <Link href="/admin/settings/users">Users</Link>
                  </li>
                </ul>
              )}
            </div>
            <li onClick={onLogoutOut}>Logout</li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default ProfileSidebar;
