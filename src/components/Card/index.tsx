import React from "react";
import { Button, Card } from "@mui/material";
import { TbShoppingBagPlus } from "react-icons/tb";
import API_URL from "@/lib/api";
import { addToCart, updateCartItems } from "@/helpers/addToCart";
import { ProductReturnList } from "@/schema/products";
import Image from "next/image";
import AlertPopUp from "../AlertPopUp";
import { usePathname } from "next/navigation";

const ProductCard = ({ product }: { product: ProductReturnList }) => {
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [toggleWidth, setToggleWidth] = React.useState(false);

  const routes = ["/products"];
  const pathname = usePathname();

  React.useEffect(() => {
    setToggleWidth(routes.some((route) => pathname.startsWith(route)));
  }, [pathname]);

  const handleAddToCart = (id: string) => {
    updateCartItems();
    addToCart(id, "plants", setSnackbarMessage);
    setSnackbarOpen(true);
  };

  return (
    <>
      <AlertPopUp
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
      <Card
        className={`shadow cursor-pointer relative group ${
          toggleWidth && "max-md:min-w-[180px] h-[300px]"
        } min-w-[250px] h-[350px] flex flex-col`}
        sx={{
          boxShadow: "none",
          "&:hover": {
            transform: "scale(1.02)",
            transition: "transform 0.5s ease-in-out",
          },
        }}
      >
        <div className="relative w-full h-[60%]">
          <Image
            width={500}
            height={500}
            src={`${API_URL}${product.pictures[0]}`}
            alt={product.name}
            title={product.name}
            className="w-full h-full object-cover rounded-t p-2 border"
          />
        </div>

        <div className="p-4 flex flex-col justify-between h-[40%]">
          <h2 className="text-xl max-md:text-lg font-semibold">
            {product.name}
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="md:text-lg">
                ${parseInt(product.price.toString()).toFixed(2)}
              </p>
              {product.stock === 0 ? (
                <p className="text-sm text-red-500">Out of Stock</p>
              ) : (
                <p className="text-sm">In Stock</p>
              )}
            </div>
            <TbShoppingBagPlus
              className={`
               hover:cursor-pointer text-green-800 rounded-full shadow p-1.5 text-4xl bg-white ${
                 product.stock <= 0 ? "pointer-events-none opacity-50" : ""
               }`}
              onClick={() => handleAddToCart(product._id)}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProductCard;
