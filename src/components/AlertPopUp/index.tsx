import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

const AlertPopUp = ({
  error,
  message,
  open,
  onClose,
}: {
  error?: boolean;
  message: string | null;
  open: boolean;
  onClose?: () => void;
}) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: "top", // Centers it vertically
        horizontal: "center", // Centers it horizontally
      }}
      onClose={onClose}
      autoHideDuration={3000} // Automatically hides after 3 seconds
    >
      <Alert severity={error ? "error" : "success"} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertPopUp;
