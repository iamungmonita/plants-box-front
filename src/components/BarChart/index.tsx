import React from "react";
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
