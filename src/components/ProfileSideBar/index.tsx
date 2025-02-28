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
import CustomButton from "../Button";
import BasicModal from "../Modal";
import ExchangeRate from "../Modals/ExchangeRate";

function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapse, setIsCollapse] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set()); // Track multiple open dropdowns
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const { signOut, profile } = useAuthContext();

  const collapsibleCtx = classNames({
    "max-w-20 ": isCollapse,
    [Style["is-collapse"]]: isCollapse,
    "max-w-[250px] max-md:max-w-full h-full": !isCollapse,
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
      <BasicModal
        content={<ExchangeRate onCloseModal={() => setToggleModal(false)} />}
        open={toggleModal}
        onClose={() => setToggleModal(false)}
      />

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
              openDropdowns.has("settings") ? Style.open : ""
            }`}
          >
            <button
              type="button"
              onClick={() => toggleDropdown("log")}
              className="flex items-center justify-between w-full px-4 py-3  text-base text-gray-900 transition duration-300 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Log
              <MdOutlineKeyboardArrowRight
                className={`${
                  openDropdowns.has("log") ? "rotate-90" : "-rotate-60"
                } dark:invert transition-transform`}
              />
            </button>
            {openDropdowns.has("log") && (
              <ul>
                <li className="!pl-6">
                  <Link href="/admin/log/initial-balance">
                    Initial Balance Count
                  </Link>
                </li>
                <li className="!pl-6">
                  <Link href="/admin/log/daily-log">In-Out Log</Link>
                </li>
              </ul>
            )}
          </div>
          <div
            className={`${Style.dropdown} ${
              openDropdowns.has("settings") ? Style.open : ""
            }`}
          >
            <button
              type="button"
              onClick={() => toggleDropdown("settings")}
              className="flex items-center justify-between w-full px-4 py-3  text-base text-gray-900 transition duration-300 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Settings
              <MdOutlineKeyboardArrowRight
                className={`${
                  openDropdowns.has("settings") ? "rotate-90" : "-rotate-60"
                } dark:invert transition-transform`}
              />
            </button>
            {openDropdowns.has("settings") && (
              <ul>
                <li className="!pl-6">
                  <Link href="/admin/settings/users">Users</Link>
                </li>
                <li className="!pl-6">
                  <Link href="/admin/settings/roles">Roles</Link>
                </li>
              </ul>
            )}
          </div>
        </ul>

        <div className="mb-10 space-y-4">
          <CustomButton
            onHandleButton={() => setToggleModal(true)}
            text="Set Exchange Rate"
            theme="general"
          />
          <CustomButton
            onHandleButton={onLogoutOut}
            text="Log Out"
            theme="dark"
          />
        </div>
      </div>
    </aside>
  );
}

export default ProfileSidebar;
