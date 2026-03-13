"use client";

import NextLink from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useColorScheme } from "@mui/material/styles";
import { Search, Sun, Moon } from "lucide-react";
import packageJson from "@/package.json";
import { SearchPalette } from "@/components/search-palette";
import { trackEvent } from "@/lib/analytics";

function ColorSchemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted) {
    return <IconButton size="small" sx={{ color: "text.secondary" }} />;
  }

  // Resolve "system" to the actual preference
  const resolvedMode = mode === "system" ? systemMode : mode;
  const isDark = resolvedMode === "dark";

  return (
    <IconButton
      size="small"
      onClick={() => setMode(isDark ? "light" : "dark")}
      sx={{ color: "text.secondary" }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback((trigger: "hotkey" | "button") => {
    trackEvent("search-opened", { trigger });
    setSearchOpen(true);
  }, []);

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch("hotkey");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  return (
    <>
      <Box component="header" sx={{ position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
            <NextLink
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Image src="/icon.svg" alt="" width={28} height={28} />
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  lineHeight={1.2}
                >
                  {"Can't Maintain"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Can you spot the better API?
                </Typography>
              </Box>
            </NextLink>
            <NextLink
              href="/changelog"
              style={{ textDecoration: "none", display: "contents" }}
            >
              <Chip
                clickable
                label={`v${packageJson.version}`}
                size="small"
                variant="outlined"
                sx={{
                  ml: 1.5,
                  height: 22,
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  letterSpacing: "0.05em",
                  fontFamily: "var(--font-geist-mono), monospace",
                  borderColor: "primary.main",
                  color: "primary.main",
                  backgroundColor:
                    "rgba(var(--mui-palette-primary-mainChannel) / 0.08)",
                  display: { xs: "none", sm: "flex" },
                }}
              />
            </NextLink>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              <Button
                onClick={() => openSearch("button")}
                size="small"
                sx={{
                  color: "primary.main",
                  gap: 0.75,
                  borderRadius: 100,
                  minWidth: "auto",
                  bgcolor:
                    "rgba(var(--mui-palette-primary-mainChannel) / 0.08)",
                  border: 1,
                  borderColor:
                    "rgba(var(--mui-palette-primary-mainChannel) / 0.15)",
                  px: 2,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  fontFamily: "var(--font-geist-mono), monospace",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor:
                      "rgba(var(--mui-palette-primary-mainChannel) / 0.14)",
                    borderColor:
                      "rgba(var(--mui-palette-primary-mainChannel) / 0.25)",
                  },
                }}
              >
                <Search size={14} />
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Search
                </Box>
                <Box
                  component="kbd"
                  sx={{
                    display: { xs: "none", md: "inline" },
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    ml: 0.5,
                    opacity: 0.5,
                  }}
                >
                  Ctrl K
                </Box>
              </Button>
              <ColorSchemeToggle />
              <NextLink
                href="/learn"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Learn
                </Typography>
              </NextLink>
              <NextLink href="/play" style={{ textDecoration: "none" }}>
                <Button variant="contained" size="small">
                  Play
                </Button>
              </NextLink>
            </Stack>
          </Stack>
        </Container>
        <Divider />
      </Box>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
