"use client";
import { filteredOrders, Order } from "@/schema/order";
import { Product, ProductReturnList } from "@/schema/products";
import { getProductById, getOrderById } from "@/services/products";
import { MdEditDocument } from "react-icons/md";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formattedTimeStamp } from "@/helpers/format-time";
import BasicModal from "@/components/Modal";
import dynamic from "next/dynamic";

const CreatePage = dynamic(
  () => import("@/app/(private)/admin/products/create/page")
);

const Page = () => {
  const params = useParams(); // Fetch params dynamically
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductReturnList | null>(null);
  const [purchasedOrder, setPurchasedOrder] = useState<filteredOrders[]>([]); // Flattened orders
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!params?.id) return; // Ensure params are available
    setId(params.id as string); // Extract `id` safely
  }, [params]);

  useEffect(() => {
    if (!id) return; // Fetch only when `id` is available
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        const orderData = await getOrderById(id);
        setProduct(productData);
        const filteredOrders = orderData.orderIds
          .map((order) => ({
            _id: order._id,
            createdAt: order.createdAt,
            orders: order.orders.filter((o) => o.id === id), // Filter orders
          }))
          .filter((order) => order.orders.length > 0); // Remove entries with no matching orders

        setPurchasedOrder(filteredOrders);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div>
      <div className="grid grid-cols-2 p-4 gap-4 max-xl:grid-cols-1">
        <div className="shadow p-4 space-y-4">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="font-extrabold text-2xl">{product.name}</h2>
              <h1>Product ID: {id}</h1>
            </div>

            <MdEditDocument
              className="text-2xl"
              onClick={() => setToggle(true)}
            />
            <BasicModal
              open={toggle}
              onClose={() => setToggle(false)}
              content={<CreatePage />}
            />
          </div>
          <div>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Instruction: {product.instruction}</p>
            <p>Size: {product.size}</p>
          </div>
          <div>
            <p>Created At: {product.createdAt}</p>
            <p>Updated At: {product.updatedAt}</p>
          </div>
          <div className="grid grid-cols-5 gap-2 p-2">
            {product.pictures?.map((img) => (
              <Image
                key={`http://localhost:4002${img}`}
                src={`http://localhost:4002${img}`}
                alt="Product Image"
                width={100}
                height={100}
              />
            ))}
          </div>
        </div>
        <div className="shadow p-4">
          {purchasedOrder.length > 0 ? (
            <div className="space-y-4">
              {purchasedOrder.map((order) => (
                <div
                  key={order._id}
                  className="bg-slate-100 p-4 rounded-md max-2xl:grid  max-2xl:grid-cols-1 flex items-center justify-between"
                >
                  <div>
                    <span className="flex gap-4">
                      <h2>Purchase Order ID:</h2>
                      {order._id}
                    </span>
                    <span className="flex gap-4">
                      <h2>Purchased Time:</h2>
                      {formattedTimeStamp(order.createdAt)}
                    </span>
                  </div>

                  {order.orders.map((item) => (
                    <div key={item._id} className="">
                      <span className="flex gap-4">
                        <h2>Amount:</h2>${item.price * item.quantity}
                      </span>
                      <span className="flex gap-4">
                        <h2>Qty:</h2> {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            "No orders have been recorded for this product."
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
