import { IMember } from "@/services/membership";
import { useEffect, useState } from "react";

// Utility function to fetch and validate member data from localStorage
export const updateMember = (): IMember | null => {
  try {
    const storedMember = localStorage.getItem("membership");
    if (storedMember) {
      const parsedMember = JSON.parse(storedMember);
      // You can add further validation here if needed to check if the parsedMember is of type IMember
      return parsedMember;
    }
  } catch (error) {
    console.error("Error parsing membership data from localStorage", error);
  }
  return null;
};

export const useMembership = () => {
  const [member, setMember] = useState<IMember | null>(null);

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
  }, []); // Empty dependency array ensures this runs only once on mount

  return { member };
};
