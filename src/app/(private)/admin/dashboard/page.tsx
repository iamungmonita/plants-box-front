"use client";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrder } from "@/services/order";
import useFetch from "@/hooks/useFetch";
import ReusableTable from "@/components/Table";
import { columns } from "@/constants/TableHead/Dashboard";
import { getAllProducts, getBestSellingProducts } from "@/services/products";
import BasicPie from "@/components/Chart";
import { dashboard } from "@/constants/TableHead/Product";
import {
  getMonthRange,
  getWeekRange,
  getYearRange,
} from "@/helpers/calculation/getDate";
import { IChart, IRange, ProductResponse } from "@/models/Product";
import { PurchasedOrderList } from "@/models/Order";
import BarChartComponent from "@/components/BarChart";

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
  const { data: allProducts } = useFetch(getAllProducts, {}, []);

  useEffect(() => {
    setSelectedDate(today);
  }, []);

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
          console.log("Error fetching orders:", error);
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
          <div className="grid grid-cols-4 gap-5 justify-between items-center">
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

            <div className="space-y-1">
              <div className="bg-gray-100 shadow-lg col-span-1 p-5 flex flex-col  justify-between rounded-lg">
                <span className="flex text-xl font-semibold gap-4 justify-end">
                  <span>This Week:</span>
                  <span>${weekly?.amount.toFixed(2)}</span>
                </span>
                <span className="flex justify-end gap-4">
                  <span className="font-semibold"> Sales:</span>
                  <span>{weekly?.total}</span>
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="bg-gray-100 shadow-lg col-span-1 p-5 flex flex-col  justify-between rounded-lg">
                <span className="flex text-xl font-semibold gap-4 justify-end">
                  <span>This Month:</span>
                  <span>${monthly?.amount.toFixed(2)}</span>
                </span>
                <span className="flex justify-end gap-4">
                  <span className="font-semibold"> Sales:</span>
                  <span>{monthly?.total}</span>
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="bg-gray-100 shadow-lg col-span-1 p-5 flex flex-col  justify-between rounded-lg">
                <span className="flex text-xl font-semibold gap-4 justify-end">
                  <span className="">This Year:</span>
                  <span>${yearly?.amount.toFixed(2)}</span>
                </span>
                <span className="flex justify-end gap-4">
                  <span className="font-semibold">Sales:</span>
                  <span>{yearly?.total}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-1 shadow-lg bg-[#9eb79c] rounded-lg max-h-[47vh] min-h-[47vh] h-full">
              <div className="col-span-1 px-5 my-1 py-2 flex  flex-col justify-between">
                <h2 className="flex text-xl text-black font-semibold gap-4  justify-start">
                  Today's Sale Overview
                </h2>
              </div>
              <ReusableTable
                columns={columns}
                data={orders}
                rowsPerPageOptions={[5]}
                onRowClick={(row) =>
                  router.push(`/admin/sale/${row.purchasedId}`)
                }
              />
            </div>

            <div className="col-span-1 flex gap-5">
              <div className="col-span-1 shadow-lg bg-[#eab308] rounded-lg min-h-[47vh] h-full max-h-[47vh] w-full">
                <div className="col-span-1 px-5 py-2 my-1 flex flex-col justify-between">
                  <h2 className="flex text-black text-xl font-semibold gap-4 justify-start">
                    Low on Stock
                  </h2>
                </div>
                <ReusableTable
                  columns={dashboard}
                  rowsPerPageOptions={[5]}
                  data={allProducts
                    .filter(
                      (product): product is ProductResponse =>
                        product !== null &&
                        product.stock > 0 &&
                        product.stock < 3
                    )
                    .sort((a, b) => a.stock - b.stock)}
                  onRowClick={(row) =>
                    router.push(`/admin/products/${row._id}`)
                  }
                />
              </div>
              <div className="col-span-1 w-full shadow-lg rounded-lg bg-[#D50000] max-h-[47vh] min-h-[47vh] h-full">
                <div className="col-span-1 my-1 px-5 py-2 flex flex-col justify-between">
                  <h2 className="flex text-xl text-black font-semibold gap-4 justify-start">
                    Out of Stock
                  </h2>
                </div>
                <ReusableTable
                  columns={dashboard}
                  rowsPerPageOptions={[5]}
                  data={allProducts.filter((product) => product.stock === 0)}
                />
              </div>
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-5">
            <div className="col-span-1 row-span-1 mt-14">
              <div className="p-4 shadow-lg max-h-[35vh] min-h-[35vh] flex flex-col h-full rounded-lg border w-full">
                <h2 className="text-2xl font-bold">Top 10 Best Sellers</h2>
                <div className="p-4 w-full flex flex-col h-full justify-center">
                  <BasicPie data={products} />
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1 mt-14">
              <div className="p-4 shadow-lg max-h-[35vh] min-h-[35vh] flex flex-col h-full rounded-lg border w-full">
                <h2 className="text-2xl font-bold">Monthly Sales & Expenses</h2>
                <div className="p-4 w-full flex flex-col h-full justify-center">
                  <BarChartComponent />
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
