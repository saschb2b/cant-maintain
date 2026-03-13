"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { EmotionRegistry } from "@/components/emotion-registry";
import theme from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <MuiThemeProvider theme={theme} defaultMode="system">
        <InitColorSchemeScript attribute="class" />
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </EmotionRegistry>
  );
}
