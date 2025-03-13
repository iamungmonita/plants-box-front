"use client";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrder } from "@/services/order";

import ReusableTable from "@/components/Table";
import { columns } from "@/constants/TableHead/Dashboard";
import { getBestSellingProducts } from "@/services/products";
import BasicPie from "@/components/Chart";

import {
  getMonthRange,
  getWeekRange,
  getYearRange,
} from "@/helpers/calculation/getDate";
import { IChart, IRange } from "@/models/Product";
import { PurchasedOrderList } from "@/models/Order";

const Page = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [orders, setOrders] = useState<PurchasedOrderList[]>([]);
  const [transactions, setTransactions] = useState<number>(0);
  const [weekly, setWeekly] = useState<IRange | null>(null);
  const [monthly, setMonthly] = useState<IRange | null>(null);
  const [yearly, setYearly] = useState<IRange | null>(null);
  const { isAuthenticated } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const today = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD\
  const [products, setProducts] = useState<IChart[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
    setSelectedDate(today);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (selectedDate) {
      const fetch = async () => {
        const weekRange = getWeekRange();
        const monthRange = getMonthRange();
        const yearRange = getYearRange();

        try {
          const [
            responses,
            todayResponse,
            weeklyResponse,
            monthlyResponse,
            yearlyResponse,
          ] = await Promise.all([
            getBestSellingProducts(),
            getOrder({ start: selectedDate, end: selectedDate }),
            getOrder({ start: weekRange.start, end: weekRange.end }),
            getOrder({
              start: monthRange.monthStart,
              end: monthRange.monthEnd,
            }),
            getOrder({ start: yearRange.yearStart, end: yearRange.yearEnd }),
          ]);
          if (responses.data) {
            const products = responses.data
              ?.slice(0, 10)
              .map(({ _id, soldQty, name }) => ({
                id: _id,
                value: soldQty,
                label: name,
              }));
            setProducts(products);
          }

          if (todayResponse.data) {
            setOrders(todayResponse.data.orders);
            setAmount(todayResponse.data.amount);
            setTransactions(todayResponse.data.count);
          }
          if (weeklyResponse.data) {
            setWeekly({
              amount: weeklyResponse.data.amount,
              total: weeklyResponse.data.count,
            });
          }
          if (monthlyResponse.data) {
            setMonthly({
              amount: monthlyResponse.data.amount,
              total: monthlyResponse.data.count,
            });
          }
          if (yearlyResponse.data) {
            setYearly({
              amount: yearlyResponse.data.amount,
              total: yearlyResponse.data.count,
            });
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetch();
    }
  }, [selectedDate]);

  return (
    <div>
      {isAuthenticated && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="grid grid-cols-3 gap-5 justify-between items-center">
            <div className="space-y-1">
              <div className="bg-gray-100 shadow-lg col-span-1 p-5 flex flex-col  justify-between rounded-lg">
                <span className="flex text-xl font-semibold justify-between">
                  <span>This Week:</span>
                  <span>${weekly?.amount.toFixed(2)}</span>
                </span>
                <span className="flex justify-between">
                  <span className="font-semibold"> Sales:</span>
                  <span>{weekly?.total}</span>
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="bg-gray-100 shadow-lg col-span-1 p-5 flex flex-col  justify-between rounded-lg">
                <span className="flex text-xl font-semibold justify-between">
                  <span>This Month:</span>
                  <span>${monthly?.amount.toFixed(2)}</span>
                </span>
                <span className="flex justify-between">
                  <span className="font-semibold"> Sales:</span>
                  <span>{monthly?.total}</span>
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="bg-gray-100 shadow-lg col-span-1 p-5 flex flex-col  justify-between rounded-lg">
                <span className="flex text-xl font-semibold justify-between">
                  <span className="">This Year:</span>
                  <span>${yearly?.amount.toFixed(2)}</span>
                </span>
                <span className="flex justify-between">
                  <span className="font-semibold">Sales:</span>
                  <span>{yearly?.total}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="bg-gray-100 shadow-lg col-span-1 p-5 flex flex-col justify-between rounded-lg">
                  <span className="flex text-xl font-semibold gap-4 justify-end">
                    <span>Today:</span>
                    <span>${amount.toFixed(2)}</span>
                  </span>
                  <span className="flex justify-end gap-4">
                    <span className="font-semibold"> Sales:</span>
                    <span>{transactions}</span>
                  </span>
                </div>
              </div>

              <div className="shadow-lg">
                <ReusableTable
                  columns={columns}
                  data={orders}
                  onRowClick={(row) =>
                    router.push(`/admin/sale/${row.purchasedId}`)
                  }
                />
              </div>
            </div>
            <div className="p-4 shadow-lg min-h-[85vh] flex flex-col h-full rounded-lg border w-full">
              <h2 className="text-2xl font-bold">Top 10 Best Sellers</h2>
              <div className="p-4 w-full flex flex-col h-full justify-center">
                <BasicPie data={products} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
