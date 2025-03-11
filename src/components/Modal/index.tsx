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

export default function BasicModal<T>({
  ContentComponent,
  open,
  onClose,
  onAction,
  text,
  items,
}: {
  open: boolean;
  text?: string;
  items?: T[];
  onClose?: () => void;
  onAction?: () => void; // New prop for action
  ContentComponent: React.ComponentType<{
    onClose?: () => void;
    onAction?: () => void;
    text?: string;
    items?: T[];
  }>;
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
          <div className="flex justify-center items-center w-full h-full">
            <ContentComponent
              items={items}
              onClose={onClose}
              onAction={onAction}
              text={text}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
