"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { VscClearAll } from "react-icons/vsc";
import { TbShoppingCartPause } from "react-icons/tb";
import { MdCurrencyExchange } from "react-icons/md";

import AdminCard from "@/components/Card/Admin";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import OrderPanel from "@/components/OrderList";
import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import ToggleButton from "@/components/ToggleButton";

import { categories } from "@/constants/AutoComplete";
import { optionsCurrency, optionsMethod } from "@/constants/options";
import { useAuthContext } from "@/context/AuthContext";
import { getAllProducts } from "@/services/products";
import { useCartItems } from "@/hooks/useCartItems";
import { useExchangeRate } from "@/hooks/useExchangeRate";

import { ProductReturnList } from "@/schema/products";
import { formattedKHR } from "@/helpers/format/currency";
import { settlement, clearLocalStorage } from "@/helpers/addToCart";
import generateNextOrderId from "@/helpers/generateOrderId";
import { ShoppingCartProduct } from "@/components/ShoppingCart";

interface IHold {
  orderId: string;
  items: ShoppingCartProduct[];
}

const ITEMS_PER_PAGE = 8;

const Page = () => {
  const { profile } = useAuthContext();
  const exchangeRate = useExchangeRate();
  const { items, amount } = useCartItems();

  const [products, setProducts] = useState<ProductReturnList[]>([]);
  const [holdCustomers, setHoldCustomers] = useState<IHold[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderId, setOrderId] = useState<string>("PO-00001");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [currency, setCurrency] = useState("usd");
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [toggleKHR, setToggleKHR] = useState(false);

  const methods1 = useForm({ defaultValues: { barcode: "", category: "" } });
  const methods2 = useForm<{ heldCart: string }>({
    defaultValues: { heldCart: "" },
  });
  const methods3 = useForm({
    defaultValues: { payment: "", paymentKHR: "", discount: "" },
  });

  const barcode = methods1.watch("barcode");
  const category = methods1.watch("category");
  const heldCart = methods2.watch("heldCart");
  const { payment, paymentKHR, discount } = methods3.watch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({ category, barcode });
        setProducts(response || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [category, barcode, refresh]);

  useEffect(() => {
    const orderId = localStorage.getItem("lastOrderId") ?? "PO-00001";
    setOrderId(orderId);
  }, []);

  useEffect(() => {
    restoreHeldCart(heldCart);
  }, [heldCart]);

  useEffect(() => {
    const getHeldCarts = () => {
      const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");
      setHoldCustomers(heldOrders ?? []);
    };
    getHeldCarts();
  }, [refresh]);

  useEffect(() => {
    const discountValue =
      Number(discount) !== 0 ? (amount * Number(discount)) / 100 : 0;
    const newTotal = amount - discountValue;
    setCalculatedDiscount(discountValue);
    setTotalAmount(newTotal);
  }, [discount, amount]);

  const onRefresh = () => {
    setRefresh((prev) => !prev);
    methods3.setValue("discount", "");
    methods3.setValue("payment", "");
    methods3.setValue("paymentKHR", "");
    setPaymentMethod("cash");
  };

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  const handleSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSelectCurrency = (method: string) => {
    setCurrency(method);
    setToggleKHR(method === "khr");
  };

  const placeOrder = () => {
    settlement(
      items,
      amount,
      paymentMethod,
      profile?.firstname,
      Number(discount),
      calculatedDiscount,
      totalAmount,
      orderId
    );
    setOrderId(generateNextOrderId());
    onRefresh();
  };

  const discountedValue = () => {
    return items.reduce((acc, item) => acc + parseFloat(item.discount), 0);
  };

  const onRemoveAll = () => {
    clearLocalStorage();
    setRefresh(!refresh);
  };

  const heldOrder = () => {
    if (items.length === 0) return;
    const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");
    const newOrder = { orderId, items };
    heldOrders.push(newOrder);
    localStorage.setItem("heldOrders", JSON.stringify(heldOrders));
    localStorage.setItem("plants", JSON.stringify([]));
    window.dispatchEvent(new Event("cartUpdated"));
    setOrderId(generateNextOrderId());
    onRefresh();
  };
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
    methods2.setValue("heldCart", "");
  };
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentItems = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex w-full justify-between gap-4">
      <div className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <Form
            methods={methods1}
            className="col-span-1 grid grid-cols-2 gap-4"
          >
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
          <Form
            methods={methods2}
            className="col-span-1 flex w-full justify-end"
          >
            <div className="w-1/3">
              <AutocompleteForm
                options={holdCustomers.map((cart) => cart.orderId)}
                name="heldCart"
                label={`On Hold (${holdCustomers.length})`}
              />
            </div>
          </Form>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 py-4">
          {currentItems.map((product) => (
            <AdminCard product={product} key={product._id} />
          ))}
        </div>

        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex flex-col border items-start justify-between bg-white shadow-lg min-h-screen min-w-[530px] p-4 gap-4">
        <p className="text-base flex justify-between items-center w-full">
          <span className="bg-gray-100 rounded-lg px-4 py-2">{orderId}</span>
          <span className="rounded-lg border px-4 py-2 flex items-center">
            Cashier: {profile?.firstname}
          </span>
        </p>

        <div className="flex flex-col w-full flex-grow overflow-y-auto items-start">
          <OrderPanel />
        </div>

        <Form
          methods={methods3}
          className="w-full grid grid-cols-2 items-center gap-2 justify-between"
        >
          <input
            {...methods3.register("discount")}
            type="text"
            placeholder="Ex: 10%"
            className="p-2 border rounded"
          />
          <ToggleButton
            options={optionsCurrency}
            onSelect={handleSelectCurrency}
            selectedValue={currency}
          />
        </Form>

        <div className="flex flex-col w-full text-lg font-semibold border-t pt-2">
          <p className="flex justify-between items-center">
            <span>Items:</span>
            {items.length}
          </p>
          <p className="flex justify-between items-center">
            <span>Subtotal:</span>
            {!toggleKHR
              ? `$${amount.toFixed(2)}`
              : `៛${formattedKHR(amount * exchangeRate)}`}
          </p>
          <p className="flex justify-between items-center">
            <span>Discount:</span>${discountedValue().toFixed(2)}
          </p>

          <h2 className="flex justify-between text-2xl font-bold items-center">
            <span>Total:</span>
            {!toggleKHR
              ? `$${totalAmount.toFixed(2)}`
              : `៛${formattedKHR(totalAmount * exchangeRate)}`}
          </h2>

          {/* {paymentMethod === "cash" && items.length > 0 && (
            <div className="grid grid-cols-2 p-2 mt-2 border-y justify-between items-center">
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="rounded outline-none border-r"
                  type="text"
                  placeholder="$20.00"
                  {...methods3.register("payment")}
                />
                <input
                  className="rounded outline-none"
                  type="text"
                  placeholder="៛40,000"
                  {...methods3.register("paymentKHR")}
                />
              </div>
              <p className="flex gap-4 items-center justify-end">
                <span>Change:</span>
                {!toggleKHR
                  ? `$${
                      payment ? (Number(payment) - totalAmount).toFixed(2) : 0
                    }`
                  : `៛${formattedKHR(
                      (Number(paymentKHR) - totalAmount) * exchangeRate
                    )}`}
              </p>
            </div>
          )} */}
        </div>

        <div className="flex flex-col gap-4 w-full">
          {items.length > 0 && (
            <ToggleButton
              options={optionsMethod}
              selectedValue={paymentMethod}
              onSelect={handleSelect}
            />
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 w-full mb-5">
          <CustomButton
            className="col-span-2"
            theme={`${
              items.length <= 0 ||
              (paymentMethod === "cash" && !(paymentKHR || payment))
                ? "dark"
                : ""
            }`}
            disabled={
              items.length <= 0 ||
              (paymentMethod === "cash" && !(paymentKHR || payment))
            }
            onHandleButton={placeOrder}
            text="Place Order"
          />
          <CustomButton
            onHandleButton={onRemoveAll}
            icon={VscClearAll}
            disabled={items.length <= 0}
            theme={`${items.length <= 0 ? "dark" : "general"}`}
          />
          <CustomButton
            onHandleButton={heldOrder}
            icon={TbShoppingCartPause}
            disabled={items.length <= 0}
            theme={items.length <= 0 ? "dark" : "general"}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
