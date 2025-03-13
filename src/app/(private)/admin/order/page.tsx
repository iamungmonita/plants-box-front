"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { VscClearAll } from "react-icons/vsc";
import { TbShoppingCartPause } from "react-icons/tb";
import { CiReceipt } from "react-icons/ci";
import { MdClose, MdDelete } from "react-icons/md";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import ToggleButton from "@/components/ToggleButton";
import { categories } from "@/constants/AutoComplete";
import { PaymentOptions } from "@/constants/Options";
import { useAuthContext } from "@/context/AuthContext";
import { getAllProducts } from "@/services/products";
import { useCartItems } from "@/hooks/useCartItems";
import { clearLocalStorage, placeOrder } from "@/helpers/addToCart";
import generateNextOrderId from "@/helpers/generateOrderId";
import HorizontalLinearStepper from "@/components/Step";
import BasicModal from "@/components/Modal";
import Membership from "@/components/Modals/Membership";
import { useMembership } from "@/hooks/useMembership";
import { amountToPoint, pointToAmount } from "@/helpers/calculation/getPoint";
import { useHeldCarts } from "@/hooks/useHeldCart";
import useFetch from "@/hooks/useFetch";
import { getDiscountValue, MembershipType } from "@/constants/Membership";
import ConfirmOrder from "@/components/Modals/ConfirOrder";
import { updateMembershipPointById } from "@/services/membership";
import PaymentQRCode from "@/components/Modals/QRcode";
import { ProductResponse } from "@/models/Product";
import Pagination from "@/components/Pagination";
import ProfileComponent from "@/components/Profile";
import { useDiscount } from "@/hooks/useDiscount";
import { useRouter } from "next/navigation";
import { useExchangeRate } from "@/hooks/useExchangeRate";

