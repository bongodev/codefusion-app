import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { AddIcon, ExportIcon } from "../ui/icons";

export default function Dashboard() {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's an overview of your notes and activity.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            // onClick={handleBulkExport}
            // disabled={
            //   (searchResults.length === 0 && recentNotes.length === 0) ||
            //   searchLoading
            // }
          >
            Export Notes
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/notes/new")}
          >
            Create New Note
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
