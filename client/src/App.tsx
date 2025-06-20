import { Route, Routes } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, Typography } from "@mui/material";

import { theme } from "./ui/theme";

import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="bookmarks"
            element={
              <Box>
                <Typography variant="h1">Bookmarks</Typography>
              </Box>
            }
          />
          <Route
            path="archive"
            element={
              <Box>
                <Typography variant="h1">Archive</Typography>
              </Box>
            }
          />
          <Route
            path="settings"
            element={
              <Box>
                <Typography variant="h1">Settings</Typography>
              </Box>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
