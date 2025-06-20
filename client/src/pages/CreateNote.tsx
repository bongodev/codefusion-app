import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon, SaveIcon } from "../ui/icons";
import MarkdownEditor from "../components/editor/MarkdownEditor";

export default function CreateNote() {
  const navigate = useNavigate();

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
          // onClick={handleSave}
          // disabled={createNoteMutation.isPending}
          size="large"
        >
          Save Note
          {/* {createNoteMutation.isPending ? "Saving..." : "Save Note"} */}
        </Button>
      </Stack>

      <Stack spacing={3}>
        {/* Title */}
        <TextField
          fullWidth
          label="Note Title"
          placeholder="Enter a descriptive title for your note"
          // value={noteData.title}
          // onChange={handleTitleChange}
          // error={!!errors.title}
          // helperText={errors.title}
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
            value=""
            onChange={() => {}}
            // value={noteData.content}
            // onChange={handleContentChange}
            // onSave={handleAutoSave}
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

        {/* Content Error */}
        {/* {errors.content && <Alert severity="error">{errors.content}</Alert>} */}
      </Stack>
    </Box>
  );
}
