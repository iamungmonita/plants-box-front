import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { CloseSharp } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%", // Width adjusted as before
  maxWidth: "100vw", // Max width to ensure it's not too wide
  height: "auto", // Set height to 50% of the screen height
  maxHeight: "100vh", // Limit the max height
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Enable vertical scrolling if content overflows
};

export default function BasicModal({
  content,
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
  content: React.ReactNode;
}) {
  const handleBackdropClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent backdrop click from triggering onClose
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          onClick: handleBackdropClick, // Prevent backdrop click from closing modal
        }}
      >
        <Box sx={style}>
          {onClose && (
            <Button className="fixed top-0 right-0" onClick={onClose}>
              <CloseSharp />
            </Button>
          )}
          <div className="flex justify-center items-center w-full h-full">
            {content}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