const Page = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>("PO-00001");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalDiscountValue, setTotalDiscountValue] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [membershipPayment, setMembershipPayment] = useState("");
  const [toggleConfirmOrder, setToggleConfirmOrder] = useState(false);
  const [toggleMembership, setToggleMembership] = useState(false);
  const [toggleQRCode, setToggleQRCode] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalDiscountPercentage, setTotalDiscountPercentage] =
    useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);
  const { value, percentage } = useDiscount();

  const methods1 = useForm({ defaultValues: { barcode: "", category: "" } });
  const methods2 = useForm<{ heldCart: string }>({
    defaultValues: { heldCart: "" },
  });
  const methods3 = useForm({
    defaultValues: { payment: "", paymentKHR: "", discount: "" },
  });

  const { barcode, category } = methods1.watch();
  const { heldCart } = methods2.watch();
  const { discount } = methods3.watch();

  const { profile } = useAuthContext();
  const { items, amount } = useCartItems();
  const { member } = useMembership();
  const carts = useHeldCarts([refresh]);
  const updatedHeldOrders = carts.filter(
    (cart: any) => cart.orderId !== orderId
  );

  const { data: products = [] } = useFetch<ProductResponse[]>(
    getAllProducts,
    { category, search: barcode },
    [refresh, category, barcode]
  );

  useEffect(() => {
    const orderId = localStorage.getItem("lastOrderId") ?? "PO-00001";
    setOrderId(orderId);
  }, []);

  useEffect(() => {
    restoreHeldCart(heldCart);
  }, [heldCart]);

  useEffect(() => {
    setTotalDiscountPercentage(percentage);
    setTotalDiscountValue(value);
    setTotalAmount(amount - value);
  }, [items]);

  useEffect(() => {
    const discountValue =
      Number(discount) !== 0 ? (amount * Number(discount)) / 100 : 0;
    const newTotal = amount - discountValue;
    setTotalDiscountValue(discountValue);
    setTotalAmount(newTotal - value);
  }, [discount, amount]);

  useEffect(() => {
    if (!items || items.length === 0) return; // Prevent overwriting with empty data
    const updatedItems = items.map((item) => ({
      ...item,
      discount: item.isDiscountable ? discount : item.discount, // Only update if isDiscountable
    }));
    localStorage.setItem("plants", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [discount, amount, membershipPayment, refresh]);

  const onRefresh = () => {
    setRefresh((prev) => !prev);
    methods3.setValue("discount", "");
    methods3.setValue("payment", "");
    methods3.setValue("paymentKHR", "");
    methods3.setValue("discount", "");
    setPaymentMethod("");
    setTotalDiscountValue(0);
    setTotalPoints(0);
    setMembershipPayment("");
  };

  const handleSelectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
    if (method === "khqr") {
      setToggleQRCode(true);
    }
    return;
  };

  const handleOrder = async (orderId: string) => {
    const data = {
      items,
      amount,
      paymentMethod,
      profile: profile?.firstName,
      id: member?._id as string,
      paidAmount,
      changeAmount,
      totalDiscountPercentage,
      totalDiscountValue,
      totalAmount,
      totalPoints,
    };
    const newData = Object.assign({}, data, { orderId });
    const response = await placeOrder(newData);
    if (response === false) {
      alert("cannot make order");
      return;
    }
    setToggleConfirmOrder(false);
    window.open(`/print/${orderId}`, "_blank", "width=800,height=600");
    if (member && membershipPayment === MembershipType.POINT) {
      await updateMembershipPointById(member._id, {
        points: amountToPoint(totalAmount),
        invoice: orderId,
      });
    }
    localStorage.setItem("heldOrders", JSON.stringify(updatedHeldOrders));
    setOrderId(generateNextOrderId());
    onRefresh();
  };

  const selectDiscount = (type: MembershipType) => {
    const value = getDiscountValue(type);
    setTotalDiscountPercentage(value);
    methods3.setValue("discount", String(value));
    setTotalDiscountValue(amount * (value / 100));
    setTotalPoints(0);
    const discountedAmount = amount - amount * (value / 100);
    setTotalAmount(discountedAmount);
  };

  const handlePaymentChange = (paid: number, changes: number) => {
    setPaidAmount(paid);
    setChangeAmount(changes);
  };

  const selectPoints = (points: number) => {
    if (amount > 0) {
      setTotalAmount(amount);
      const convertedAmount = amount - pointToAmount(points);
      const discountedAmount = pointToAmount(points);
      setMembershipPayment(MembershipType.POINT);
      setTotalPoints(discountedAmount);
      setTotalDiscountValue(0);
      setTotalAmount(convertedAmount);
    } else {
      setTotalAmount(0);
      setTotalDiscountValue(0);
    }
  };

  const heldOrder = (orderId: string) => {
    if (items.length === 0) return;
    const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");
    const orderExists = heldOrders.some(
      (order: { orderId: string }) => order.orderId === orderId
    );
    if (!orderExists) {
      const newOrder = { orderId, items };
      heldOrders.push(newOrder);
      localStorage.setItem("heldOrders", JSON.stringify(heldOrders));
      setOrderId(generateNextOrderId());
    } else {
      setOrderId(generateNextOrderId());
      methods2.setValue("heldCart", "");
    }
    localStorage.setItem("plants", JSON.stringify([]));
    window.dispatchEvent(new Event("cartUpdated"));
    onRefresh();
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

  const onRemoveAllItems = () => {
    clearLocalStorage();
    onRefresh();
  };

  const onRemoveHoldOrder = () => {
    clearLocalStorage();
    onRefresh();
    localStorage.setItem("heldOrders", JSON.stringify(updatedHeldOrders));
    const lastOrderId = localStorage.getItem("lastOrderId");
    if (lastOrderId) {
      localStorage.setItem("currentOrderId", lastOrderId as string);
    }
    setOrderId(generateNextOrderId());
  };

  const clearSearch = () => {
    methods1.setValue("barcode", "");
    methods1.setValue("category", "");
  };

  const clearMembership = () => {
    localStorage.removeItem("membership");
    setTotalAmount(amount);
    setTotalDiscountValue(0);
    setTotalPoints(0);
    window.dispatchEvent(new Event("memberUpdated"));
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
              <InputField label="Search Product" name="barcode" type="text" />
              <AutocompleteForm
                options={categories}
                name="category"
                label="Category"
              />
            </div>
            <CustomButton
              text="Clear"
              theme="alarm"
              onHandleButton={clearSearch}
            />
          </Form>
          <Form
            methods={methods2}
            className={`${carts.length > 0 && "bg-yellow-500"} col-span-1`}
          >
            <AutocompleteForm
              options={carts.map(({ orderId }) => ({
                label: `${orderId}`,
                value: orderId,
              }))}
              name="heldCart"
              label={`On Hold (${carts.length})`}
            />
          </Form>
        </div>
        <Pagination items={products} />
      </div>
      <div className="flex flex-col border items-start justify-between bg-white shadow-lg min-h-screen min-w-[540px] max-w-[540px] p-4 gap-4">
        <p className="text-base  flex justify-between items-center w-full">
          <span className="border flex items-center gap-2 rounded p-2">
            <CiReceipt className="text-2xl" />
            {orderId}
          </span>
          <span className="rounded-full flex gap-4 pl-6 border items-center">
            <span>{profile?.firstName}</span>
            <ProfileComponent profile={profile} />
          </span>
        </p>
        {paymentMethod !== "cash" && (
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="grid grid-cols-6 py-2 bg-gray-100 px-2 gap-4 border-b first-line:items-center">
                <th>Qty</th>
                <th className="col-span-2 ml-6">Item</th>
                <th>Price</th>
                <th>Disc (%)</th>
                <th>Subtotal</th>
              </tr>
            </thead>
          </table>
        )}
        <div className="flex flex-col w-full flex-grow overflow-y-auto items-start">
          <HorizontalLinearStepper
            onRemoveAll={paymentMethod === ""}
            onPaymentChange={handlePaymentChange}
            step={paymentMethod}
            totalAmount={totalAmount}
          />
        </div>
        <BasicModal
          ContentComponent={PaymentQRCode}
          onClose={() => setToggleQRCode(false)}
          open={toggleQRCode}
          text={totalAmount.toString()}
        />
        <BasicModal
          ContentComponent={ConfirmOrder}
          onAction={() => handleOrder(orderId)}
          onClose={() => setToggleConfirmOrder(false)}
          open={toggleConfirmOrder}
          text="Are you sure you want to place the order?"
        />
        <BasicModal
          ContentComponent={Membership}
          onClose={() => setToggleMembership(false)}
          open={toggleMembership}
        />
        <Form
          methods={methods3}
          className={`${
            member ? "grid-cols-8 " : "grid-cols-7"
          } w-full grid items-center gap-2 justify-between`}
        >
          <div className="col-span-4">
            <CustomButton
              onHandleButton={() => setToggleMembership(true)}
              text={`${
                member
                  ? `${member.phoneNumber} (${member.type})`
                  : "Check Membership"
              }`}
              theme="general"
            />
          </div>
          <div className="flex col-span-3 justify-between items-center gap-2 w-full">
            {member && member.type !== MembershipType.POINT && (
              <div className="flex gap-2">
                <CustomButton
                  theme="general"
                  text={`${getDiscountValue(member.type)}%`}
                  onHandleButton={() =>
                    selectDiscount(member.type as MembershipType)
                  }
                />
                <CustomButton
                  theme="general"
                  text={`${String(member.points)}P`}
                  onHandleButton={() => selectPoints(member.points)}
                />
              </div>
            )}
            {member && member.type === MembershipType.POINT && (
              <div>
                <CustomButton
                  theme="general"
                  text={`${String(member.points)}P`}
                  onHandleButton={() => selectPoints(member.points)}
                />
              </div>
            )}
            {!member && (
              <InputField name="discount" label="Discount" type="number" />
            )}
          </div>
          {member && (
            <div className="pl-4 w-full flex justify-center">
              <MdClose
                onClick={clearMembership}
                className="text-xl text-red-500 cursor-pointer text-center"
              />
            </div>
          )}
        </Form>

        {paymentMethod !== "cash" && (
          <div className="flex flex-col w-full text-lg font-semibold border-t pt-2">
            <p className="flex justify-between items-center">
              <span>Items:</span>
              {items.length}
            </p>
            <p className="flex justify-between items-center">
              <span>Subtotal:</span>${amount.toFixed(2)}
            </p>
            <p className="flex justify-between items-center">
              <span>Discount:</span>${totalDiscountValue.toFixed(2)}
            </p>
            <p className="flex justify-between items-center">
              <span>Points:</span>${totalPoints.toFixed(2)}
            </p>

            <h2 className="flex justify-between text-2xl font-bold items-center">
              <span>Total:</span>${totalAmount.toFixed(2)}
            </h2>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full">
          <ToggleButton
            disabled={items.length <= 0}
            options={PaymentOptions}
            selectedValue={paymentMethod}
            onSelect={handleSelectPaymentMethod}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 w-full mb-5">
          <div className="col-span-2">
            <CustomButton
              theme={`${
                items.length <= 0 || paymentMethod === "" ? "dark" : ""
              }`}
              disabled={items.length <= 0 || paymentMethod === ""}
              onHandleButton={() => setToggleConfirmOrder(true)}
              text="Confirm Order"
            />
          </div>

          {heldCart === orderId ? (
            <CustomButton
              onHandleButton={onRemoveHoldOrder}
              icon={MdDelete}
              disabled={items.length <= 0}
              theme={`${items.length <= 0 ? "dark" : "alarm"}`}
            />
          ) : (
            <CustomButton
              onHandleButton={onRemoveAllItems}
              icon={VscClearAll}
              disabled={items.length <= 0}
              theme={`${items.length <= 0 ? "dark" : "alarm"}`}
            />
          )}

          <CustomButton
            onHandleButton={() => heldOrder(orderId)}
            icon={TbShoppingCartPause}
            disabled={items.length <= 0}
            theme={items.length <= 0 ? "dark" : "notice"}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
