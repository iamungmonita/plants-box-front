"use client";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrder } from "@/services/order";
import { PurchasedOrderList } from "@/schema/order";
import ReusableTable from "@/components/Table";
import { columns } from "@/constants/TableHead/Orders";
import { formattedTimeStamp } from "@/helpers/format/time";
import {
  getMonthRange,
  getWeekRange,
  getYearRange,
} from "@/helpers/calculation/getDate";
import { TbCoin } from "react-icons/tb";
const page = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [orders, setOrders] = useState<PurchasedOrderList[]>([]);
  const [transactions, setTransactions] = useState<number>(0);
  const [weekly, setWeekly] = useState<{
    total: number;
    amount: number;
  } | null>(null);
  const [monthly, setMonthly] = useState<{
    total: number;
    amount: number;
  } | null>(null);
  const [yearly, setYearly] = useState<{
    total: number;
    amount: number;
  } | null>(null);

  const { isAuthenticated } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const today = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
  const { start, end } = getWeekRange();
  const { monthStart, monthEnd } = getMonthRange();
  const { yearEnd, yearStart } = getYearRange();

  // Function to get the start and end of the current week (Monday to Sunday)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
    console.log(start, end);
    setSelectedDate(today);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (selectedDate) {
      const fetchOrders = async () => {
        const today = new Date();

        // Get weekly, monthly, and yearly ranges
        const weekRange = getWeekRange();
        const monthRange = getMonthRange();
        const yearRange = getYearRange();

        try {
          const [
            todayResponse,
            weeklyResponse,
            monthlyResponse,
            yearlyResponse,
          ] = await Promise.all([
            getOrder({ start: selectedDate, end: selectedDate }),
            getOrder({ start: weekRange.start, end: weekRange.end }),
            getOrder({
              start: monthRange.monthStart,
              end: monthRange.monthEnd,
            }),
            getOrder({ start: yearRange.yearStart, end: yearRange.yearEnd }),
          ]);

          // Update states
          if (todayResponse.data) {
            setOrders(todayResponse.data.orders);
          }
          if (weeklyResponse.data) {
            setWeekly({
              total: weeklyResponse.data.amount,
              amount: weeklyResponse.data.count,
            });
          }
          if (monthlyResponse.data) {
            setMonthly({
              total: monthlyResponse.data.amount,
              amount: monthlyResponse.data.count,
            });
          }
          if (yearlyResponse.data) {
            setYearly({
              total: yearlyResponse.data.amount,
              amount: yearlyResponse.data.count,
            });
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, [selectedDate]);
  // Run when selectedDate changes

  return (
    <div>
      {isAuthenticated && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="grid grid-cols-4 gap-4 justify-between items-center">
            <div className="space-y-1">
              <h2 className="font-semibold">Daily Earning</h2>
              <div className="bg-gray-100 col-span-1 px-4 py-2 flex flex-col  justify-between rounded-lg">
                <span className="flex justify-between">
                  <span>Total:</span>
                  <span>${amount.toFixed(2)}</span>
                </span>
                <span className="flex justify-between">
                  <span className="font-semibold"> Transactions:</span>
                  <span>{transactions}</span>
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold">Weekly Earning</h2>
              <div className="bg-gray-100 col-span-1 px-4 py-2 flex flex-col  justify-between rounded-lg">
                <span className="flex justify-between">
                  <span>Total:</span>
                  <span>${weekly?.total.toFixed(2)}</span>
                </span>
                <span className="flex justify-between">
                  <span className="font-semibold"> Transactions:</span>
                  <span>{weekly?.amount}</span>
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold">Monthly Earning</h2>
              <div className="bg-gray-100 col-span-1 px-4 py-2 flex flex-col  justify-between rounded-lg">
                <span className="flex justify-between">
                  <span>Total:</span>
                  <span>${monthly?.total.toFixed(2)}</span>
                </span>
                <span className="flex justify-between">
                  <span className="font-semibold"> Transactions:</span>
                  <span>{monthly?.amount}</span>
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold">Yearly Earning</h2>
              <div className="bg-gray-100 col-span-1 px-4 py-2 flex flex-col  justify-between rounded-lg">
                <span className="flex justify-between">
                  <span>Total:</span>
                  <span>${yearly?.total.toFixed(2)}</span>
                </span>
                <span className="flex justify-between">
                  <span className="font-semibold"> Transactions:</span>
                  <span>{yearly?.amount}</span>
                </span>
              </div>
            </div>
            {/* <p className="bg-gray-100 px-4 py-2 flex items-center justify-between rounded-lg">
              <span className="font-semibold"> Total:</span>
            </p>
            <p className="bg-gray-100 px-4 py-2 flex items-center justify-between rounded-lg">
              <span className="font-semibold"> Transactions:</span>
              <span>{transactions}</span>
            </p> */}
          </div>
          {orders.length > 0 && (
            <ReusableTable
              columns={columns}
              data={orders}
              onRowClick={() => console.log(orders.map((order) => order))}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default page;
