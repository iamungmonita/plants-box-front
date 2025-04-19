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
import { RiCoupon3Line } from "react-icons/ri";
import { categories } from "@/constants/AutoComplete";
import { PaymentOptions } from "@/constants/Options";
import { useAuthContext } from "@/context/AuthContext";
import { getAllProducts } from "@/services/products";
import { useCartItems } from "@/hooks/useCartItems";
import { addToCart, clearLocalStorage, placeOrder } from "@/helpers/addToCart";
import generateNextOrderId from "@/helpers/generateOrderId";
import HorizontalLinearStepper from "@/components/Step";
import BasicModal from "@/components/Modal";
import Membership from "@/components/Modals/Membership";
import { useMembership } from "@/hooks/useMembership";
import { amountToPoint, pointToAmount } from "@/helpers/calculation/getPoint";
import { useHeldCarts } from "@/hooks/useHeldCart";
import useFetch from "@/hooks/useFetch";
import ConfirmOrder from "@/components/Modals/ConfirmOrder";
import { updateMembershipPointByPhoneNumber } from "@/services/membership";
import PaymentQRCode from "@/components/Modals/QRcode";
import { ProductResponse } from "@/models/Product";
import Pagination from "@/components/Pagination";
import ProfileComponent from "@/components/Profile";
import { useDiscount } from "@/hooks/useDiscount";
import { IHold } from "@/models/Order";
import { LuUserRoundSearch } from "react-icons/lu";
import Voucher from "@/components/Modals/Voucher";
import { updateVoucherByBarcode } from "@/services/system";
import { useVoucher } from "@/hooks/useVoucher";
import { MembershipType } from "@/constants/membership";
import AlertPopUp from "@/components/AlertPopUp";
import Link from "next/link";
import DiscountPermission from "@/components/Modals/DiscountPermission";

