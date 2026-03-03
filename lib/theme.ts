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
    mode: "light",
    background: {
      default: "#F5F0EB",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#2B4C7E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E8E0D4",
      contrastText: "#1A2332",
    },
    error: {
      main: "#C4573A",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D4873C",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#5B8A72",
      contrastText: "#FFFFFF",
    },
    accent: {
      main: "#D4873C",
      light: "#E09B56",
      dark: "#B87230",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#1A2332",
      secondary: "#6B7B8D",
    },
    divider: "#DDD6CA",
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
            "radial-gradient(ellipse at 50% 0%, #EDE6DB 0%, #F5F0EB 60%)",
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
