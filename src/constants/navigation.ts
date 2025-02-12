import {
  PiHouse,
  PiPlant,
  PiMapPinArea,
  PiPottedPlant,
  PiInfo,
} from "react-icons/pi";
import { GiContract, GiPlantWatering } from "react-icons/gi";
import { GrContactInfo } from "react-icons/gr";
export const nav = [
  { id: 1, name: "home", path: "/", icon: PiHouse, iconSize: 30 }, // Set the size here
  {
    id: 2,
    name: "products",
    path: "/products",
    icon: PiPottedPlant,
    iconSize: 30,
  },
  {
    id: 3,
    name: "services",
    path: "/services",
    icon: GiPlantWatering,
    iconSize: 30,
  },
  { id: 4, name: "about", path: "/about", icon: PiInfo, iconSize: 30 },
];
