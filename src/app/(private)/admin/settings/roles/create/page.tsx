"use client";

import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import { CreateRole, getRoleById, updateRoleById } from "@/services/system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertPopUp from "@/components/AlertPopUp";
import { IRole } from "@/models/Roles";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const [roleId, setRoleId] = useState<string>("");
  const [toggleAlert, setToggleAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const methods = useForm<IRole>({
    defaultValues: {
      name: "",
      codes: [],
      remark: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!params?.roleId) return;
    setRoleId(params.roleId as string);
  }, [params]);

  // const { profile } = useAuthContext();
  const onSubmitForm = async (form: IRole) => {
    const response = roleId
      ? await updateRoleById(roleId, form)
      : await CreateRole(form);
    if (response.message) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(response.message);
    } else {
      setToggleAlert(true);
      setError(false);
      setAlertMessage("Success!");
      if (!roleId) {
        methods.setValue("name", "");
        methods.setValue("remark", "");
        methods.setValue("codes", []); // Reset the permissions (CheckboxGroup)
        methods.setValue("isActive", true);
      }
    }
  };

  useEffect(() => {
    if (!roleId) return;
    const fetch = async () => {
      const response = await getRoleById(roleId);
      if (response.data) {
        methods.setValue("name", response.data.name);
        methods.setValue("codes", response.data.codes || []);
        methods.setValue("isActive", response.data.isActive);
        methods.setValue("remark", response.data.remark);
      } else {
        console.log("error retrieving role.");
      }
    };
    fetch();
  }, [roleId]);

  return (
    <>
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="max-w-[750px] w-full">
          <h2 className="text-center font-semibold text-lg uppercase mb-5">
            {roleId ? "Update" : "Create"} Role
          </h2>
          <Form
            methods={methods}
            className="grid grid-cols-1 p-2 space-y-6"
            onSubmit={onSubmitForm}
          >
            <InputField name="name" type="text" label="" placeholder="Role" />
            <Checkbox name="isActive" label="Is Active" />
            <InputField
              name="remark"
              type="text"
              label=""
              placeholder="Remarks"
            />
            <CheckboxGroup />
            <div className="w-2/5 mx-auto">
              <CustomButton
                roleCodes={["1007", "1012"]}
                text={roleId ? "Update" : "Create"}
                type="submit"
              />
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
