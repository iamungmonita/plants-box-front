import { AttachMoney, MoneySharp, QrCode2 } from "@mui/icons-material";
import { PiMoneyFill } from "react-icons/pi";
import { TbCurrencyDollar } from "react-icons/tb";

export const optionsCurrency = [
  { value: "usd", label: "USD" },
  { value: "khr", label: "KHR" },
];
export const optionsMethod = [
  {
    value: "khqr",
    image: "/assets/KHQR.png",
  },
  {
    value: "card",
    image: "/assets/visa.png",
  },
  {
    value: "cash",
    label: "Cash",
  },
];
