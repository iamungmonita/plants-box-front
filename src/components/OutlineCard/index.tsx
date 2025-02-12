import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ArrowRight } from "@mui/icons-material";
import { FiArrowRightCircle } from "react-icons/fi";

export default function OutlinedCard({ body }: { body: string }) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card
        sx={{
          color: "white",
          display: "flex",
          height: "100%",
          backgroundColor: "#75ae87",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body1" component="div">
            {body}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">
            <FiArrowRightCircle className="text-2xl text-white" />
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
