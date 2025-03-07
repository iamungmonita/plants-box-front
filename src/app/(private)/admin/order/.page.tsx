"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { VscClearAll } from "react-icons/vsc";
import { TbShoppingCartPause } from "react-icons/tb";

import AdminCard from "@/components/Card/Admin";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import ToggleButton from "@/components/ToggleButton";

import { categories } from "@/constants/AutoComplete";
import { optionsMethod } from "@/constants/options";
import { useAuthContext } from "@/context/AuthContext";
import { getAllProducts } from "@/services/products";
import { useCartItems } from "@/hooks/useCartItems";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import useFetch from "@/hooks/useFetch";
import { formattedKHR } from "@/helpers/format/currency";
import { settlement, clearLocalStorage } from "@/helpers/addToCart";
import generateNextOrderId from "@/helpers/generateOrderId";
import HorizontalLinearStepper from "@/components/Step";
import BasicModal from "@/components/Modal";
import Membership from "@/components/Modals/Membership";
import { useMembership } from "@/hooks/useMembership";
import { pointToAmount } from "@/helpers/calculation/getPoint";
import { ProductResponse } from "@/schema/products";
import { getDiscountValue } from "@/constants/membership";
import { IHold } from "@/models/Order";
import { useHeldCarts } from "@/hooks/useHeldCart";

const ITEMS_PER_PAGE = 8;

