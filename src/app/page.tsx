"use client";
import React, { useEffect, useState } from "react";
import MediaCard from "@/components/Card";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import MuiCarousel from "@/components/Carousel";
import OutlinedCard from "@/components/OutlineCard";
import Link from "next/link";
import { FiArrowRight, FiArrowRightCircle } from "react-icons/fi";
import CustomizedAccordions from "@/components/Accordion";
import {
  PiArrowLeft,
  PiArrowRight,
  PiFacebookLogo,
  PiInstagramLogo,
  PiMagnifyingGlass,
  PiMailbox,
  PiPhone,
  PiTiktokLogo,
} from "react-icons/pi";
import {
  AlternateEmail,
  ArrowRightAltOutlined,
  ArrowRightAltRounded,
  PhoneIphone,
  PhoneOutlined,
  SearchSharp,
} from "@mui/icons-material";
import Map from "@/components/Map";
import CardCarousel from "@/components/CardCarousel";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { TbArrowRightCircle } from "react-icons/tb";
import { ProductReturn, ProductReturnList } from "@/schema/products";
import { getAllProducts } from "@/services/products";

const Page = () => {
  const [products, setProducts] = useState<ProductReturnList[]>([]);

  const generateToken = () => {
    return [...Array(32)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  };

  const token = generateToken();

  console.log("Generated Token:", token);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProducts();
        if (response && response) {
          setProducts(response); // Set state if products exist
        } else {
          console.error("No products found in response");
          setProducts([]); // Ensure state is set even if response is incorrect
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchProduct();
  }, []);
  const prevRef = React.useRef<HTMLButtonElement>(
    null as unknown as HTMLButtonElement
  );
  const nextRef = React.useRef<HTMLButtonElement>(
    null as unknown as HTMLButtonElement
  );
  return (
    <main className="gap-4 max-w-7xl mx-auto w-full grid items-start grid-cols-5">
      <section className="col-span-5">
        <MuiCarousel />
      </section>
      <section className="col-span-5 px-4 " id="service">
        <div className="py-4 col-span-5">
          <h2 className="text-2xl ">Services</h2>
          <p>a one stop plant service</p>
        </div>
        <div className="col-span-5 max-md:col-span-5 z-20">
          <CustomizedAccordions />
        </div>
      </section>

      <section className="col-span-5 px-4">
        <div className="flex justify-between w-full items-center">
          <h2 className="text-2xl">Our popular products</h2>
          <div className="z-10 flex gap-2">
            <button
              ref={prevRef}
              className="swiper-button-next-custom text-green-700 hover:text-green-800 p-2 border rounded-full"
            >
              <PiArrowLeft />
            </button>
            <button
              ref={nextRef}
              className="swiper-button-next-custom text-green-700 hover:text-green-800 p-2 border rounded-full"
            >
              <PiArrowRight />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto whitespace-nowrap relative ">
          <CardCarousel nextRef={nextRef} prevRef={prevRef} cards={products} />
        </div>
      </section>
      <section className="max-md:px-4 col-span-5 max-md:col-span-5 max-xl:p-4">
        <div className="flex justify-between w-full items-center">
          <h2 className="text-2xl">Browse our Collections</h2>
          <Link
            href="/products"
            className="hover:cursor-pointer py-2 flex items-center gap-4"
          >
            View all <FiArrowRightCircle />
          </Link>
        </div>
        <div className="h-[50vh] w-full relative max-xl:h-[100vh]">
          <div className="grid grid-cols-4 w-full max-xl:grid-cols-2 absolute justify-between top-[-20] gap-4">
            {/* <div className="flex group relative flex-col items-center justify-start w-full ">
              <Image
                src="/assets/sample2.png"
                alt=""
                className="z-10"
                width={210}
                height={280}
              />
              <div className="z-10 pb-4 max-xl:flex max-xl:flex-col items-center">
                <h2 className="text-2xl font-bold">Plants</h2>
              </div>
              <div className="w-full bg-slate-100 h-[30vh] rounded-3xl absolute bottom-0 left-0"></div>
            </div>
            <div className="flex group relative flex-col items-center justify-start  w-full ">
              <Image
                src="/assets/sample2.png"
                alt=""
                className="z-10"
                width={210}
                height={280}
              />
              <div className="z-10 pb-4 max-xl:flex max-xl:flex-col items-center">
                <h2 className="text-2xl font-bold">Pots</h2>
              </div>
              <div className="w-full bg-slate-100 h-[30vh] rounded-3xl absolute bottom-0 left-0"></div>
            </div>
            <div className="flex group relative flex-col items-center justify-start  w-full ">
              <Image
                src="/assets/sample2.png"
                alt=""
                className="z-10"
                width={210}
                height={280}
              />
              <div className="z-10 pb-4 max-xl:flex max-xl:flex-col items-center">
                <h2 className="text-2xl font-bold">Soil & Stone</h2>
              </div>
              <div className="w-full bg-slate-100 h-[30vh] rounded-3xl absolute bottom-0 left-0"></div>
            </div>
            <div className="flex group relative flex-col items-center justify-start w-full ">
              <Image
                src="/assets/sample2.png"
                alt=""
                className="z-10"
                width={210}
                height={280}
              />
              <div className="z-10 pb-4 max-xl:flex max-xl:flex-col items-center">
                <h2 className="text-2xl font-bold">Decorations</h2>
              </div>
              <div className="w-full bg-slate-100 h-[30vh] rounded-3xl absolute bottom-0 left-0"></div>
            </div> */}
            <div className="border min-w-[300px]"></div>
          </div>
        </div>
      </section>
      <section className="col-span-5 px-4 mb-32">
        <h2 className="text-2xl col-span-5 mb-4">Find Us</h2>
        <div className="grid grid-cols-5 items-start max-md:gap-4 gap-24">
          <div className="col-span-3 max-md:col-span-5 z-[10]">
            <Map />
          </div>
          <div className="col-span-2 space-y-4 max-md:col-span-5">
            <h2>Contact Info</h2>
            <div className="space-y-4">
              <p className="flex gap-4 items-center">
                <AlternateEmail />
                <Link
                  title="send us an email with just one click here."
                  href={"mailto:iamungmonita@gmail.com"}
                >
                  plantsbox23@gmail.com
                </Link>
              </p>
              <p className="flex gap-4 items-center">
                <PhoneOutlined />
                <span>+855 98 365 155</span>
              </p>
            </div>
            <h2>Social Media</h2>
            <div className="text-3xl text-white flex items-center gap-4 justify-start">
              <PiFacebookLogo className="bg-green-800 rounded-full p-1" />
              <PiTiktokLogo className="bg-green-800 rounded-full p-1" />
              <PiInstagramLogo className="bg-green-800 rounded-full p-1" />
            </div>
            <h2>Want to send us a message?</h2>
            <textarea name="" id="" placeholder="say something"></textarea>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
