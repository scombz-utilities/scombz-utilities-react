import { Box, Card, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
type Props = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: (res?: any) => void;
  width?: number | string;
};
export const Modal = (props: Props) => {
  const { title, children, isOpen: open, setIsOpen, onClose = () => {}, width = 720 } = props;

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const close = (e) => {
    e.stopPropagation();
    onClose();
    setIsOpen(false);
  };

  return (
    <Box
      sx={{
        display: open ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={close}
    >
      <Card sx={{ width: width, padding: 1, overflow: "visible" }} onClick={(e) => e.stopPropagation()}>
        <Box display="flex" justifyContent="center" sx={{ position: "relative", p: 0.5 }}>
          <IconButton onClick={close} sx={{ position: "absolute", right: 0, top: 0 }}>
            <MdClose />
          </IconButton>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            {title}
          </Typography>
        </Box>
        {children}
      </Card>
    </Box>
  );
};
