"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  cancelOrderById,
  getPurchasedOrderByPurchasedId,
  retrieveOrderById,
} from "@/services/order";
import { formattedTimeStamp } from "@/helpers/format/time";
import CustomButton from "@/components/Button";
import classNames from "classnames";
import useFetch from "@/hooks/useFetch";
import {
  getOrderLabel,
  getPaymentLabel,
  OrderStatus,
} from "@/constants/Status";
import { TfiPrinter } from "react-icons/tfi";
import BasicModal from "@/components/Modal";
import ConfirmOrder from "@/components/Modals/ConfirmOrder";
import {
  getAllProducts,
  UpdateCancelledProductById,
  updateProductStockById,
} from "@/services/products";
import { PurchasedOrderList } from "@/models/Order";
import { IAuthRegister } from "@/models/Auth";

const Page = () => {
  const params = useParams();
  const [purchasedId, setPurchasedId] = useState<string>("");
  const [order, setOrder] = useState<PurchasedOrderList | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const { data: products } = useFetch(getAllProducts, {}, []);

  const getStatusClass = (statusOrder: number) => {
    switch (statusOrder) {
      case OrderStatus.PENDING:
        return "text-yellow-600 bg-yellow-100 px-3 rounded-lg";
      case OrderStatus.COMPLETE:
        return "text-green-600 bg-green-100 px-3 rounded-lg";
      case OrderStatus.CANCELLED:
        return "text-red-600 bg-red-100 px-3 rounded-lg";
      default:
        return "text-gray-600 bg-gray-100 px-3 rounded-lg";
    }
  };

  useEffect(() => {
    if (!params?.purchasedId) return;
    setPurchasedId(params.purchasedId as string);
  }, [params]);

  useEffect(() => {
    if (!purchasedId) return;
    const fetchProduct = async () => {
      try {
        const response = await getPurchasedOrderByPurchasedId(purchasedId);
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setOrder(response.data[0]);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProduct();
  }, [purchasedId, refresh]);

  const onHandleCancel = async (id: string) => {
    await cancelOrderById(id);
    if (order?.orders) {
      await Promise.all(
        order.orders.map((order) =>
          UpdateCancelledProductById(order._id, { qty: order.quantity })
        )
      );
    }
  };
  const onHandleRetrieve = async (id: string) => {
    const totalAmount = order?.orders.reduce(
      (acc, sum) => acc + sum.price * sum.quantity,
      0
    );
    await retrieveOrderById(id, { total: totalAmount ?? 0 });
    if (order?.orders) {
      await Promise.all(
        order.orders.map((order) =>
          updateProductStockById(order._id, { qty: order.quantity })
        )
      );
    }
  };
  const onHandleAction = async (id: string) => {
    if (order?.orderStatus === OrderStatus.CANCELLED) {
      await onHandleRetrieve(id);
    } else if (order?.orderStatus === OrderStatus.COMPLETE) {
      await onHandleCancel(id);
    }
    setToggleModal(false);
    setRefresh((prev) => !prev);
  };

  const onHandlePrint = () => {
    window.open(`/print/${purchasedId}`, "_blank", "width=800,height=600");
  };
  return (
    <div>
      {order && (
        <BasicModal
          ContentComponent={ConfirmOrder}
          onAction={() => onHandleAction(order._id)}
          onClose={() => setToggleModal(false)}
          open={toggleModal}
          text={`Are you sure you want to ${
            order.orderStatus === OrderStatus.CANCELLED ? "retrieve" : "cancel"
          } the order?`}
        />
      )}

      {order && (
        <div
          key={order._id}
          className="rounded-lg mx-auto px-0 flex-wrap text-sm text-gray-600 lg:text-base max-w-[600px] lg:max-w-full"
        >
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-primaryText dark:text-darkPrimaryText">
                Purchased ID: {order.purchasedId}
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <div className=" w-[100px]">
                <CustomButton
                  onHandleButton={onHandlePrint}
                  icon={TfiPrinter}
                />
              </div>
              {order.orderStatus === OrderStatus.COMPLETE && (
                <CustomButton
                  onHandleButton={() => setToggleModal(true)}
                  theme="alarm"
                  text="Cancel Order"
                  roleCodes={["1002"]}
                />
              )}
              {order.orderStatus === OrderStatus.CANCELLED && (
                <CustomButton
                  onHandleButton={() => setToggleModal(true)}
                  theme="general"
                  text="Retrieve Order"
                  roleCodes={["1002"]}
                />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center  rounded">
              <span className="flex items-center font-semibold">Date:</span>
              <span className="text-sm">
                {formattedTimeStamp(order.createdAt, "DD MMM yyyy hh:mm:ss a")}
              </span>
            </div>
            <div className="flex items-center mb-5 gap-2 rounded">
              <span className="flex items-center font-semibold">Seller:</span>
              {order?.createdBy && (
                <span className="text-sm">
                  {(order.createdBy as IAuthRegister)?.firstName}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 h-full rounded-lg p-4 border">
                <div className="flex gap-4 flex-col text-gray-500 ">
                  <div className="flex border-b pb-4 justify-between items-center  w-full ">
                    <h2 className="text-xl font-bold">
                      Order Items ({order.orders.length})
                    </h2>
                    <span
                      className={classNames(getStatusClass(order.orderStatus))}
                    >
                      Order {getOrderLabel(order.orderStatus)}
                    </span>
                  </div>
                  <div className="flex flex-col text-gray-500 gap-2 rounded-lg text-lg">
                    <div className="flex gap-4 flex-col text-gray-500 scroll-container overflow-y-scroll max-h-[50vh] h-full">
                      {order.orders.map((row) => {
                        const product = products.find(
                          (product) => product._id === row._id
                        );
                        return (
                          <div className="rounded-lg" key={row._id}>
                            <div className="w-full flex border p-4 rounded-lg">
                              <div className="relative w-[150px] h-[100px]">
                                <Image
                                  title={row.name}
                                  src={
                                    product?.pictures || "/assets/default.png"
                                  }
                                  alt={row.name as string}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover rounded p-1"
                                />
                              </div>
                              <div className="p-4 text-sm w-full">
                                <h2 className="text-lg">{row.name}</h2>
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex gap-2">
                                    <span>${row.price.toFixed(2)}</span>
                                    <span>x</span>
                                    <span>{row.quantity}</span>
                                  </div>
                                  <h2 className="text-lg">
                                    ${(row.price * row.quantity).toFixed(2)}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg p-4 text-lg border">
                  <div className="flex flex-col text-gray-500">
                    <div className="flex justify-between w-full border-b pb-4 items-center">
                      <h2 className="text-xl font-bold">Payment Summary</h2>
                    </div>
                    <p className="flex justify-between mt-4">
                      <span className="font-bold">Subtotal</span>
                      <span>${Number(order.amount).toFixed(2)}</span>
                    </p>
                    <div className="flex gap-1 flex-col">
                      <p className="flex justify-between">
                        <span className="font-bold">Discount:</span>
                        <span>{Number(order.totalDiscountPercentage)}%</span>
                      </p>
                    </div>
                    <p className="flex justify-between">
                      <span className="font-bold">Points:</span>
                      <span>${Number(order.totalPoints).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Voucher:</span>
                      <span>{Number(order.others) || "-"}</span>
                    </p>
                    <h2 className="flex justify-between text-xl">
                      <span className="font-bold">Total:</span>
                      <span>${Number(order.totalAmount).toFixed(2)}</span>
                    </h2>
                    <p className="flex justify-between">
                      <span className="font-bold">Paid Amount:</span>
                      <span>${Number(order.paidAmount).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Changed Amount:</span>
                      <span>${Number(order.changeAmount).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 rounded-lg h-full p-4 text-lg border">
                    <div className="flex flex-col text-gray-500">
                      <div className="flex justify-between border-b pb-4 items-center">
                        <h2 className="text-xl font-bold">Customer Details</h2>
                        <span
                          className={classNames(
                            getStatusClass(order.paymentStatus),
                            "text-base"
                          )}
                        >
                          Payment {getPaymentLabel(order.paymentStatus)}
                        </span>
                      </div>
                      <p className="flex justify-between mt-4">
                        <span className="font-bold">Payment Method:</span>
                        <span className="capitalize">
                          {order.paymentMethod}
                        </span>
                      </p>
                      <div className="flex gap-1 flex-col">
                        <p className="flex justify-between">
                          <span className="font-bold">Membership:</span>
                          <span>
                            {order.member?.type || "Walk-in Customer"}
                          </span>
                        </p>
                      </div>
                      <p className="flex justify-between">
                        <span className="font-bold">Contact:</span>
                        <span>{order.member?.phoneNumber || "-"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
