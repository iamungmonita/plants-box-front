import React, { useEffect, useRef, useState } from "react";
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
import {
  AttachMoney,
  CreditCard,
  LocalShipping,
  QrCode2,
  Store,
} from "@mui/icons-material";
import Form from "../Form";
import { useForm } from "react-hook-form";
import InputField from "../InputText";
import { IShippingForm } from "./ReviewOrder";

const PaymentForm = ({ handleNext }: { handleNext: () => void }) => {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("credit");

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

  const handleSelect = (method: string) => {
    setPaymentMethod(method);
  };
  const methods = useForm<IShippingForm>();
  const onSubmitForm = (data: IShippingForm) => {
    console.log(data);
    handleNext();
  };
  return (
    <div className="grid grid-cols-3 items-start w-full justify-between p-4">
      <div className="p-4 space-y-4 col-span-1 overflow-y-auto max-h-[100%] bg-white shadow-lg rounded-lg ">
        <h2 className="text-lg font-semibold text-center">Receipt</h2>
        <div className="flex-grow max-h-[40vh] overflow-y-scroll space-y-4 pr-2">
          <table className="w-full text-left text-gray-700 flex-grow max-h-[40vh] overflow-y-scroll space-y-4 pr-2">
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
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>Sen Sok</span>
        </div>

        <div className="border-t border-gray-300 py-4">
          <div className="flex justify-between">
            <span>Item(s):</span>
            <span>{items.length}</span>
          </div>
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
        <h2 className="text-xl">Payment Method</h2>

        <div className="flex flex-col gap-10">
          <ButtonGroup
            className="col-span-2 grid grid-cols-3"
            variant="outlined"
            aria-label="payment method"
          >
            {[
              { value: "credit", label: "Credit Card", icon: <CreditCard /> },
              { value: "qr", label: "KHQR", icon: <QrCode2 /> },
              { value: "cash", label: "Cash", icon: <AttachMoney /> },
            ].map((item) => (
              <Button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                variant={
                  paymentMethod === item.value ? "contained" : "outlined"
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "8px",
                  padding: "10px 16px",
                  borderColor:
                    paymentMethod === item.value ? "primary.main" : "#ccc",
                  backgroundColor:
                    paymentMethod === item.value ? "primary.main" : "white",
                  color: paymentMethod === item.value ? "white" : "black",
                  "&:hover": {
                    backgroundColor:
                      paymentMethod === item.value ? "primary.dark" : "#f5f5f5",
                  },
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </ButtonGroup>
          <Form
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmitForm)}
            className="flex flex-col gap-10"
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
              sx={{
                padding: "10px 16px",
              }}
              type="submit"
              variant="contained"
              className="capitalize text-white bg-green-700 w-full"
            >
              Confirm Payment
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
