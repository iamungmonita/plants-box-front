"use client";
import { ArrowRight, ChevronLeft, CloseSharp } from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import NavLink from "../NavLink";
import { nav } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import Mobile from "./Mobile";
import Link from "next/link";
import { PiMagnifyingGlass, PiShoppingCartSimple } from "react-icons/pi";
import ShoppingCart, { ShoppingCartProduct } from "../ShoppingCart";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import Button from "@mui/material/Button";
import { clearLocalStorage, updateCartItems } from "@/helpers/addToCart";
import { GrClose } from "react-icons/gr";
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
  const [itemNo, setItemNo] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const cartRef = useRef<HTMLDivElement>(null); // Ref for the cart container

  const search = watch("search");

  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
      background-color: green;
    }
  `;

  useEffect(() => {
    const { items, total } = updateCartItems(); // Call on mount
    setItemNo(items.length);
    setAmount(total);

    // Listen for cart updates
    const handleCartUpdate = () => {
      const { items, total } = updateCartItems();
      setItemNo(items.length);
      setAmount(total);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  function IconButtonWithBadge({ onClick }: { onClick: () => void }) {
    return (
      <IconButton
        onClick={onClick}
        sx={{
          "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
        }}
      >
        <PiShoppingCartSimple className="text-2xl" />
        <CartBadge badgeContent={itemNo} color="primary" overlap="circular" />
      </IconButton>
    );
  }

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

  const handleClose = () => {
    setToggleShoppingCart(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setToggleShoppingCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleShoppingCart]);
  return (
    <>
      <header
        className={`w-full sticky top-0 transition-all duration-300 ease-in-out z-40 bg-green-900 ${
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
            <PiMagnifyingGlass
              className={`${
                toggleSearchBar ? "rotate-45" : "rotate-0"
              } transition-all duration-500 text-2xl`}
              onClick={() => setToggleSearchBar(!toggleSearchBar)}
            />
            <IconButtonWithBadge onClick={() => setToggleShoppingCart(true)} />
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
          className={`fixed ease-in-out bg-white w-full xl:px-28 duration-500 ${
            toggleSearchBar
              ? "top-20 opacity-100 min-h-screen "
              : "top-10 opacity-0 -z-20"
          }`}
        >
          <div className="col-span-6 flex p-4  border-b">
            <input
              type="text"
              {...register("search")}
              className="w-full outline-none text-sm"
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
      {toggleShoppingCart && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"
          onClick={() => setToggleShoppingCart(false)} // Clicking outside closes cart
        />
      )}
      <div
        ref={cartRef}
        className={`${
          toggleShoppingCart ? "right-0" : "right-[-100%]"
        } duration-500 flex flex-col items-start justify-between
  shadow fixed bg-white top-0 min-h-screen w-[400px] p-4 gap-4 z-50 animation-animate ease-in-out`}
      >
        {/* Header Section */}

        <div className="text-2xl flex justify-between items-center w-full">
          <span>
            <ChevronLeft
              className="cursor-pointer text-3xl"
              onClick={() => setToggleShoppingCart(false)}
            />
          </span>
          <h2 className="mr-2"> Shopping Cart</h2>
        </div>

        {/* Shopping Cart Items Section */}
        <div className="flex flex-col w-full flex-grow overflow-y-auto items-start">
          <ShoppingCart onClose={handleClose} />
        </div>

        {/* Checkout & Buttons Section */}
        <div className="h-full w-full row-span-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold py-2 justify-end gap-2 w-full flex items-center">
              <span>Total: </span>${amount.toFixed(2)}
            </h2>

            <Button
              disabled={itemNo <= 0}
              onClick={() => setToggleShoppingCart(false)}
              className="w-full"
              variant="outlined"
              sx={{
                backgroundColor: "var(--secondary)",
                color: "white",
                fontFamily: "var(--text)",
                padding: 1.5,
              }}
              type="button"
            >
              <Link href={"/checkout"}> Check Out</Link>
            </Button>

            <div className="w-full grid grid-cols-2 gap-4">
              <Button
                className="col-span-1"
                onClick={() => clearLocalStorage()}
                variant="outlined"
                sx={{
                  backgroundColor: "gray",
                  color: "white",
                  fontFamily: "var(--text)",
                  padding: 1,
                  border: "none",
                }}
                type="button"
                disabled={itemNo <= 0}
              >
                Remove All
              </Button>
              <Button
                variant="outlined"
                onClick={() => setToggleShoppingCart(false)}
                sx={{
                  borderColor: "var(--secondary)",
                  color: "var(--secondary)",
                  fontFamily: "var(--text)",
                  padding: 1,
                }}
                type="button"
              >
                <Link href="/products" className="col-span-1">
                  {itemNo <= 0 ? "Go Shopping" : "Shop More"} <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
