import { Snackbar, Alert } from "@mui/material";

interface ToastMessageProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: "success" | "info" | "warning" | "error";
  autoHideDuration?: number;
}

export default function ToastMessage({
  open,
  onClose,
  message,
  severity = "info",
  autoHideDuration = 4000,
}: ToastMessageProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
