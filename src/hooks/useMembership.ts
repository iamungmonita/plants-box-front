import { IMemberResponse } from "@/services/membership";
import { useEffect, useState } from "react";

export const updateMember = (): {
  phone: string;
  points?: number;
  discount?: number;
} | null => {
  try {
    const storedMember = localStorage.getItem("membership");
    if (storedMember) {
      const parsedMember = JSON.parse(storedMember);
      return parsedMember;
    }
  } catch (error) {
    console.error("Error parsing membership data from localStorage", error);
  }
  return null;
};

export const useMembership = () => {
  const [member, setMember] = useState<{
    phone: string;
    point?: number;
    discount?: number;
  } | null>(null);

  useEffect(() => {
    const storedMember = updateMember();
    setMember(storedMember);

    const handleMembership = () => {
      const updatedMember = updateMember();
      setMember(updatedMember);
    };

    window.addEventListener("memberUpdated", handleMembership);
    return () => {
      window.removeEventListener("memberUpdated", handleMembership);
    };
  }, []);

  return { member };
};
