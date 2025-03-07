import React from "react";
import { useFormContext } from "react-hook-form";
export interface ICheckbox {
  name: string;
  label: string;
}
const Checkbox = ({ name, label }: ICheckbox) => {
  const { register } = useFormContext();
  return (
    <label htmlFor={name} className="flex items-center">
      <input
        type="checkbox"
        className="h-5 w-5"
        id={name}
        {...register(name)}
      />
      <p className=" ml-4">{label}</p>
    </label>
  );
};

export default Checkbox;
