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

export interface IShippingForm extends FieldValues {
  customer: string;
  contact: string;
  address: string;
}
const ReviewOrder = ({ handleNext }: { handleNext: () => void }) => {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const handleSelect = (method: string) => {
    setDeliveryMethod(method);
  };
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

  const methods = useForm<IShippingForm>();
  const onSubmitForm = (data: IShippingForm) => {
    console.log(data);
    handleNext();
  };
  return (
    <div className="grid grid-cols-3 items-start w-full h-full justify-between p-4">
      <div className="flex-grow max-h-[50vh] overflow-y-scroll space-y-4 pr-2">
        {items.length > 0 &&
          items.map((item) => (
            <CartCard
              key={item._id}
              item={item}
              onDecrement={handleDecrement}
              onRemove={removeItem}
            />
          ))}
      </div>
      <div className="px-4 space-y-4 col-span-2">
        <h2 className="text-lg col-span-2 grid-cols-3 grid font-semibold">
          <p className="col-span-1">
            <p>
              <span className="text-sm text-gray-500 font-base mr-2">
                Items:
              </span>
              <span>{items.length}</span>
            </p>
            <p>
              <span className="text-sm text-gray-500 font-base mr-2">
                Subtotal:
              </span>
              <span>${amount.toFixed(2)}</span>
            </p>
          </p>
        </h2>
        <p>Do you prefer delivery or pick-up? </p>
        <div className="space-x-4">
          <ButtonGroup
            className="col-span-2 grid grid-cols-3"
            variant="outlined"
            aria-label="delivery-service"
          >
            {[
              {
                value: "delivery",
                label: "Delivery",
                icon: <LocalShipping />,
              },
              { value: "pick-up", label: "Pick-Up", icon: <Store /> },
            ].map((item) => (
              <Button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                variant={
                  deliveryMethod === item.value ? "contained" : "outlined"
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "8px",
                  padding: "10px 16px",
                  borderColor:
                    deliveryMethod === item.value ? "primary.main" : "#ccc",
                  backgroundColor:
                    deliveryMethod === item.value ? "primary.main" : "white",
                  color: deliveryMethod === item.value ? "white" : "black",
                  "&:hover": {
                    backgroundColor:
                      deliveryMethod === item.value
                        ? "primary.dark"
                        : "#f5f5f5",
                  },
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <h2 className="text-2xl font-bold">
          {deliveryMethod === "delivery"
            ? "Delivery Information"
            : "Pick-Up Information"}
        </h2>

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
          {deliveryMethod === "delivery" ? (
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
