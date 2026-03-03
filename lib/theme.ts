"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#161625",
      paper: "#1e1e30",
    },
    primary: {
      main: "#2bd97b",
      contrastText: "#161625",
    },
    secondary: {
      main: "#2a2a40",
      contrastText: "#c8c8c8",
    },
    error: {
      main: "#e04040",
      contrastText: "#f0f0f0",
    },
    warning: {
      main: "#d4913d",
      contrastText: "#161625",
    },
    success: {
      main: "#2bd97b",
      contrastText: "#161625",
    },
    accent: {
      main: "#d4913d",
      light: "#e0a85a",
      dark: "#b07830",
      contrastText: "#161625",
    },
    text: {
      primary: "#f0f0f0",
      secondary: "#888888",
    },
    divider: "#383850",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, #1e1e35 0%, #161625 60%)",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-geist-mono), monospace",
          fontWeight: 500,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 4,
        },
      },
    },
  },
});

export default theme;
