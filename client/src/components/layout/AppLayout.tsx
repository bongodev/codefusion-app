import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function AppLayout() {
  return (
    <Box>
      <Typography variant="h1">Header</Typography>
      <Typography variant="h2">Sidebar</Typography>
      <Outlet />
    </Box>
  );
}
