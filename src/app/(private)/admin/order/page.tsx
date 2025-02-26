"use client";
import AdminCard from "@/components/Card/Admin";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import OrderPanel from "@/components/OrderList";
import { ShoppingCartProduct } from "@/components/ShoppingCart";
import { categories } from "@/constants/AutoComplete";
import { useAuthContext } from "@/context/AuthContext";
import { VscClearAll } from "react-icons/vsc";

import {
  clearLocalStorage,
  settlement,
  updateCartItems,
} from "@/helpers/addToCart";
import { ProductReturnList } from "@/schema/products";
import { getAllProducts } from "@/services/products";
import { AttachMoney, QrCode2 } from "@mui/icons-material";
import {
  Autocomplete,
  ButtonGroup,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button/Button";
import Image from "next/image";
import Link from "next/link";
import { Input } from "postcss";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PiPrinterFill } from "react-icons/pi";
import { formattedKHR } from "@/helpers/format-currency";
import { TbShoppingCartPause } from "react-icons/tb";
import AutocompleteForm from "@/components/Autocomplete";
import { MdCurrencyExchange } from "react-icons/md";

const ITEMS_PER_PAGE = 8; // Adjust this number based on how many items you want per page
export interface IHold {
  orderId: string;
  items: ShoppingCartProduct[];
}
const page = () => {
  const [products, setProducts] = useState<ProductReturnList[]>([]);
  const [holdCustomers, setHoldCustomers] = useState<IHold[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [category, setCategory] = useState("");
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const methods = useForm();
  const barcode = methods.watch("barcode");
  const payment = methods.watch("payment");
  const paymentKHR = methods.watch("payment-khr");
  const category = methods.watch("category");
  const [paymentMethod, setPaymentMethod] = useState("khqr");
  const [currency, setCurrency] = useState("usd");
  const { register, watch, setValue } = methods;
  const discount = watch("discount");
  const { profile, isAuthorized } = useAuthContext();
  const [amount, setAmount] = useState<number>(0);
  const [discountedAmount, setDiscountedAmount] = useState<number>(0);
  const [calculatedDiscount, setCalculateDiscount] = useState<number>(0);
  const [vatAmount, setVatAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [toggleCash, setToggleCash] = useState<boolean>(false);
  const [toggleKHR, setToggleKHR] = useState<boolean>(false);
  const [exchange, setExchange] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");
  //
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProducts({ category, barcode });
        if (response) {
          setProducts(response);
        } else {
          console.error("No products found in response");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchProduct();
  }, [category, barcode, refresh]);
  const generateNextOrderId = (): string => {
    let lastOrderId = localStorage.getItem("lastOrderId");
    let currentOrderId = localStorage.getItem("currentOrderId");

    if (!lastOrderId) {
      lastOrderId = "PO-00000"; // Start from 0, next will be PO-00001
    }
    // if (currentOrderId) {
    //   localStorage.setItem("lastOrderId", currentOrderId);
    //   localStorage.removeItem("currentOrderId");
    // }
    if (currentOrderId === lastOrderId) {
      localStorage.removeItem("currentOrderId");
      return currentOrderId;
    }

    const orderNumber = parseInt(lastOrderId.split("-")[1]) + 1;
    const nextOrderId = `PO-${orderNumber.toString().padStart(5, "0")}`;
    localStorage.setItem("lastOrderId", nextOrderId);
    return nextOrderId;
  };

  useEffect(() => {
    const lastOrderId = localStorage.getItem("lastOrderId");
    setOrderId(lastOrderId ?? "PO-00000");
  }, []);
  // const getOrderId = (): string => {
  //   let orderId = localStorage.getItem("currentOrderId");
  //   if (!orderId) {
  //     orderId = generateNextOrderId();
  //     localStorage.setItem("currentOrderId", orderId);
  //   }
  //   return orderId;
  // };

  const handleSelect = (method: string) => {
    setPaymentMethod(method);
    if (method === "cash") {
      setToggleCash(true);
    } else {
      setToggleCash(false);
    }
  };
  const handleSelectCurrency = (method: string) => {
    window.dispatchEvent(new Event("exchangeRateUpdated"));
    setCurrency(method);
    if (method === "khr") {
      setToggleKHR(true);
    } else {
      setToggleKHR(false);
    }
  };
  // useEffect(() => {
  //   const orderId = getOrderId();
  //   setOrderId(orderId);
  // }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (toggleCash) {
        const validPayment = isNaN(Number(payment)) ? 0 : Number(payment);
        const validPaymentKHR = isNaN(Number(paymentKHR))
          ? 0
          : Number(paymentKHR);

        // const convertedPayment = toggleKHR
        //   ? validPayment * exchangeRate
        //   : validPayment;

        // const convertedTotalAmount = toggleKHR
        //   ? totalAmount * exchangeRate
        //   : totalAmount;
        // if (toggleKHR && ) {

        if (validPaymentKHR && validPayment) {
          const converted = validPaymentKHR / exchangeRate;
          const combined = converted + validPayment;
          setExchange(combined - totalAmount);
        } else if (validPayment) {
          setExchange(validPayment - totalAmount);
        } else if (validPaymentKHR) {
          setExchange(validPaymentKHR / exchangeRate - totalAmount);
        } else {
          setExchange(0);
        }
      } else {
        setExchange(0); // Reset exchange when input is empty
      }
    }, 1000); // Delay calculation by 500ms after last input

    return () => clearTimeout(timeout); // Cleanup timeout on each keystroke
  }, [payment, totalAmount, toggleCash, paymentKHR, toggleKHR]);
  const [exchangeRate, setExchangeRate] = useState<number>(4100);
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
    const updateExchangeRate = (): void => {
      const rate = localStorage.getItem("exchange-rate");
      if (rate) {
        setExchangeRate(parseFloat(rate));
      } else {
        setExchangeRate(4100);
      }
    };
    const handleExchangeRateUpdated = () => {
      updateExchangeRate();
    };

    window.addEventListener("exchangeRateUpdated", handleExchangeRateUpdated);
    updateExchangeRate();

    return () => {
      window.removeEventListener(
        "exchangeRateUpdated",
        handleExchangeRateUpdated
      );
    };
  }, []);
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
    setRefresh(!refresh);
    setOrderId(generateNextOrderId());
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentItems = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const onRemoveAll = () => {
    clearLocalStorage();
    setValue("discount", 0);
  };
  const OnHoldOrder = () => {
    if (items.length === 0) return; // Prevent saving an empty cart

    const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");

    const newOrder = {
      orderId,
      items,
    };

    heldOrders.push(newOrder);
    localStorage.setItem("heldOrders", JSON.stringify(heldOrders));

    localStorage.setItem("plants", JSON.stringify([]));
    window.dispatchEvent(new Event("cartUpdated"));
    setOrderId(generateNextOrderId()); // Generate new order ID
    setRefresh(!refresh);
  };

  useEffect(() => {
    const getHeldCarts = () => {
      const holdCart = JSON.parse(localStorage.getItem("heldOrders") || "[]");
      setHoldCustomers(holdCart ?? []);
    };
    getHeldCarts();
  }, [refresh]);

  //
  const restoreHeldCart = (selectedPurchaseId: string) => {
    const selectedCart = holdCustomers.find(
      (cart: any) => cart.orderId === selectedPurchaseId
    );

    if (selectedCart) {
      setOrderId(selectedCart.orderId);
      localStorage.setItem("plants", JSON.stringify(selectedCart.items));
      const updatedHeldOrders = holdCustomers.filter(
        (cart: any) => cart.orderId !== selectedPurchaseId
      );
      localStorage.setItem("heldOrders", JSON.stringify(updatedHeldOrders));
      window.dispatchEvent(new Event("cartUpdated"));
      const lastOrderId = localStorage.getItem("lastOrderId");
      localStorage.setItem("currentOrderId", lastOrderId as string);
    }
    setRefresh(!refresh);
  };

  return (
    <div className="flex w-full justify-between gap-4">
      <div className="w-full">
        <div className="flex gap-4">
          <Form methods={methods} className="w-1/2 grid grid-cols-2 gap-4">
            <InputField
              label=""
              name="barcode"
              type="text"
              placeholder="Search Barcode"
            />

            <AutocompleteForm
              options={categories}
              name="category"
              label="Category"
            />
          </Form>

          {holdCustomers.map((cus, index) => (
            <button onClick={() => restoreHeldCart(cus.orderId)} key={index}>
              {cus.orderId}
            </button>
          ))}
          {/* <div className="w-full flex gap-2 justify-between items-center">
            {categories.map((value, index) => (
              <Button
                key={index}
                variant="text"
                onClick={() =>
                  setCategory(value === "All Products" ? "" : value)
                }
                className="rounded-lg h-full"
                sx={{
                  fontFamily: "var(--text)",
                  backgroundColor:
                    category === value
                      ? "var(--medium-light)"
                      : category === ""
                      ? value === "All Products"
                        ? "var(--medium-light)"
                        : "gray"
                      : "gray",
                  color: "white",
                  border: "none",
                }}
              >
                <p className="capitalize px-4"> {value}</p>
              </Button>
            ))}
          </div> */}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 py-4">
          {currentItems.map((product) => (
            <AdminCard product={product} key={product._id} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div
        className={`flex flex-col border items-start justify-between bg-white shadow-lg  min-h-screen min-w-[400px] max-w-[400px] p-4 gap-4`}
      >
        <div className="text-lg flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <MdCurrencyExchange className="w-5 h-5" />
            <p>$1 = ៛{formattedKHR(exchangeRate)}</p>
          </div>
          <p className="text-base">{orderId}</p>
        </div>

        {/* Shopping Cart Items Section */}
        <div className="flex flex-col w-full flex-grow overflow-y-auto items-start">
          <OrderPanel />
        </div>
        <Form
          methods={methods}
          className="w-full grid grid-cols-2 items-center gap-2 justify-between"
        >
          <input
            {...register("discount")}
            type="text"
            placeholder="Ex: 10%"
            className="p-2 border rounded"
          />

          <ButtonGroup
            className="w-full "
            variant="outlined"
            aria-label="payment method"
          >
            {[
              { value: "usd", label: "USD" },
              { value: "khr", label: "KHR" },
            ].map((item) => (
              <Button
                className="w-full"
                key={item.value}
                onClick={() => handleSelectCurrency(item.value)}
                variant={currency === item.value ? "contained" : "outlined"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "8px",
                  padding: 1,
                  borderColor:
                    currency === item.value ? "var(--secondary)" : "#ccc",
                  backgroundColor:
                    currency === item.value ? "var(--secondary)" : "white",
                  color: currency === item.value ? "white" : "black",
                  "&:hover": {
                    backgroundColor:
                      currency === item.value
                        ? "var(--medium-light)"
                        : "#f5f5f5",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </ButtonGroup>
        </Form>

        {/* Checkout & Buttons Section */}
        <div className="w-full flex flex-col justify-between">
          <div className="flex flex-col font-semibold border-t pt-2">
            <p className="flex justify-between items-center">
              <span>Subtotal:</span>
              {!toggleKHR
                ? `$${amount.toFixed(2)}`
                : `៛${formattedKHR(amount * exchangeRate)}`}
            </p>
            <p className="flex justify-between items-center ">
              <span>Discount:</span>
              {!toggleKHR
                ? `$${calculatedDiscount.toFixed(2)}`
                : `៛${formattedKHR(calculatedDiscount * exchangeRate)}`}
            </p>
            <p className="flex justify-between items-center ">
              <span>VAT:</span>
              {!toggleKHR
                ? `$${vatAmount.toFixed(2)}`
                : `៛${formattedKHR(vatAmount * exchangeRate)}`}
            </p>
            <h2 className="flex justify-between text-xl font-bold items-center ">
              <span>Total:</span>
              {!toggleKHR
                ? `$${totalAmount.toFixed(2)}`
                : `៛${formattedKHR(totalAmount * exchangeRate)}`}
            </h2>
            {toggleCash && (
              <div className="grid grid-cols-2 rounded justify-between items-center">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="px-2 py-1 border-b rounded outline-none"
                    type="text"
                    placeholder="$20.00"
                    {...register("payment")}
                  />

                  <input
                    className="px-2 py-1 border-b rounded outline-none"
                    type="text"
                    placeholder="៛40,000"
                    {...register("payment-khr")}
                  />
                </div>
                <p className="flex gap-4 items-center justify-end ">
                  <span>Change:</span>
                  {!toggleKHR
                    ? `$${exchange.toFixed(2)}`
                    : `៛${formattedKHR(exchange * exchangeRate)}`}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
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
                  paymentMethod === item.value ? "contained" : "outlined"
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "8px",
                  padding: 1,
                  borderColor:
                    paymentMethod === item.value ? "var(--secondary)" : "#ccc",
                  backgroundColor:
                    paymentMethod === item.value ? "var(--secondary)" : "white",
                  color: paymentMethod === item.value ? "white" : "black",
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
        <div className="grid grid-cols-4 gap-2 w-full mb-5">
          <Button
            onClick={handleSettlement}
            className="col-span-2"
            variant="outlined"
            sx={{
              backgroundColor: "var(--secondary)",
              color: "white",
              fontFamily: "var(--text)",
              padding: 1,
            }}
            disabled={items.length <= 0 && !payment && !paymentKHR}
            type="button"
          >
            Place Order
          </Button>
          <Button
            className="col-span-1"
            variant="outlined"
            onClick={onRemoveAll}
            disabled={items.length <= 0}
            sx={{
              backgroundColor: "gray",
              color: "white",
              fontFamily: "var(--text)",

              border: "none",
            }}
            type="button"
          >
            <VscClearAll className="text-xl" />
          </Button>

          <Button
            variant="outlined"
            className="col-span-1"
            sx={{
              borderColor: "var(--secondary)",
              color: "var(--secondary)",
              fontFamily: "var(--text)",
            }}
            type="button"
            disabled={items.length <= 0}
          >
            <TbShoppingCartPause onClick={OnHoldOrder} className="text-xl" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
