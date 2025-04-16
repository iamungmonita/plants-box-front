import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPie({ data }: { data: any[] }) {
  return (
    <PieChart
      width={650}
      height={300} // increase height to give space
      series={[{ data }]}
      margin={{ top: 20, right: 300, bottom: 20, left: 20 }} // adjust as needed
      slotProps={{
        legend: {
          direction: "column",
          position: { vertical: "middle", horizontal: "right" },
          itemMarkWidth: 16,
          itemGap: 12,
        },
      }}
    />
  );
}
