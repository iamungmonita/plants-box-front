import NavLink from "@/components/NavLink";
import { nav } from "@/constants/navigation";
import React from "react";
import { FiSearch } from "react-icons/fi";
import {
  PiMagnifyingGlass,
  PiMagnifyingGlassLight,
  PiShoppingCartSimple,
} from "react-icons/pi";

const Mobile = ({
  setToggleSearchBar,
  toggleSearchBar,
}: {
  setToggleSearchBar: (toggle: boolean) => void;
  toggleSearchBar: boolean;
}) => {
  return (
    <div className="grid grid-cols-4 fixed  border-t-2 bg-white bottom-12 text-center py-2 z-30 w-full">
      {nav.map((nav) => (
        <div key={nav.id} className="text-center text-green-800 border-r-2">
          <NavLink path={nav.path} id={nav.id} icon={nav.icon} className="" />
        </div>
      ))}
    </div>
  );
};

export default Mobile;
