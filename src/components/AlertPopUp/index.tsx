import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { Alert } from "@mui/material";

const AlertPopUp = ({
  message,
  open,
  onClose,
}: {
  message: string;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: "top", // Centers it vertically
        horizontal: "right", // Centers it horizontally
      }}
      onClose={onClose}
      autoHideDuration={3000} // Automatically hides after 3 seconds
    >
      <Alert
        severity={message?.includes("in stock") ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertPopUp;
