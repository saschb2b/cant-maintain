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
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
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
          main: "#B5432A",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#9F6625",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#4A7A62",
          contrastText: "#FFFFFF",
        },
        accent: {
          main: "#9F6625",
          light: "#B87230",
          dark: "#8A5720",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#1A2332",
          secondary: "#536476",
        },
        divider: "#DDD6CA",
      },
    },
    dark: {
      palette: {
        background: {
          default: "#1A1714",
          paper: "#252119",
        },
        primary: {
          main: "#6B8FC5",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#2E2924",
          contrastText: "#E8E0D4",
        },
        error: {
          main: "#D4654E",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#C4863A",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#6BA882",
          contrastText: "#FFFFFF",
        },
        accent: {
          main: "#C4863A",
          light: "#D09550",
          dark: "#9F6625",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#E8E0D4",
          secondary: "#B0A594",
        },
        divider: "#3A3530",
        action: {
          hover: "rgba(255,255,255,0.10)",
          selected: "rgba(255,255,255,0.20)",
          focus: "rgba(255,255,255,0.24)",
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
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
        "*, *::before, *::after": {
          transition:
            "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, fill 0.3s ease, stroke 0.3s ease",
        },
        body: {
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          transition:
            "background-color 0.3s ease, background-image 0.3s ease, color 0.3s ease",
        },
        ".light body, body.light": {
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, #EDE6DB 0%, #F5F0EB 60%)",
        },
        ".dark body, body.dark": {
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, #211E1A 0%, #1A1714 60%)",
        },
        /* Shiki dual-theme toggle */
        ".shiki-dark": { display: "none" },
        ".dark .shiki-light": { display: "none" },
        ".dark .shiki-dark": { display: "block" },
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