const Page = () => {
  const { profile } = useAuthContext();
  const exchangeRate = useExchangeRate();
  const { items, amount } = useCartItems();
  const [holdCustomers, setHoldCustomers] = useState<IHold[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderId, setOrderId] = useState<string>("PO-00001");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [membershipPayment, setMembershipPayment] = useState("");
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [toggleKHR, setToggleKHR] = useState(false);
  const [toggleMembership, setToggleMembership] = useState(false);
  const [converted, setConverted] = useState(0);
  const { member } = useMembership();
  const carts = useHeldCarts([refresh]);
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
  const {
    data: products = [],
    loading,
    error,
  } = useFetch(getAllProducts, { category, barcode }, [
    refresh,
    category,
    barcode,
  ]);

  const discountedValue = () => {
    if (membershipPayment !== member?.type) {
      return 0;
    }
    return items.reduce((acc, item) => {
      const discount = Number(item.discount) || 0; // Ensure a valid number
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;

      return acc + (discount / 100) * price * quantity;
    }, 0);
  };

  useEffect(() => {
    const updatedItems = items.map((item) => ({
      ...item,
      discount: discount,
    }));
    localStorage.setItem("plants", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));

    let discountValue =
      Number(discount) !== 0 ? (amount * Number(discount)) / 100 : 0;

    let newTotal = amount - discountValue;
    setTotalAmount(newTotal);
    if (membershipPayment && membershipPayment !== member?.type) {
      const convertedAmount = pointToAmount(Number(member?.points));
      discountedValue();
      newTotal = amount - convertedAmount; // Deduct converted amount
    }
    const safeTotal = Number.isFinite(newTotal) ? newTotal : 0;

    setTotalAmount(safeTotal);
  }, [discount, amount, membershipPayment, refresh]);

  const handleSelectMembershipPayment = (payment: string) => {
    setMembershipPayment(payment);

    if (payment === member?.type) {
      const value = getDiscountValue(member.type);
      methods3.setValue("discount", String(value));
    }
  };
  useEffect(() => {
    const orderId = localStorage.getItem("lastOrderId") ?? "PO-00001";
    setOrderId(orderId);
  }, []);

  useEffect(() => {
    restoreHeldCart(heldCart);
  }, [heldCart]);

  // useEffect(() => {
  //   const getHeldCarts = () => {
  //     const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");
  //     setHoldCustomers(heldOrders ?? []);
  //   };
  //   getHeldCarts();
  // }, [refresh]);

  useEffect(() => {
    onRefresh();
  }, [member]);
  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  const handleSelect = (method: string) => {
    setPaymentMethod(method);
    console.log(method);
  };

  const placeOrder = (orderId: string) => {
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
    const updatedHeldOrders = carts.filter(
      (cart: any) => cart.orderId !== orderId
    );
    localStorage.setItem("heldOrders", JSON.stringify(updatedHeldOrders));
    setOrderId(generateNextOrderId());
    onRefresh();
  };

  const heldOrder = (orderId: string) => {
    if (items.length === 0) return;

    // Get the held orders from localStorage
    const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");

    // Check if the orderId already exists in heldOrders
    const orderExists = heldOrders.some(
      (order: { orderId: string }) => order.orderId === orderId
    );

    if (!orderExists) {
      // If the orderId doesn't exist, add the new order to heldOrders
      const newOrder = { orderId, items };
      heldOrders.push(newOrder);

      // Update localStorage with the new heldOrders
      localStorage.setItem("heldOrders", JSON.stringify(heldOrders));

      // Clear the 'plants' storage as per requirement
      localStorage.setItem("plants", JSON.stringify([]));

      // Dispatch an event that the cart was updated

      // Generate and set the next orderId
      setOrderId(generateNextOrderId());
    } else {
      // If the orderId already exists, just clear the 'plants' storage
      setOrderId(generateNextOrderId());

      methods2.setValue("heldCart", "");
    }
    window.dispatchEvent(new Event("cartUpdated"));
    // Trigger the refresh callback
  };

  const restoreHeldCart = (selectedPurchaseId: string) => {
    const selectedCart = carts.filter(
      (cart: any) => cart.orderId === selectedPurchaseId
    );

    if (selectedCart[0]) {
      console.log(selectedCart[0].orderId);
      setOrderId(selectedCart[0].orderId);
      localStorage.setItem("plants", JSON.stringify(selectedCart[0].items));

      window.dispatchEvent(new Event("cartUpdated"));
      const lastOrderId = localStorage.getItem("lastOrderId");
      localStorage.setItem("currentOrderId", lastOrderId as string);
    }
  };
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentItems = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const onRefresh = () => {
    setRefresh((prev) => !prev);
    methods3.setValue("discount", "");
    methods3.setValue("payment", "");
    methods3.setValue("paymentKHR", "");
    methods3.setValue("discount", "0");
    setPaymentMethod("");
    setMembershipPayment("");
    setConverted(0);
  };

  const onRemoveAll = () => {
    clearLocalStorage();
    onRefresh();
  };

  const onClear = () => {
    methods1.setValue("barcode", "");
    methods1.setValue("category", "");
  };

  return (
    <div className="flex w-full justify-between gap-4">
      <div className="w-full">
        <div className="grid grid-cols-4 gap-4">
          <Form
            methods={methods1}
            className="col-span-3 grid grid-cols-5 gap-4"
          >
            <div className="col-span-4 grid-cols-2 grid gap-4">
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
            </div>
            <CustomButton text="Clear" theme="alarm" onHandleButton={onClear} />
          </Form>
          <Form
            methods={methods2}
            className={`${carts.length > 0 && "bg-yellow-500"} col-span-1`}
          >
            <AutocompleteForm
              options={carts.map((option) => ({
                label: `${option.orderId}`, // Show both name and phone number
                value: option.orderId, // Use phone number as value
              }))}
              name="heldCart"
              label={`On Hold (${carts.length})`}
            />
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

      <div className="flex flex-col border items-start justify-between bg-white shadow-lg min-h-screen min-w-[530px] max-w-[530px] p-4 gap-4">
        <p className="text-base flex justify-between items-center w-full">
          <span className="border rounded px-4 py-2">{orderId}</span>
          <span className="rounded border px-4 py-2 flex items-center">
            {profile?.firstName}
          </span>
        </p>

        <div className="flex flex-col w-full flex-grow overflow-y-auto items-start">
          <HorizontalLinearStepper
            step={paymentMethod}
            totalAmount={totalAmount - discountedValue()}
          />
        </div>
        <BasicModal
          ContentComponent={Membership}
          onClose={() => setToggleMembership(false)}
          open={toggleMembership}
        />
        <Form
          methods={methods3}
          className="w-full grid grid-cols-5 items-center gap-2 justify-between"
        >
          <div className="col-span-3">
            <CustomButton
              onHandleButton={() => setToggleMembership(true)}
              text={`${
                member
                  ? `${member.firstName} ${member.lastName}`
                  : "Check Membership"
              }`}
              theme="general"
            />
          </div>
          <div className="flex col-span-2 flex-col gap-4 w-full">
            {member && member?.type !== "Point" && (
              <ToggleButton
                disabled={!member}
                options={[
                  { label: `${member?.type}`, value: `${member?.type}` },
                  { label: `${member?.points}`, value: `${member?.points}` },
                ]}
                selectedValue={membershipPayment}
                onSelect={handleSelectMembershipPayment}
              />
            )}
            {member?.type === "Point" && (
              <ToggleButton
                options={[
                  { label: `${member?.points}`, value: `${member?.points}` },
                ]}
                selectedValue={membershipPayment}
                onSelect={handleSelectMembershipPayment}
              />
            )}
            {!member && (
              <InputField name="discount" label="Discount" type="text" />
            )}
          </div>
        </Form>

        {paymentMethod !== "cash" && (
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
              <span>Total:</span>${totalAmount.toFixed(2)}
            </h2>
          </div>
        )}
        <div className="flex flex-col gap-4 w-full">
          <ToggleButton
            disabled={items.length <= 0}
            options={optionsMethod}
            selectedValue={paymentMethod}
            onSelect={handleSelect}
          />
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
            onHandleButton={() => placeOrder(orderId)}
            text="Confirm Order"
          />
          <CustomButton
            onHandleButton={onRemoveAll}
            icon={VscClearAll}
            disabled={items.length <= 0}
            theme={`${items.length <= 0 ? "dark" : "alarm"}`}
          />
          <CustomButton
            onHandleButton={() => heldOrder(orderId)}
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
