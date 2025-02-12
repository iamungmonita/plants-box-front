import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ArrowRight, ArrowRightSharp, ShoppingCart } from "@mui/icons-material";
import { FiArrowRight, FiArrowRightCircle } from "react-icons/fi";

export default function MediaCard() {
  return (
    <Card
      sx={{
        minWidth: 300,
        boxShadow: "none",
        backgroundColor: "transparent",
      }}
    >
      <CardMedia
        sx={{ height: 150 }}
        image="/assets/rocca-vine.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ fontFamily: "red hat display", fontWeight: 600 }}
        >
          Lizard
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontFamily: "red hat display" }}
        >
          $20.00
        </Typography>
      </CardContent>
    </Card>
  );
}
