import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: "6rem", fontWeight: "bold", color: "primary.main" }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, maxWidth: "600px", color: "text.secondary" }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
          sx={{ borderRadius: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
