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
import { useForm } from "react-hook-form";
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
      profile?.username,
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
            {togglePanel && (
              <div
                className={`flex flex-col items-start justify-between shadow  bg-white  min-h-screen w-[400px] p-4 gap-4 `}
              >
                {/* Header Section */}

                <div className="text-2xl flex justify-between items-center w-full">
                  <h2 className="mr-2">Order Panel ({items.length})</h2>
                </div>

                {/* Shopping Cart Items Section */}
                <div className="flex flex-col w-full flex-grow overflow-y-auto items-start">
                  <OrderPanel />
                </div>
                <Form methods={methods} className="w-full">
                  <div className="flex items-center justify-end gap-4 ">
                    <h2 className="text-lg">Discount:</h2>
                    <TextField
                      {...register("discount")}
                      type="text"
                      placeholder="10%"
                      sx={{
                        padding: 0,
                        fontSize: "0.875rem", // Smaller font size
                        width: "100px", // Adjust width if necessary
                      }}
                    />
                  </div>
                </Form>
                <div className="flex flex-col gap-10 w-full">
                  <ButtonGroup
                    className="w-full "
                    variant="outlined"
                    aria-label="payment method"
                  >
                    {[
                      { value: "khqr", label: "KHQR", icon: <QrCode2 /> },
                      { value: "cash", label: "Cash", icon: <AttachMoney /> },
                    ].map((item) => (
                      <Button
                        className="w-full"
                        key={item.value}
                        onClick={() => handleSelect(item.value)}
                        variant={
                          paymentMethod === item.value
                            ? "contained"
                            : "outlined"
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          borderRadius: "8px",
                          padding: "10px 16px",
                          borderColor:
                            paymentMethod === item.value
                              ? "var(--secondary)"
                              : "#ccc",
                          backgroundColor:
                            paymentMethod === item.value
                              ? "var(--secondary)"
                              : "white",
                          color:
                            paymentMethod === item.value ? "white" : "black",
                          "&:hover": {
                            backgroundColor:
                              paymentMethod === item.value
                                ? "var(--medium-light)"
                                : "#f5f5f5",
                          },
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
                {/* Checkout & Buttons Section */}
                <div className="w-full gap-4 flex flex-col justify-between">
                  <div className="flex flex-col font-semibold text-lg  border-t">
                    <h2 className="flex justify-between items-center">
                      <span>Subtotal:</span>${amount.toFixed(2)}
                    </h2>
                    <h2 className="flex justify-between items-center">
                      <span>Discount:</span> ${calculatedDiscount.toFixed(2)}
                    </h2>
                    <h2 className="flex justify-between items-center">
                      <span>VAT:</span> ${vatAmount.toFixed(2)}
                    </h2>

                    <h2 className="flex justify-between items-center">
                      <span>Total:</span> ${totalAmount.toFixed(2)}
                    </h2>
                  </div>
                  {/* <div className="border-t border-gray-300 py-4">
                <div className="flex justify-between">
                  <span>Item(s):</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${(amount * 0.01).toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${(amount + amount * 0.01).toFixed(2)}</span>
                </div>
              </div> */}
                  <Button
                    onClick={handleSettlement}
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
                    Place Order
                  </Button>
                  <div className="w-full grid grid-cols-2 gap-4">
                    <Button
                      className="col-span-1"
                      variant="outlined"
                      onClick={clearLocalStorage}
                      sx={{
                        backgroundColor: "gray",
                        color: "white",
                        fontFamily: "var(--text)",
                        padding: 1,
                        border: "none",
                      }}
                      type="button"
                    >
                      Remove All
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "var(--secondary)",
                        color: "var(--secondary)",
                        fontFamily: "var(--text)",
                        padding: 1,
                      }}
                      type="button"
                    >
                      Print <PiPrinterFill className="text-xl ml-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {toggle && (
              <div
                onClick={() => setToggle(!toggle)}
                className={`fixed inset-0 bg-gray-500 bg-opacity-50 z-5 transition-opacity duration-300`}
              />
            )}
            <div
              onClick={() => setToggle(!toggle)}
              className={`hidden max-md:block fixed  transition-all duration-500 max-w-full w-full top-[60%] inset-x-0 -bottom-10 z-10
            ${
              toggle
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
            >
              hi
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PrivateLayout;
