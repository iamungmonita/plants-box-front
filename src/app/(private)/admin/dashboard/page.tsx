"use client";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrder } from "@/services/order";
import { PurchasedOrderList } from "@/schema/order";
import ReusableTable from "@/components/Table";
import { columns } from "@/constants/TableHead/Orders";
import { formattedTimeStamp } from "@/helpers/format/time";

const page = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [orders, setOrders] = useState<PurchasedOrderList[]>([]);
  const [transactions, setTransactions] = useState<number>(0);
  const { isAuthenticated } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
    const today = new Date().toLocaleDateString("en-CA");
    setSelectedDate(today);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (selectedDate) {
      const fetch = async () => {
        const response = await getOrder({
          start: selectedDate,
          end: selectedDate,
        });
        if (response.data) {
          setAmount(response.data.amount);
          setTransactions(response.data.count);
          setOrders(response.data.orders);
        }
      };
      fetch();
    }
  }, [selectedDate]); // Run when selectedDate changes

  return (
    <div>
      {isAuthenticated && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="grid grid-cols-6 gap-4 justify-between items-center">
            <p className="bg-gray-100 px-4 py-2 flex items-center justify-between rounded-lg">
              <span className="font-semibold"> Date:</span>
              <span>
                {formattedTimeStamp(new Date().toISOString(), "DD-MMM-YYYY")}
              </span>
            </p>
            <p className="bg-gray-100 px-4 py-2 flex items-center justify-between rounded-lg">
              <span className="font-semibold"> Total:</span>
              <span>${amount.toFixed(2)}</span>
            </p>
            <p className="bg-gray-100 px-4 py-2 flex items-center justify-between rounded-lg">
              <span className="font-semibold"> Transactions:</span>
              <span>{transactions}</span>
            </p>
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
