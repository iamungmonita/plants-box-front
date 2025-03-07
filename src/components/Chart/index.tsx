import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPie({ data }: { data: any }) {
  return (
    <PieChart
      sx={{
        "& text": { fontFamily: "var(--text)", fontSize: 20, fill: "black" }, // Apply font to all text inside SVG
      }}
      series={[
        {
          data: data,
        },
      ]}
      width={700}
      height={400}
    />
  );
}
