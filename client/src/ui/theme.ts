import { createTheme } from "@mui/material/styles";

// Create custom theme
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Blue-600
      light: "#60a5fa", // Blue-400
      dark: "#1d4ed8", // Blue-700
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7c3aed", // Violet-600
      light: "#a78bfa", // Violet-400
      dark: "#5b21b6", // Violet-700
      contrastText: "#ffffff",
    },
    error: {
      main: "#dc2626", // Red-600
      light: "#f87171", // Red-400
      dark: "#991b1b", // Red-700
    },
    warning: {
      main: "#d97706", // Amber-600
      light: "#fbbf24", // Amber-400
      dark: "#92400e", // Amber-700
    },
    success: {
      main: "#059669", // Emerald-600
      light: "#34d399", // Emerald-400
      dark: "#047857", // Emerald-700
    },
    info: {
      main: "#0891b2", // Cyan-600
      light: "#22d3ee", // Cyan-400
      dark: "#0e7490", // Cyan-700
    },
    background: {
      default: "#f8fafc", // Slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Slate-900
      secondary: "#475569", // Slate-600
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          padding: "8px 16px",
        },
        sizeSmall: {
          padding: "6px 12px",
          fontSize: "0.875rem",
        },
        sizeLarge: {
          padding: "12px 24px",
          fontSize: "1rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: "0.75rem",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    background: {
      default: "#0f172a", // Slate-900
      paper: "#1e293b", // Slate-800
    },
    text: {
      primary: "#f8fafc", // Slate-50
      secondary: "#cbd5e1", // Slate-300
    },
  },
});

// Custom sentiment colors
export const sentimentColors = {
  positive: {
    main: "#059669", // Emerald-600
    light: "#34d399", // Emerald-400
    bg: "#ecfdf5", // Emerald-50
  },
  negative: {
    main: "#dc2626", // Red-600
    light: "#f87171", // Red-400
    bg: "#fef2f2", // Red-50
  },
  neutral: {
    main: "#64748b", // Slate-500
    light: "#94a3b8", // Slate-400
    bg: "#f8fafc", // Slate-50
  },
} as const;

// Tag colors for visual distinction
export const tagColors = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
] as const;
