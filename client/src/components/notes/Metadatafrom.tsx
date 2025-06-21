import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Slider,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Stack,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import type { CreateNoteRequest, SentimentLabel } from "../../types";
import { sentimentColors, tagColors } from "../../ui/theme";
// import notesService from "../../services/notesService";

type MetadataFormProps = {
  value: Partial<CreateNoteRequest>;
  onChange: (metadata: Partial<CreateNoteRequest>) => void;
  errors?: Record<string, string>;
};

const MetadataForm = ({ value, onChange, errors = {} }: MetadataFormProps) => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newKeyPoint, setNewKeyPoint] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Load available tags on mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        // const tags = await notesService.getAllTags();
        // setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };
    loadTags();
  }, []);

  // Helper function to get tag color
  const getTagColor = (tag: string): string => {
    const index = availableTags.indexOf(tag) % tagColors.length;
    return tagColors[index];
  };

  // Handle summary change
  const handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      summary: event.target.value,
    });
  };

  // Handle tags change
  const handleTagsChange = (
    _event: React.SyntheticEvent,
    newTags: string[]
  ) => {
    onChange({
      ...value,
      tags: newTags,
    });
  };

  // Handle sentiment score change
  const handleSentimentScoreChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    const score = Array.isArray(newValue) ? newValue[0] : newValue;
    let label: SentimentLabel = "neutral";

    if (score > 0.2) label = "positive";
    else if (score < -0.2) label = "negative";

    onChange({
      ...value,
      sentiment: {
        score: score,
        label,
      },
    });
  };

  // Handle sentiment label change
  const handleSentimentLabelChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const label = event.target.value as SentimentLabel;
    let score = 0;

    switch (label) {
      case "positive":
        score = 0.5;
        break;
      case "negative":
        score = -0.5;
        break;
      case "neutral":
      default:
        score = 0;
        break;
    }

    onChange({
      ...value,
      sentiment: {
        score,
        label,
      },
    });
  };

  // Add key point
  const handleAddKeyPoint = () => {
    if (newKeyPoint.trim()) {
      const currentKeyPoints = value.keyPoints || [];
      onChange({
        ...value,
        keyPoints: [...currentKeyPoints, newKeyPoint.trim()],
      });
      setNewKeyPoint("");
    }
  };

  // Remove key point
  const handleRemoveKeyPoint = (index: number) => {
    const currentKeyPoints = value.keyPoints || [];
    const updatedKeyPoints = currentKeyPoints.filter((_, i) => i !== index);
    onChange({
      ...value,
      keyPoints: updatedKeyPoints,
    });
  };

  // Handle key point input key press
  const handleKeyPointKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddKeyPoint();
    }
  };

  // Get sentiment icon
  const getSentimentIcon = (label: SentimentLabel) => {
    switch (label) {
      case "positive":
        return (
          <SentimentVerySatisfied
            sx={{ color: sentimentColors.positive.main }}
          />
        );
      case "negative":
        return (
          <SentimentVeryDissatisfied
            sx={{ color: sentimentColors.negative.main }}
          />
        );
      case "neutral":
      default:
        return (
          <SentimentNeutral sx={{ color: sentimentColors.neutral.main }} />
        );
    }
  };

  // Sentiment marks for slider
  const sentimentMarks = [
    { value: -1, label: "Very Negative" },
    { value: -0.5, label: "Negative" },
    { value: 0, label: "Neutral" },
    { value: 0.5, label: "Positive" },
    { value: 1, label: "Very Positive" },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Note Metadata
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add metadata to help organize and find your note later
      </Typography>

      <Stack spacing={3}>
        {/* Summary */}
        <Box>
          <TextField
            fullWidth
            label="Summary"
            placeholder="Brief summary of the note content"
            multiline
            rows={3}
            value={value.summary || ""}
            onChange={handleSummaryChange}
            error={!!errors.summary}
            helperText={
              errors.summary || "Provide a concise summary of your note"
            }
          />
        </Box>

        {/* Tags */}
        <Box>
          <Autocomplete
            multiple
            freeSolo
            options={availableTags}
            value={value.tags || []}
            onChange={handleTagsChange}
            inputValue={tagInput}
            onInputChange={(_event, newInputValue) =>
              setTagInput(newInputValue)
            }
            renderTags={(tags, getTagProps) =>
              tags.map((tag, index) => (
                <Chip
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: getTagColor(tag),
                    color: "white",
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                    },
                  }}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags (press Enter to add)"
                error={!!errors.tags}
                helperText={
                  errors.tags || "Add relevant tags to categorize your note"
                }
              />
            )}
          />
        </Box>

        {/* Key Points */}
        <Box>
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Key Points
          </FormLabel>

          {/* Add new key point */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a key point"
              value={newKeyPoint}
              onChange={(e) => setNewKeyPoint(e.target.value)}
              onKeyPress={handleKeyPointKeyPress}
              error={!!errors.keyPoints}
            />
            <IconButton
              color="primary"
              onClick={handleAddKeyPoint}
              disabled={!newKeyPoint.trim()}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Key points list */}
          {value.keyPoints && value.keyPoints.length > 0 ? (
            <List dense sx={{ bgcolor: "background.default", borderRadius: 1 }}>
              {value.keyPoints.map((point, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={point}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleRemoveKeyPoint(index)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
              No key points added yet. Key points help highlight the most
              important aspects of your note.
            </Alert>
          )}

          {errors.keyPoints && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}
            >
              {errors.keyPoints}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Sentiment Analysis */}
        <Box>
          <FormLabel
            component="legend"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            Sentiment Analysis
            {value.sentiment && getSentimentIcon(value.sentiment.label)}
          </FormLabel>

          {/* Sentiment Slider */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Overall Sentiment Score
            </Typography>
            <Slider
              value={value.sentiment?.score || 0}
              onChange={handleSentimentScoreChange}
              min={-1}
              max={1}
              step={0.1}
              marks={sentimentMarks}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) =>
                `${val > 0 ? "+" : ""}${val.toFixed(1)}`
              }
              sx={{
                color:
                  value.sentiment?.label === "positive"
                    ? sentimentColors.positive.main
                    : value.sentiment?.label === "negative"
                    ? sentimentColors.negative.main
                    : sentimentColors.neutral.main,
              }}
            />
          </Box>

          {/* Sentiment Label */}
          <FormControl component="fieldset">
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sentiment Category
            </Typography>
            <RadioGroup
              row
              value={value.sentiment?.label || "neutral"}
              onChange={handleSentimentLabelChange}
            >
              <FormControlLabel
                value="positive"
                control={<Radio size="small" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SentimentVerySatisfied
                      sx={{
                        color: sentimentColors.positive.main,
                        fontSize: 20,
                      }}
                    />
                    Positive
                  </Box>
                }
              />
              <FormControlLabel
                value="neutral"
                control={<Radio size="small" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SentimentNeutral
                      sx={{ color: sentimentColors.neutral.main, fontSize: 20 }}
                    />
                    Neutral
                  </Box>
                }
              />
              <FormControlLabel
                value="negative"
                control={<Radio size="small" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SentimentVeryDissatisfied
                      sx={{
                        color: sentimentColors.negative.main,
                        fontSize: 20,
                      }}
                    />
                    Negative
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>

          {errors.sentiment && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}
            >
              {errors.sentiment}
            </Typography>
          )}
        </Box>

        {/* Metadata Templates */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Quick Templates
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                onChange({
                  ...value,
                  tags: [...(value.tags || []), "meeting", "important"],
                  sentiment: { score: 0.3, label: "positive" },
                })
              }
            >
              Meeting Notes
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                onChange({
                  ...value,
                  tags: [...(value.tags || []), "research", "learning"],
                  sentiment: { score: 0.5, label: "positive" },
                })
              }
            >
              Research
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                onChange({
                  ...value,
                  tags: [...(value.tags || []), "bug", "investigation"],
                  sentiment: { score: -0.2, label: "negative" },
                })
              }
            >
              Bug Report
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default MetadataForm;
