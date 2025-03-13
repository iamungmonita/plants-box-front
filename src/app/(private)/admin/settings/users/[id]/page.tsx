"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const CreatePage = dynamic(() => import("../create/page"), {
  ssr: false,
});

const Page = () => {
  const params = useParams();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (!params?.id) return;
    setUserId(params.id as string);
  }, [params]);
  return (
    <div>
      <div className="grid grid-cols-2 p-4 gap-4 max-xl:grid-cols-1">
        <div className="shadow p-4 space-y-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl">{userId}</h2>
          </div>
          <CreatePage userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
