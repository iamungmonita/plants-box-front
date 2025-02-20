import NavLink from "@/components/NavLink";
import { nav } from "@/constants/navigation";
import React from "react";

const Mobile = ({
  setToggleSearchBar,
  toggleSearchBar,
}: {
  setToggleSearchBar: (toggle: boolean) => void;
  toggleSearchBar: boolean;
}) => {
  return (
    <div className="grid grid-cols-4 fixed  shadow py-3 bg-white bottom-0 text-center justify-center z-30 w-full">
      {nav.map((nav) => (
        <div key={nav.id} className="text-center text-green-800 border-r-2">
          <NavLink path={nav.path} id={nav.id} icon={nav.icon} />
        </div>
      ))}
    </div>
  );
};

export default Mobile;
