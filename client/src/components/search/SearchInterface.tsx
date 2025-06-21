import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Stack,
  Typography,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  type SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";

import type {
  SearchRequest,
  SentimentLabel,
  SortOption,
  ViewMode,
} from "../../types";
import { sentimentColors, tagColors } from "../../ui/theme";

type SearchInterfaceProps = {
  onSearch: (searchParams: SearchRequest) => void;
  availableTags: string[];
  isLoading?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchParams: SearchRequest;
};

const SearchInterface = ({
  searchParams,
  onSearch,
  availableTags,
  isLoading = false,
  viewMode,
  onViewModeChange,
}: SearchInterfaceProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search query change
  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch({
      query,
      page: 1,
    });
  };

  // Handle tags change
  const handleTagsChange = (
    _event: React.SyntheticEvent,
    newTags: string[]
  ) => {
    onSearch({
      tags: newTags,
      page: 1,
    });
  };

  // Handle sentiment change
  const handleSentimentChange = (
    event: SelectChangeEvent<SentimentLabel | "">
  ) => {
    const sentiment = event.target.value as SentimentLabel | "";
    onSearch({
      sentiment: sentiment || undefined,
      page: 1,
    });
  };

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    const sortBy = event.target.value as SortOption;
    onSearch({
      sortBy,
      page: 1,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedParams: SearchRequest = {
      query: "",
      tags: [],
      sentiment: undefined,
      sortBy: "date",
      page: 1,
      limit: 20,
    };
    onSearch(clearedParams);
    setSearchQuery("");
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch({
      query: "",
      page: 1,
    });
  };

  // Get tag color
  const getTagColor = (tag: string): string => {
    const index = availableTags.indexOf(tag) % tagColors.length;
    return tagColors[index];
  };

  // Check if any filters are active
  const hasActiveFilters =
    (searchParams.tags?.length || 0) > 0 || searchParams.sentiment;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack spacing={2}>
        {/* Main Search Bar */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <TextField
            fullWidth
            placeholder="Search notes by title, content, summary, or key points..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={isLoading}
          />

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
          >
            Filters{" "}
            {hasActiveFilters &&
              `(${
                (searchParams.tags?.length || 0) +
                (searchParams.sentiment ? 1 : 0)
              })`}
          </Button>
        </Box>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography variant="caption" color="text.secondary">
                Active filters:
              </Typography>

              {/* Tag chips */}
              {searchParams.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onDelete={() => {
                    const newTags =
                      searchParams.tags?.filter((t) => t !== tag) || [];
                    onSearch({
                      tags: newTags,
                      page: 1,
                    });
                  }}
                  sx={{
                    bgcolor: getTagColor(tag),
                    color: "white",
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                    },
                  }}
                />
              ))}

              {/* Sentiment chip */}
              {searchParams.sentiment && (
                <Chip
                  label={`Sentiment: ${searchParams.sentiment}`}
                  size="small"
                  onDelete={() =>
                    onSearch({
                      sentiment: undefined,
                      page: 1,
                    })
                  }
                  sx={{
                    bgcolor: sentimentColors[searchParams.sentiment].main,
                    color: "white",
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                    },
                  }}
                />
              )}

              <Button size="small" onClick={handleClearFilters} sx={{ ml: 1 }}>
                Clear All
              </Button>
            </Stack>
          </Box>
        )}

        {/* Advanced Filters */}
        <Collapse in={showAdvanced}>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {/* Tags Filter */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <Autocomplete
                  multiple
                  options={availableTags}
                  value={searchParams.tags || []}
                  onChange={handleTagsChange}
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
                      label="Filter by Tags"
                      placeholder="Select tags"
                    />
                  )}
                />
              </FormControl>

              {/* Sentiment Filter */}
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Sentiment</InputLabel>
                <Select
                  value={searchParams.sentiment || ""}
                  onChange={handleSentimentChange}
                  label="Sentiment"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
                </Select>
              </FormControl>

              {/* Sort By */}
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={searchParams.sortBy || "date"}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="date">Date Modified</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="relevance">Relevance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default SearchInterface;
