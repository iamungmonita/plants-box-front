"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
const CreatePage = dynamic(
  () => import("../../../../../../components/Form/Membership/index")
);

const Page = () => {
  const params = useParams();
  const [memberId, setMemberId] = useState<string>("");
  useEffect(() => {
    if (!params?.memberId) return;
    setMemberId(params.memberId as string);
  }, [params]);
  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full">
      <CreatePage memberId={memberId} />
    </div>
  );
};

export default Page;
