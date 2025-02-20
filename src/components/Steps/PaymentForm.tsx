import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
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
import { IShippingForm } from "./ReviewOrder";
import { formattedTimeStamp } from "@/helpers/format-time";

const PaymentForm = ({ handleNext }: { handleNext: () => void }) => {
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
  const date = formattedTimeStamp(new Date().toISOString(), "DD-MMM-YYYY");
  return (
    <div className="grid grid-cols-3 items-start w-full justify-between p-4">
      <div className="p-4 space-y-4 col-span-1 overflow-y-auto max-h-[100%]">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <table className="w-full text-left text-gray-700">
          <thead>
            <tr className="border-b">
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>Sen Sok</span>
        </div>

        <div className="border-t border-gray-300 py-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${(amount * 0.01).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>${(0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${amount + (amount * 0.01).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4 col-span-2">
        <ButtonGroup
          className="col-span-2 grid grid-cols-3"
          variant="outlined"
          aria-label="Basic button group"
        >
          <Button>Credit Card</Button>
          <Button>KHQR</Button>
          <Button>Cash</Button>
        </ButtonGroup>

        <Form
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmitForm)}
          className="flex flex-col gap-4"
        >
          <div className="flex  gap-4">
            <InputField name="card-number" label="Card Number" type="text" />
            <InputField
              name="card-holder"
              label="Card Holder Name"
              type="text"
            />
          </div>
          <div className="flex  gap-4">
            <InputField
              name="card-expiry"
              label="Expiry Date (MM/YY)"
              type="text"
            />
            <InputField name="card-cvv" label="CVV" type="text" />
          </div>
          <Button
            type="submit"
            variant="outlined"
            className="capitalize bg-green-700  text-white w-1/2"
          >
            Confirm Payment
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PaymentForm;