const Page = () => {
  const { profile, isValidated, invalidation } = useAuthContext();
  const [orderId, setOrderId] = useState<string>("PO-00001");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalDiscountValue, setTotalDiscountValue] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [payment, setPayment] = useState("");
  const [toggleConfirmOrder, setToggleConfirmOrder] = useState(false);
  const [togglePermission, setTogglePermission] = useState(false);
  const [toggleMembership, setToggleMembership] = useState(false);
  const [toggleQRCode, setToggleQRCode] = useState(false);
  const [toggleVoucher, setToggleVoucher] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalDiscountPercentage, setTotalDiscountPercentage] =
    useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [paymentSummary, setPaymentSummary] = useState(() => {
    if (typeof window === "undefined") return {};
    return JSON.parse(localStorage.getItem("paymentSummary") || "{}") || {};
  });
  const [error, setError] = useState(false);
  const [toggleAlert, setToggleAlert] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { value, percentage } = useDiscount();
  const methods1 = useForm({ defaultValues: { barcode: "", category: "" } });
  const methods2 = useForm<{ heldCart: string }>({
    defaultValues: { heldCart: "" },
  });
  const methods3 = useForm({
    defaultValues: { points: "", voucher: "", discount: "" },
  });

  const { barcode, category } = methods1.watch();
  const { heldCart } = methods2.watch();
  const { discount, points } = methods3.watch();

  useEffect(() => {
    const orderId = localStorage.getItem("lastOrderId") ?? "PO-00001";
    setOrderId(orderId);
  }, []);
  useEffect(() => {
    if (scannedBarcode !== null) {
      addToCart(scannedBarcode);
    }
  }, [scannedBarcode]);

  useEffect(() => {
    restoreHeldCart(heldCart);
  }, [heldCart]);

  const { items, amount } = useCartItems();
  const { member } = useMembership();
  const { voucher: storedVoucher } = useVoucher();
  const carts = useHeldCarts([refresh]);
  const updatedHeldOrders = carts.filter(
    (cart: IHold) => cart.orderId !== orderId
  );
  const { data: products = [] } = useFetch<ProductResponse>(
    getAllProducts,
    { queryParam: { category, search: barcode } },
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
    const point = pointToAmount(member?.point ? member.point : 0);
    setTotalPoints(point);
    setTotalAmount(amount - (point !== 0 ? point : value));
    setPaymentSummary({
      amount: amount,
      toggle: toggleQRCode,
      total: amount - (point !== 0 ? point : value),
      point: totalDiscountPercentage > 0 ? 0 : point,
      discount: totalDiscountPercentage,
      voucher: point > 0 ? "N/A" : storedVoucher?.barcode,
      changeAmount: changeAmount || 0,
      paidAmount: paidAmount || 0,
    });
  }, [
    items,
    points,
    totalDiscountPercentage,
    changeAmount,
    paidAmount,
    toggleQRCode,
  ]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const updatedItems = items.map((item) => ({
      ...item,
      discount: item.isDiscountable ? discount : "",
    }));
    localStorage.setItem("plants", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [discount, amount, payment, refresh]);

  const onRefresh = () => {
    setRefresh((prev) => !prev);
    methods3.setValue("discount", "");
    methods3.setValue("points", "");
    setPaymentMethod("");
    setTotalDiscountValue(0);
    setTotalPoints(0);
    setPayment("");
    invalidation();
    localStorage.removeItem("voucher");
    window.dispatchEvent(new Event("voucherUpdated"));
    localStorage.removeItem("membership");
    window.dispatchEvent(new Event("memberUpdated"));
  };

  const handleSelectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
    if (method === "khqr") {
      setToggleQRCode(true);
    }
    return;
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

  useEffect(() => {
    localStorage.setItem("paymentSummary", JSON.stringify(paymentSummary));
  }, [paymentSummary]);

  const handleOrder = async (orderId: string) => {
    const data = {
      items,
      amount,
      paymentMethod,
      profile: profile?.firstName,
      phoneNumber: member?.phone as string,
      paidAmount,
      changeAmount,
      totalDiscountPercentage,
      totalDiscountValue,
      totalAmount,
      totalPoints,
      others: storedVoucher ? storedVoucher.barcode : "",
    };

    const newData = Object.assign({}, data, { orderId });
    const response = await placeOrder(newData);
    if (response === false) {
      setError(true);
      setToggleAlert(true);
      setAlertMessage("Cannot place order, please check product's stock.");
      return;
    }

    if (member && payment === MembershipType.POINT) {
      await updateMembershipPointByPhoneNumber(member.phone, {
        points: amountToPoint(totalAmount),
        invoice: [orderId],
      });
    }
    if (payment === "voucher") {
      await updateVoucherByBarcode(storedVoucher?.barcode as string);
    }
    await localStorage.setItem("heldOrders", JSON.stringify(updatedHeldOrders));
    setToggleConfirmOrder(false);
    window.open(`/print/${orderId}`, "_blank", "width=800,height=600");
    setOrderId(generateNextOrderId());
    onRefresh();
  };

  const handlePaymentChange = (paid: number, changes: number) => {
    setPaidAmount(paid);
    setChangeAmount(changes);
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
      setOrderId(selectedCart[0].orderId);
      localStorage.setItem("plants", JSON.stringify(selectedCart[0].items));
      window.dispatchEvent(new Event("cartUpdated"));
      const lastOrderId = localStorage.getItem("lastOrderId");
      localStorage.setItem("currentOrderId", lastOrderId as string);
    }
    setRefresh(!refresh);
  };

  const onComplete = () => {
    setPaymentMethod("complete");
    setToggleQRCode(false);
  };

  const onRemoveAllItems = () => {
    clearLocalStorage();
    onRefresh();
  };

  const clearSearch = () => {
    methods1.setValue("barcode", "");
    methods1.setValue("category", "");
  };
  const closePermissionModal = () => {
    setTogglePermission(false);
  };
  useEffect(() => {
    if (hasPermission !== isValidated) {
      setHasPermission(isValidated);
      console.log("permission", isValidated);
    }
  }, [isValidated]);
  const clearMembership = () => {
    localStorage.removeItem("membership");

    localStorage.removeItem("voucher");
    methods3.setValue("discount", "0");
    methods3.setValue("points", "0");
    setTotalPoints(0);
    window.dispatchEvent(new Event("memberUpdated"));
    window.dispatchEvent(new Event("voucherUpdated"));
  };

  useEffect(() => {
    if (member) {
      if (member.discount) {
        methods3.setValue("discount", member.discount?.toString() ?? "0");
        methods3.setValue("points", "0");
      } else {
        methods3.setValue("discount", "");
        methods3.setValue("points", member.point?.toString() ?? "0");
        const convertedAmount = pointToAmount(member?.point ?? 0);
        setTotalPoints(convertedAmount);
        setPayment(MembershipType.POINT);
      }
      localStorage.removeItem("voucher");
    }
  }, [member]);

  useEffect(() => {
    if (storedVoucher) {
      methods3.setValue("discount", storedVoucher.discount?.toString() ?? "0");
      methods3.setValue("points", "0");
      setPayment("voucher");
      localStorage.removeItem("membership");
    }
  }, [storedVoucher]);
  return (
    <div className="flex w-full justify-between gap-4">
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <div className="w-full">
        <div className="grid grid-cols-4 gap-4">
          <Form
            methods={methods1}
            className="col-span-3 grid grid-cols-5 gap-4"
          >
            <div className="col-span-4 grid-cols-2 grid gap-4">
              <InputField
                label="Search by barcode or name"
                name="barcode"
                type="text"
              />
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
      <div className="flex flex-col border items-start justify-between bg-white shadow-lg min-h-screen max-h-screen min-w-[540px] max-w-[540px] p-4 gap-4">
        <p className="text-base flex justify-between items-center w-full">
          <span className="border flex items-center gap-2 rounded p-2">
            <CiReceipt className="text-2xl" />
            {orderId}
          </span>
          <Link
            href={`/admin/settings/users/${profile?._id}`}
            className="rounded-full flex gap-4 pl-6 border items-center"
          >
            <span>{profile?.firstName}</span>
            <ProfileComponent profile={profile} />
          </Link>
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
        <div className="flex flex-col border-b w-full pb-2 flex-grow scroll-container items-start">
          <HorizontalLinearStepper
            onRemoveAll={paymentMethod === ""}
            onPaymentChange={handlePaymentChange}
            step={paymentMethod}
            totalAmount={totalAmount}
          />
        </div>

        {toggleQRCode && (
          <BasicModal
            ContentComponent={PaymentQRCode}
            onClose={() => setToggleQRCode(false)}
            onAction={onComplete}
            open={toggleQRCode}
            text={String(totalAmount)}
          />
        )}
        {togglePermission && (
          <BasicModal
            ContentComponent={DiscountPermission}
            onClose={closePermissionModal}
            open={togglePermission}
            text={"Validation"}
          />
        )}
        {toggleConfirmOrder && (
          <BasicModal
            ContentComponent={ConfirmOrder}
            onAction={() => handleOrder(orderId)}
            onClose={() => setToggleConfirmOrder(false)}
            open={toggleConfirmOrder}
            text="Are you sure you want to place the order?"
          />
        )}
        {toggleMembership && (
          <BasicModal
            ContentComponent={Membership}
            onClose={() => setToggleMembership(false)}
            open={toggleMembership}
          />
        )}
        {toggleVoucher && (
          <BasicModal
            ContentComponent={Voucher}
            onClose={() => setToggleVoucher(false)}
            open={toggleVoucher}
          />
        )}
        <Form
          methods={methods3}
          className={`grid-cols-10 w-full grid items-center gap-2 justify-between`}
        >
          <div className="col-span-4 gap-2 flex w-full items-center justify-between">
            <div className="col-span-2 w-full">
              {
                <CustomButton
                  theme="general"
                  onHandleButton={() => setToggleVoucher(true)}
                  icon={RiCoupon3Line}
                />
              }
            </div>
            <div className="col-span-2 w-full">
              <CustomButton
                onHandleButton={() => setToggleMembership(true)}
                icon={LuUserRoundSearch}
                theme="general"
              />
            </div>
          </div>
          <div className="h-full col-span-6 grid grid-cols-6 justify-between items-center gap-2 w-full">
            <div
              className={`${
                member && member.point ? "col-span-3" : "col-span-5"
              } w-full`}
            >
              {hasPermission ? (
                <InputField
                  name="discount"
                  label="Apply Discount"
                  disabled={items.length === 0}
                  type="number"
                  isPercentage={true}
                />
              ) : (
                <CustomButton
                  text="Apply Discount"
                  onHandleButton={() => setTogglePermission(true)}
                  theme="general"
                />
              )}
            </div>

            {member && member.point && (
              <div className="col-span-2">
                <InputField
                  disabled={items.length === 0}
                  name="points"
                  label="Points"
                  type="number"
                />
              </div>
            )}
            <button
              disabled={items.length === 0}
              className="w-full m-auto flex-col items-center rounded h-full border
            flex justify-center"
            >
              <MdClose
                onClick={clearMembership}
                className={`text-xl ${
                  items.length === 0
                    ? "text-gray-500"
                    : "text-red-500 cursor-pointer"
                } cursor-pointer text-center`}
              />
            </button>
          </div>
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
            roleCodes={["1015"]}
            disabled={items.length <= 0}
            options={PaymentOptions}
            selectedValue={paymentMethod}
            onSelect={handleSelectPaymentMethod}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 w-full mb-5">
          <div className="col-span-2">
            <CustomButton
              roleCodes={["1015"]}
              theme={`${
                items.length <= 0 ||
                paymentMethod === "" ||
                paymentMethod === "khqr" ||
                (paymentMethod === "cash" && paidAmount === 0) ||
                (paymentMethod === "cash" && paidAmount < totalAmount)
                  ? "dark"
                  : ""
              }`}
              disabled={
                items.length <= 0 ||
                paymentMethod === "khqr" ||
                paymentMethod === "" ||
                (paymentMethod === "cash" && paidAmount === 0) ||
                (paymentMethod === "cash" && paidAmount < totalAmount)
              }
              onHandleButton={() => setToggleConfirmOrder(true)}
              text="Place Order"
            />
          </div>

          {heldCart === orderId ? (
            <CustomButton
              onHandleButton={onRemoveHoldOrder}
              roleCodes={["1015"]}
              icon={MdDelete}
              disabled={items.length <= 0}
              theme={`${items.length <= 0 ? "dark" : "alarm"}`}
            />
          ) : (
            <CustomButton
              onHandleButton={onRemoveAllItems}
              roleCodes={["1015"]}
              icon={VscClearAll}
              disabled={items.length <= 0}
              theme={`${items.length <= 0 ? "dark" : "alarm"}`}
            />
          )}

          <CustomButton
            roleCodes={["1015"]}
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
