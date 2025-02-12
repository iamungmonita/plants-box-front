import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { ShoppingBasket } from "@mui/icons-material";
import { TbShoppingBagPlus } from "react-icons/tb";
import { ProductReturn } from "@/schema/products";

interface CardCarouselProps {
  nextRef?: React.RefObject<HTMLButtonElement>;
  prevRef?: React.RefObject<HTMLButtonElement>;
  cards: ProductReturn[];
}

export default function CardCarousel({
  nextRef,
  prevRef,
  cards,
}: CardCarouselProps) {
  const [swiperInstance, setSwiperInstance] = React.useState<any>(null);

  React.useEffect(() => {
    if (swiperInstance) {
      swiperInstance.params.navigation.prevEl = prevRef?.current;
      swiperInstance.params.navigation.nextEl = nextRef?.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="relative">
      {/* Swiper Component */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.5}
        loop={true} // Enable infinite looping
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        style={{ paddingBottom: "30px" }}
      >
        {cards.map((card) => (
          <SwiperSlide key={card._id}>
            <Card
              sx={{
                minWidth: 300,
                padding: 2,
                boxShadow: "none",
                "&:hover": {
                  transform: "scale(1.1)", // This will scale the card up by 5% when hovered
                  transition: "transform 0.5s ease-in-out",
                  // Smooth transition for scaling effect
                },
              }}
            >
              <div className="group p-2 relative transition-transform duration-500  ease-in-out">
                {/* Add 'group' class to the wrapper */}
                <CardMedia
                  sx={{ minHeight: 250 }}
                  image={`http://localhost:4002${card.pictures[0]}`}
                  title={card.name}
                />
                <div className=" group-hover:bg-slate-100 flex items-center justify-between">
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      sx={{ fontFamily: "red hat display", fontWeight: 600 }}
                    >
                      {card.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        fontFamily: "red hat display",
                      }}
                    >
                      {card.price}
                    </Typography>
                  </CardContent>
                  <div
                    onClick={() =>
                      alert(`added ${card.name} to the shopping cart.`)
                    }
                    className="opacity-0 hover:cursor-pointer group-hover:opacity-100 pr-10 transition-opacity duration-500 ease-in-out"
                  >
                    <TbShoppingBagPlus className="text-3xl max-md:text-2xl text-green-800" />
                  </div>
                </div>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
