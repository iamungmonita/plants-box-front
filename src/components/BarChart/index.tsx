import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend, // Add the Legend component
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { getMonthlyExpense } from "@/services/system";
import moment from "moment";
import { getMonthlySale } from "@/services/order";

// const data = [
//   { month: "Jan", expense: 1200 },
//   { month: "Feb", expense: 950 },
//   { month: "Mar", expense: 1600 },
//   { month: "Apr", expense: 1100 },
//   { month: "May", expense: 1400 },
//   { month: "Jun", expense: 1250 },
//   { month: "Jul", expense: 1700 },
//   { month: "Aug", expense: 1300 },
//   { month: "Sep", expense: 1500 },
//   { month: "Oct", expense: 1450 },
//   { month: "Nov", expense: 1350 },
//   { month: "Dec", expense: 1550 },
// ];

const BarChartComponent = () => {
  const { data: expenses } = useFetch(getMonthlyExpense, {}, []);
  const { data: sales } = useFetch(getMonthlySale, {}, []);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedData = months.map((month) => {
    const expense = expenses?.find((exp) => exp.month === month);
    const sale = sales?.find((sale) => sale.month === month);

    return {
      month: month,
      expense: expense ? expense.expense : 0,
      sale: sale ? sale.sale : 0,
    };
  });
  return (
    <Card sx={{ textTransform: "capitalize", boxShadow: "none" }}>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formattedData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="expense" fill="#D50000" barSize={10} />
            <Bar dataKey="sale" fill="#6d8a74" barSize={10} />
            <Legend /> {/* Add the Legend component here */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
