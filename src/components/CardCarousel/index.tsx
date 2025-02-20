import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { ProductReturnList } from "@/schema/products";
import { addToCart, updateCartItems } from "@/helpers/addToCart";
import AlertPopUp from "../AlertPopUp";
import ProductCard from "../Card";

interface CardCarouselProps {
  nextRef?: React.RefObject<HTMLButtonElement>;
  prevRef?: React.RefObject<HTMLButtonElement>;
  cards: ProductReturnList[];
}

export default function CardCarousel({
  nextRef,
  prevRef,
  cards,
}: CardCarouselProps) {
  const [swiperInstance, setSwiperInstance] = React.useState<any>(null);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    if (swiperInstance) {
      swiperInstance.params.navigation.prevEl = prevRef?.current;
      swiperInstance.params.navigation.nextEl = nextRef?.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  React.useEffect(() => {
    updateCartItems();
    const handleCartUpdate = () => {
      updateCartItems();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleAddToCart = (id: string) => {
    updateCartItems();
    addToCart(id, "plants", setSnackbarMessage);
    setSnackbarOpen(true);
  };

  return (
    <div className="relative">
      {/* Swiper Component */}
      <AlertPopUp
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.5}
        loop={true} // Enable infinite looping
        breakpoints={{
          500: { slidesPerView: 2 },
          800: { slidesPerView: 3 },
          1100: { slidesPerView: 4 },
        }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        style={{ paddingBottom: "30px" }}
      >
        {cards.map((card) => (
          <SwiperSlide key={card._id}>
            <ProductCard product={card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
