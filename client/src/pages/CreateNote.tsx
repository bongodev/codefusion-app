import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon, SaveIcon } from "../ui/icons";
import MarkdownEditor from "../components/editor/MarkdownEditor";
import MetadataForm from "../components/notes/Metadatafrom";
import type { CreateNoteRequest } from "../types";
import { useCreateNoteMutation } from "../api/hooks";

export default function CreateNote() {
  const navigate = useNavigate();

  const createNoteMutation = useCreateNoteMutation();

  const [noteData, setNoteData] = useState<CreateNoteRequest>({
    title: "",
    content: "",
    summary: "",
    keyPoints: [],
    tags: [],
    sentiment: {
      score: 0,
      label: "neutral",
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoteData((prev) => ({
      ...prev,
      title: event.target.value,
    }));

    // Clear title error when user starts typing
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleContentChange = (content: string) => {
    setNoteData((prev) => ({
      ...prev,
      content,
    }));
    // Clear content error when user starts typing
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  const handleMetadataChange = (metadata: Partial<CreateNoteRequest>) => {
    setNoteData((prev) => ({
      ...prev,
      ...metadata,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!noteData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!noteData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!noteData.summary.trim()) {
      newErrors.summary = "Summary is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    try {
      await createNoteMutation.mutateAsync(noteData);
      setSuccessMessage("Note created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Failed to create note:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create note. Please try again."
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          Create New Note
        </Typography>
        <Button
          variant="contained"
          startIcon={
            <SaveIcon />
            // createNoteMutation.isPending ? (
            //   <CircularProgress size={20} />
            // ) : (
            //   <SaveIcon />
            // )
          }
          onClick={handleSave}
          // disabled={createNoteMutation.isPending}
          size="large"
        >
          Save Note
          {/* {createNoteMutation.isPending ? "Saving..." : "Save Note"} */}
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Left Column - Editor */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              fullWidth
              label="Note Title"
              placeholder="Enter a descriptive title for your note"
              value={noteData.title}
              onChange={handleTitleChange}
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "1.25rem",
                  fontWeight: 500,
                },
              }}
            />

            {/* Content Editor */}
            <Paper sx={{ overflow: "hidden" }}>
              <MarkdownEditor
                value={noteData.content}
                onChange={handleContentChange}
                onSave={() => {}}
                placeholder="Start writing your note here... 

You can use Markdown syntax:
- **Bold text**
- *Italic text*
- `Code`
- [Links](url)
- ![Images](url)

The preview will appear on the right as you type."
                height="500px"
                autoSave={true}
                autoSaveInterval={30000}
              />
            </Paper>
          </Stack>
        </Grid>

        {/* Right Column - Metadata */}
        <Grid item xs={12} lg={4}>
          <MetadataForm
            value={{
              summary: noteData.summary,
              keyPoints: noteData.keyPoints,
              tags: noteData.tags,
              sentiment: noteData.sentiment,
            }}
            onChange={handleMetadataChange}
            // errors={errors}
          />
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
