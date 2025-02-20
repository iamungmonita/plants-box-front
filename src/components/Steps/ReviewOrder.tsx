import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import {
  handleDecrement,
  removeItem,
  updateCartItems,
} from "@/helpers/addToCart";
import { ShoppingCartProduct } from "../ShoppingCart";
import CartCard from "../CartCard";
import { LocalShipping, Store } from "@mui/icons-material";
import Form from "../Form";
import { FieldValues, useForm } from "react-hook-form";
import InputField from "../InputText";

export interface IShippingForm extends FieldValues {
  customer: string;
  contact: string;
  address: string;
}
const ReviewOrder = ({ handleNext }: { handleNext: () => void }) => {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);
  useEffect(() => {
    const { items, total } = updateCartItems();
    setItems(items);
    setAmount(total);
    const handleCartUpdate = () => {
      const { items, total } = updateCartItems();
      setItems(items);
      setAmount(total);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);
  const [isDelivery, setIsDelivery] = useState(true);

  const handleChange = () => {
    setIsDelivery((prev) => !prev);
  };
  const methods = useForm<IShippingForm>();
  const onSubmitForm = (data: IShippingForm) => {
    console.log(data);
    handleNext();
  };
  return (
    <div className="grid grid-cols-3 items-start w-full justify-between p-4">
      <h2 className="text-lg col-span-3 mb-4 font-semibold">Order Summary</h2>

      <div className="px-4 space-y-4 col-span-1 overflow-y-auto max-h-[70%]">
        <>
          {items.length > 0 &&
            items.map((item) => (
              <CartCard
                key={item._id}
                item={item}
                onDecrement={handleDecrement}
                onRemove={removeItem}
              />
            ))}
        </>
      </div>
      <div className="p-4 space-y-4 col-span-2">
        <h2 className="text-xl font-semibold">
          You have {items.length} items.
        </h2>
        {/* <div>
          <h2 className="text-xl font-semibold space-x-4">
            <span className="text-sm text-gray-500 font-base w-22">
              Subtotal:
            </span>
            <span>${amount.toFixed(2)}</span>
          </h2>
          <p className="font-semibold space-x-4">
            <span className="text-sm text-gray-500 font-base min-w-20">
              VAT:
            </span>
            <span>${(amount * 0.1).toFixed(2)}</span>
          </p>
        </div> */}
        <p>Do you prefer delivery or pick-up? </p>
        <div className="space-x-4">
          <Button
            variant={isDelivery ? "contained" : "outlined"}
            sx={{
              backgroundColor: isDelivery
                ? "var(--medium-light)"
                : "transparent",
              borderColor: "var(--medium-light)",
              color: isDelivery ? "white" : "var(--medium-light)",
            }}
            startIcon={<LocalShipping />}
            onClick={handleChange}
            className="flex-1 capitalize"
          >
            Delivery
          </Button>
          <Button
            variant={!isDelivery ? "contained" : "outlined"}
            sx={{
              borderColor: "var(--medium-light)",
              backgroundColor: !isDelivery
                ? "var(--medium-light)"
                : "transparent ",
              color: !isDelivery ? "white" : "var(--medium-light)",
            }}
            startIcon={<Store />}
            onClick={handleChange}
            className="flex-1 capitalize"
          >
            Pickup
          </Button>
        </div>

        <h2 className="text-2xl font-bold">
          {isDelivery ? "Shipping Information" : "Pick-up Information"}
        </h2>

        {/* <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-600">
            {items.map((row, index) => (
              <tr key={row._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">${row.price.toFixed(2)}</td>
                <td className="px-4 py-3">{row.quantity}</td>
                <td className="px-4 py-3">
                  ${(row.price * row.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
        <Form
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmitForm)}
          className="grid grid-cols-2 gap-4"
        >
          <InputField
            name="customer"
            type="text"
            label=""
            placeholder="Customer's Name"
          />
          <InputField
            name="contact"
            type="text"
            label=""
            placeholder="Phone Number"
          />
          {isDelivery ? (
            <div className="col-span-2">
              <InputField
                name="address"
                type="text"
                label=""
                placeholder="Address"
                multiline
                minRows={3}
              />
            </div>
          ) : (
            <div className="col-span-2">
              <InputField
                name="time"
                type="text"
                label=""
                placeholder="Pick-up time"
                multiline
                minRows={3}
              />
            </div>
          )}
          <Button
            type="submit"
            variant="contained"
            className="capitalize w-1/2"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ReviewOrder;
