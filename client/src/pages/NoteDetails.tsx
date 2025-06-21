import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentVerySatisfied,
  CalendarToday as DateIcon,
  Tag as TagIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useNote, useDeleteNote } from "../hooks";
import { noteToLegacy } from "../utils/dataTransforms";
import { sentimentColors, tagColors } from "../theme/theme";
import { saveAs } from "file-saver";
import ReactMarkdown from "react-markdown";

const NoteDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const deleteNoteMutation = useDeleteNote();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    data: note,
    isLoading,
    error,
  } = useNote(id!, {
    enabled: !!id,
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/notes/${id}/edit`);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!id) return;
    
    deleteNoteMutation.mutate(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        navigate("/");
      },
      onError: (error) => {
        console.error("Failed to delete note:", error);
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleExport = () => {
    if (!note) return;
    handleMenuClose();

    const legacyNote = noteToLegacy(note);
    const markdown = `# ${note.title}

**Created:** ${new Date(note.createdAt).toLocaleDateString()}
**Last Updated:** ${new Date(note.updatedAt).toLocaleDateString()}
**Tags:** ${note.tags.join(", ")}
**Sentiment:** ${note.sentiment.label} (Score: ${note.sentiment.score})

## Summary
${note.summary}

## Key Points
${note.keyPoints.map((point) => `- ${point}`).join("\n")}

## Content
${note.content}`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    saveAs(blob, `${note.title}.md`);
  };

  const handleShare = () => {
    handleMenuClose();
    if (navigator.share) {
      navigator.share({
        title: note?.title,
        text: note?.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
  };

  const getSentimentIcon = (sentiment: { label: string; score: number }) => {
    const iconProps = {
      sx: {
        fontSize: 20,
        color:
          sentimentColors[sentiment.label as keyof typeof sentimentColors]
            ?.main || sentimentColors.neutral.main,
      },
    };

    switch (sentiment.label) {
      case "positive":
        return <SentimentVerySatisfied {...iconProps} />;
      case "negative":
        return <SentimentVeryDissatisfied {...iconProps} />;
      case "neutral":
      default:
        return <SentimentNeutral {...iconProps} />;
    }
  };

  const getTagColor = (index: number): string => {
    return tagColors[index % tagColors.length];
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!note) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Note not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {note.title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <DateIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  Created: {formatDate(note.createdAt)}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <DateIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  Updated: {formatDate(note.updatedAt)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title={isBookmarked ? "Remove bookmark" : "Add bookmark"}>
            <IconButton
              onClick={handleBookmark}
              sx={{
                color: isBookmarked ? "warning.main" : "text.secondary",
              }}
            >
              {isBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Summary */}
            {note.summary && (
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "primary.main",
                        fontSize: "0.875rem",
                      }}
                    >
                      S
                    </Avatar>
                    Summary
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {note.summary}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Content */}
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "secondary.main",
                    fontSize: "0.875rem",
                  }}
                >
                  C
                </Avatar>
                Content
              </Typography>
              <Box
                sx={{
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    color: "text.primary",
                    mb: 2,
                  },
                  "& p": {
                    mb: 2,
                    lineHeight: 1.7,
                  },
                  "& ul, & ol": {
                    pl: 3,
                    mb: 2,
                  },
                  "& li": {
                    mb: 0.5,
                  },
                  "& pre": {
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    overflow: "auto",
                  },
                  "& code": {
                    bgcolor: "grey.100",
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontSize: "0.875rem",
                  },
                  "& blockquote": {
                    borderLeft: "4px solid",
                    borderColor: "primary.main",
                    pl: 2,
                    ml: 0,
                    fontStyle: "italic",
                    color: "text.secondary",
                  },
                }}
              >
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Metadata */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Metadata
                </Typography>
                <Stack spacing={2}>
                  {/* Sentiment */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Sentiment
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getSentimentIcon(note.sentiment)}
                      <Typography variant="body2">
                        {note.sentiment.label} ({note.sentiment.score.toFixed(1)}
                        )
                      </Typography>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TagIcon sx={{ fontSize: 16 }} />
                        Tags
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {note.tags.map((tag, index) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: getTagColor(index),
                              color: "white",
                              mb: 0.5,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {note.tags.length > 0 && note.keyPoints.length > 0 && (
                    <Divider />
                  )}

                  {/* Key Points */}
                  {note.keyPoints.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ListIcon sx={{ fontSize: 16 }} />
                        Key Points
                      </Typography>
                      <Box>
                        {note.keyPoints.map((point, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              mb: 1,
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                mt: 0.75,
                                flexShrink: 0,
                              }}
                            />
                            {point}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <ExportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Markdown</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{note.title}"? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteNoteMutation.isPending}
          >
            {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoteDetails; 