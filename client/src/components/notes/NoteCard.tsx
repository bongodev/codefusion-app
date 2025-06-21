import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  Fade,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { sentimentColors, tagColors } from "../../ui/theme";
import type { Note } from "../../types";

type NoteCardProps = {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onExport?: (note: Note) => void;
  onBookmark?: (note: Note) => void;
  isBookmarked?: boolean;
  showMetadata?: boolean;
  variant?: "grid" | "list";
};

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onExport,
  onBookmark,
  isBookmarked = false,
  showMetadata = true,
  variant = "grid",
}: NoteCardProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    // navigate(`/notes/${note._id}`);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    if (onEdit) {
      onEdit(note);
    } else {
      navigate(`/notes/${note._id}/edit`);
    }
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onDelete?.(note);
  };

  const handleExport = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onExport?.(note);
  };

  const handleBookmark = (event: React.MouseEvent) => {
    event.stopPropagation();
    onBookmark?.(note);
  };

  // Get tag color
  const getTagColor = (_tag: string, index: number): string => {
    return tagColors[index % tagColors.length];
  };

  // Get sentiment icon
  const getSentimentIcon = () => {
    const { label } = note.sentiment;
    const iconProps = {
      sx: {
        fontSize: 16,
        color: sentimentColors[label]?.main || sentimentColors.neutral.main,
      },
    };

    switch (label) {
      case "positive":
        return <SentimentVerySatisfied {...iconProps} />;
      case "negative":
        return <SentimentVeryDissatisfied {...iconProps} />;
      case "neutral":
      default:
        return <SentimentNeutral {...iconProps} />;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Truncate content
  const truncateContent = (content: string, maxLength: number = 200) => {
    // Remove markdown formatting for preview
    const plainText = content.replace(/[#*`>\[\]()]/g, "").trim();
    return plainText.length > maxLength
      ? `${plainText.substring(0, maxLength)}...`
      : plainText;
  };

  return (
    <Card
      sx={{
        height: variant === "list" ? "auto" : "100%",
        display: "flex",
        flexDirection: variant === "list" ? "row" : "column",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        position: "relative",
        "&:hover": {
          transform: variant === "list" ? "none" : "translateY(-2px)",
          boxShadow: variant === "list" ? 1 : 3,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {variant === "list" ? (
        // List View Layout
        <>
          {/* Left side - Content */}
          <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
            {/* Header with title and actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  flex: 1,
                  pr: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {note.title}
              </Typography>

              <Fade in={isHovered}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    ml: 1,
                  }}
                >
                  {onBookmark && (
                    <Tooltip
                      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <IconButton
                        size="small"
                        onClick={handleBookmark}
                        sx={{
                          color: isBookmarked
                            ? "warning.main"
                            : "text.secondary",
                        }}
                      >
                        {isBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />}
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="More actions">
                    <IconButton
                      size="small"
                      onClick={handleMenuOpen}
                      sx={{ color: "text.secondary" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Fade>
            </Box>

            {/* Summary and content preview in a row */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 1,
                minHeight: "40px",
                alignItems: "flex-start",
              }}
            >
              {note.summary && showMetadata && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    flex: "0 0 30%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {note.summary}
                </Typography>
              )}

              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.4,
                }}
              >
                {truncateContent(note.content, 150)}
              </Typography>
            </Box>

            {/* Bottom row - tags, metadata */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: "auto",
              }}
            >
              {/* Tags */}
              <Stack direction="row" spacing={0.5} sx={{ flex: 1, mr: 2 }}>
                {note.tags.slice(0, 2).map((tag, index) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      fontSize: "0.625rem",
                      height: 20,
                      bgcolor: getTagColor(tag, index),
                      color: "white",
                      "& .MuiChip-label": { px: 0.5 },
                    }}
                  />
                ))}
                {note.tags.length > 2 && (
                  <Chip
                    label={`+${note.tags.length - 2}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: "0.625rem",
                      height: 20,
                      "& .MuiChip-label": { px: 0.5 },
                    }}
                  />
                )}
              </Stack>

              {/* Right side metadata */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip
                  title={`Sentiment: ${
                    note.sentiment.label
                  } (${note.sentiment.score.toFixed(1)})`}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getSentimentIcon()}
                  </Box>
                </Tooltip>

                {note.updatedAt && (
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(new Date(note.updatedAt))}
                  </Typography>
                )}

                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: "0.75rem",
                    bgcolor: "primary.main",
                  }}
                >
                  {note.title[0]?.toUpperCase()}
                </Avatar>
              </Stack>
            </Box>
          </Box>
        </>
      ) : (
        // Grid View Layout (Original)
        <>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              p: 2,
              pb: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                flex: 1,
                pr: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {note.title}
            </Typography>

            <Fade in={isHovered}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {onBookmark && (
                  <Tooltip
                    title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    <IconButton
                      size="small"
                      onClick={handleBookmark}
                      sx={{
                        color: isBookmarked ? "warning.main" : "text.secondary",
                      }}
                    >
                      {isBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />}
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{ color: "text.secondary" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Fade>
          </Box>

          {/* Content */}
          <CardContent sx={{ flex: 1, pt: 0, pb: 1 }}>
            {/* Summary */}
            {note.summary && showMetadata && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontStyle: "italic",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {note.summary}
              </Typography>
            )}

            {/* Content Preview */}
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.4,
              }}
            >
              {truncateContent(note.content)}
            </Typography>

            {/* Key Points */}
            {note.keyPoints.length > 0 && showMetadata && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Key Points:
                </Typography>
                <Stack direction="column" spacing={0.5}>
                  {note.keyPoints.slice(0, 2).map((point, index) => (
                    <Typography
                      key={index}
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      • {point}
                    </Typography>
                  ))}
                  {note.keyPoints.length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      +{note.keyPoints.length - 2} more
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}
          </CardContent>

          {/* Footer */}
          {showMetadata && (
            <CardActions
              sx={{
                p: 2,
                pt: 0,
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              {/* Tags */}
              {note.tags.length > 0 && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ mb: 1, flexWrap: "wrap" }}
                >
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        fontSize: "0.625rem",
                        height: 20,
                        bgcolor: getTagColor(tag, index),
                        color: "white",
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  ))}
                  {note.tags.length > 3 && (
                    <Chip
                      label={`+${note.tags.length - 3}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.625rem",
                        height: 20,
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  )}
                </Stack>
              )}

              {/* Meta Info */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip
                    title={`Sentiment: ${
                      note.sentiment.label
                    } (${note.sentiment.score.toFixed(1)})`}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getSentimentIcon()}
                    </Box>
                  </Tooltip>

                  {note.updatedAt && (
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(new Date(note.updatedAt))}
                    </Typography>
                  )}
                </Stack>

                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: "0.75rem",
                    bgcolor: "primary.main",
                  }}
                >
                  {note.title[0]?.toUpperCase()}
                </Avatar>
              </Box>
            </CardActions>
          )}
        </>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        {onExport && (
          <MenuItem onClick={handleExport}>
            <ListItemIcon>
              <ExportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default NoteCard;
