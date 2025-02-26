"use client";

import OrderPanel from "@/components/OrderList";
import ProfileSidebar from "@/components/ProfileSideBar";
import { ShoppingCartProduct } from "@/components/ShoppingCart";
import { useAuthContext } from "@/context/AuthContext";
import {
  clearLocalStorage,
  settlement,
  updateCartItems,
} from "@/helpers/addToCart";
import { AttachMoney, ChevronLeft, Menu, QrCode2 } from "@mui/icons-material";
import { Button, ButtonGroup, TextField } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Form from "@/components/Form";
import { PiPrinterFill } from "react-icons/pi";
import { useForm, useFormContext } from "react-hook-form";
export interface RootLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: Readonly<RootLayoutProps>) => {
  const [toggleModal, setToggleModal] = useState(false);
  const { isAuthenticated, profile } = useAuthContext();
  const [toggle, setToggle] = useState<boolean>(false);
  const [togglePanel, setTogglePanel] = useState<boolean>(false);
  const [titlePage, setTitlePage] = useState<string>("");
  const router = useRouter();
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [discountedAmount, setDiscountedAmount] = useState<number>(0);
  const [calculatedDiscount, setCalculateDiscount] = useState<number>(0);
  const [vatAmount, setVatAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const { items, total } = updateCartItems();
    setItems(items);
    setAmount(total);
    const handleCartUpdate = () => {
      const { items, total } = updateCartItems();
      setItems(items);
      setAmount(total);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

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
  const handleSettlement = (event: React.MouseEvent<HTMLButtonElement>) => {
    settlement(
      items,
      amount,
      paymentMethod,
      profile?.firstname,
      discount,
      discountedAmount,
      calculatedDiscount,
      vatAmount,
      totalAmount
    );
    setValue("discount", 0);
  };

  const routes = ["/admin/order"];
  const pathname = usePathname();
  React.useEffect(() => {
    setTogglePanel(routes.some((route) => pathname.startsWith(route)));
  }, [pathname]);
  const [paymentMethod, setPaymentMethod] = useState("khqr");
  const handleSelect = (method: string) => {
    setPaymentMethod(method);
  };
  // const methods = useForm<IShippingForm>();
  // const onSubmitForm = (data: IShippingForm) => {
  //   console.log(data);
  //   handleNext();
  // };

  const methods = useForm({
    defaultValues: { discount: 0 },
  });
  const { register, watch, setValue } = methods;
  const discount = watch("discount");

  useEffect(() => {
    const discountValue = discount !== 0 ? (amount * discount) / 100 : 0;
    const newDiscountedAmount = amount - discountValue;
    const vat = newDiscountedAmount * 0.05;
    const newTotal = newDiscountedAmount + vat;

    setCalculateDiscount(discountValue);
    setDiscountedAmount(newDiscountedAmount);
    setVatAmount(vat);
    setTotalAmount(newTotal);
  }, [discount, amount]);

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
