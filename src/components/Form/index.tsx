import React from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

export interface FormPropsType<T extends FieldValues> {
  children: React.ReactNode;
  onSubmit?: (data: T) => void;
  methods: UseFormReturn<T>;
  className?: string;
}

const Form = <T extends FieldValues>(props: FormPropsType<T>) => {
  const { methods, onSubmit, children, className } = props;
  const { handleSubmit } = methods;
  const onSubmitForm = (data: T) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className={`${className}`} onSubmit={handleSubmit(onSubmitForm)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
