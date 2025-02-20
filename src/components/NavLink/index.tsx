"use client";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiSolidLeaf } from "react-icons/bi";

export interface NavLink {
  id: number;
  name?: string;
  path: string;
  className?: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const NavLink = (props: NavLink) => {
  const { name, path, id, icon: Icon, className } = props;
  const router = usePathname();
  const [isMatched, setIsMatched] = useState<boolean>(false);

  useEffect(() => {
    if (path === "/" && router === "/") {
      setIsMatched(true); // Exact match for homepage
    } else {
      setIsMatched(router === path); // Exact match for other paths
    }
  }, [router, path]); // Effect runs whenever the router or path changes

  return (
    <Link
      href={`${path}`}
      key={id}
      className="relative flex gap-1 items-center"
    >
      <p
        className={`capitalize hover:font-semibold  ${
          isMatched && "text-green-800"
        } hover:text-green-800 text-center font-normal `}
      >
        {name && name}
        {Icon && <Icon className={`${className} text-3xl w-full`} />}
      </p>
      {isMatched && (
        <div
          className={`max-md:hidden ${"text-green-800 font-bold duration-300 transition-all "}`}
        >
          <BiSolidLeaf />
        </div>
      )}
    </Link>
  );
};

export default NavLink;
