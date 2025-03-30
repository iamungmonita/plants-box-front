"use client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { settingPaths, sidebar } from "@/constants/Sidebar";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import {
  MdClose,
  MdCurrencyExchange,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { useAuthContext } from "@/context/AuthContext";
import CustomButton from "../Button";
import BasicModal from "../Modal";
import ExchangeRate from "../Modals/ExchangeRate";
import { formattedKHR } from "@/helpers/format/currency";

function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapse] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set()); // Track multiple open dropdowns
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const { signOut } = useAuthContext();
  const exchangeRate = useExchangeRate();
  const collapsibleCtx = classNames({
    "max-w-20 ": isCollapse,
    "max-w-[220px] max-md:max-w-full h-full": !isCollapse,
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
    <aside className={classNames(collapsibleCtx, "md:relative shadow-lg p-4")}>
      <BasicModal
        ContentComponent={ExchangeRate}
        open={toggleModal}
        onClose={() => setToggleModal(false)}
      />

      <div className={` flex flex-col h-full`}>
        <div className="h-[140px] justify-center py-4 px-6 flex items-center max-md:hidden -mt-2 -ml-2 w-[calc(100%+1.125rem)] mb-4">
          <Image
            src="/assets/plant.jpg"
            alt="/assets/logo/logo-text"
            className="dark:invert"
            width={120}
            height={120}
          />
        </div>
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
              className="py-2 border-t px-4 hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}

          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("settings")}
              className="flex items-center border-t justify-between w-full px-4 py-2 text-base text-gray-900 transition duration-300 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Settings
              <MdOutlineKeyboardArrowRight
                className={`${
                  openDropdowns.has("settings") ? "rotate-90" : "-rotate-60"
                } dark:invert transition-transform`}
              />
            </button>
            {openDropdowns.has("settings") && (
              <ul className="flex flex-col">
                {settingPaths.map((setting) => (
                  <Link
                    key={setting.path}
                    style={{
                      backgroundColor: isActive(
                        `/admin/settings/${setting.path}`
                      )
                        ? "var(--medium-light)"
                        : "",
                      color: isActive(`/admin/settings/${setting.path}`)
                        ? "white"
                        : "",
                    }}
                    className="py-2 !pl-8 flex items-center gap-4 capitalize border-t px-4 cursor-pointer hover:bg-gray-100"
                    href={`/admin/settings/${setting.path}`}
                  >
                    {setting.path}
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </ul>
        <span className="justify-end bg-gray-100 px-4 py-2 flex items-center">
          <MdCurrencyExchange className="mr-2" /> ៛{formattedKHR(exchangeRate)}
        </span>
        <div className="mb-10 space-y-4">
          <CustomButton
            onHandleButton={() => setToggleModal(true)}
            roleCodes={["1016"]}
            text="Exchange Rate"
            theme="general"
          />
          <CustomButton
            onHandleButton={onLogoutOut}
            text="Log Out"
            theme="alarm"
          />
        </div>
      </div>
    </aside>
  );
}

export default ProfileSidebar;
