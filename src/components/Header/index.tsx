"use client";
import { CloseSharp } from "@mui/icons-material";

import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import NavLink from "../NavLink";
import { nav } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import Mobile from "./Mobile";
import Link from "next/link";
import { PiMagnifyingGlass, PiShoppingCartSimple } from "react-icons/pi";
import ShoppingCart from "../ShoppingCart";

export interface ISearchBar {
  search: string;
}
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [toggleSearchBar, setToggleSearchBar] = useState(false);
  const [toggleShoppingCart, setToggleShoppingCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const methods = useForm<ISearchBar>();
  const { watch, register } = methods;
  const search = watch("search");

  // hidden routes
  const routes = ["/admin", "/auth"];
  const pathname = usePathname();
  if (routes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    // Hide Menu on mount and when screen width is > 768px
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMenu(false); // Hide menu on larger screens
      } else {
        setShowMenu(true); // Show menu on small screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Trigger resize handler on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        className={`w-full sticky top-0 transition-all duration-300 ease-in-out z-30 bg-green-900 ${
          isScrolled
            ? "backdrop-blur-md shadow-md bg-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 grid-cols-2 justify-between min-h-20 items-center p-4 relative">
          <Link href="/" className="main_text text-green-800">
            Plants Box
          </Link>
          <ul className="grid grid-cols-4 gap-10 max-md:hidden">
            {nav.map((nav) => (
              <NavLink
                id={nav.id}
                key={nav.id}
                name={nav.name}
                path={nav.path}
                className="text-red-200"
              />
            ))}
          </ul>
          <div className="flex items-center gap-4 justify-end">
            <div>
              <PiMagnifyingGlass
                className="text-2xl"
                onClick={() => setToggleSearchBar(!toggleSearchBar)}
              />
            </div>
            <div onClick={() => setToggleShoppingCart(true)}>
              <PiShoppingCartSimple className="text-2xl" />
            </div>
          </div>
        </div>
        <div
          className={`${
            toggleShoppingCart
              ? " opacity-100 fixed top-0 left-0 backdrop-blur-sm min-h-screen"
              : "opacity-0"
          }  w-full h-full  duration-500 ease-in-out animation-animate`}
        ></div>
        <div
          className={`fixed ease-in-out bg-white w-full xl:px-28 duration-500  ${
            toggleSearchBar
              ? "top-20 opacity-100 min-h-screen "
              : "top-10 opacity-0 -z-20"
          }`}
        >
          <div className="col-span-6">
            <input
              type="text"
              {...register("search")}
              className="w-full border-b p-4 outline-none text-sm"
              placeholder="looking for any plant in particular..."
            />
          </div>
        </div>
      </header>
      {showMenu && (
        <Mobile
          setToggleSearchBar={setToggleSearchBar}
          toggleSearchBar={toggleSearchBar}
        />
      )}

      <div
        className={`${
          toggleShoppingCart ? "right-0" : "right-[-100%]"
        } duration-500 flex items-start justify-between backdrop-blur-sm shadow fixed bg-white top-0 min-h-screen min-w-[400px] p-4 z-50 animation-animate ease-in-out`}
      >
        <ShoppingCart />
        <span onClick={() => setToggleShoppingCart(false)}>
          <CloseSharp />
        </span>
      </div>
    </>
  );
};

export default Header;
