import { VoucherResponse } from "@/models/Voucher";
import { IMemberResponse } from "@/services/membership";
import { useEffect, useState } from "react";

export const updateVoucher = (): VoucherResponse | null => {
  try {
    const storedMember = localStorage.getItem("voucher");
    if (storedMember) {
      const parsedMember = JSON.parse(storedMember);
      return parsedMember;
    }
  } catch (error) {
    console.error("Error parsing membership data from localStorage", error);
  }
  return null;
};

export const useVoucher = () => {
  const [voucher, setVoucher] = useState<VoucherResponse | null>(null);

  useEffect(() => {
    const storedMember = updateVoucher();
    setVoucher(storedMember);

    const handleMembership = () => {
      const updatedMember = updateVoucher();
      setVoucher(updatedMember);
    };

    window.addEventListener("voucherUpdated", handleMembership);
    return () => {
      window.removeEventListener("voucherUpdated", handleMembership);
    };
  }, []);

  return { voucher };
};
