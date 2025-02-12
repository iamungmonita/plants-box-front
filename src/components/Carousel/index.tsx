import React from "react";
import { Box, Card, CardMedia, IconButton } from "@mui/material";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { images } from "@/constants/carousel"; // Ensure this is correctly imported

// Custom Previous Button
const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      sx={{
        position: "absolute",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      }}
      onClick={onClick}
    >
      <ArrowBackIos />
    </IconButton>
  );
};

// Custom Next Button
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      sx={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      }}
      onClick={onClick}
    >
      <ArrowForwardIos />
    </IconButton>
  );
};

const MuiCarousel: React.FC = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Box
      sx={{
        maxWidth: "100vw",
        mx: "auto",
        mb: 4,
        position: "relative",
        height: "100vh", // Ensures the entire screen height is used
      }}
    >
      <Slider {...settings}>
        {images.map((img, index) => (
          <Card key={index} sx={{ height: "100vh" }}>
            <CardMedia
              component="img"
              sx={{
                height: "100%", // Make sure it takes up full height
                width: "100%", // Ensures full width
                objectFit: "cover", // 🔥 Fills the space even if the image is small
              }}
              image={img}
              alt={`Slide ${index + 1}`}
            />
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default MuiCarousel;
