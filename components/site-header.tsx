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
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import { Search, Sun, Moon, GraduationCap } from "lucide-react";
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
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        size="small"
        onClick={() => setMode(isDark ? "light" : "dark")}
        sx={{ color: "text.secondary" }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>
    </Tooltip>
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
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          bgcolor: "var(--header-bg)",
          backdropFilter: "blur(12px)",
          '[data-mui-color-scheme="light"] &': {
            "--header-bg": "rgba(245, 240, 235, 0.8)",
          },
          '[data-mui-color-scheme="dark"] &': {
            "--header-bg": "rgba(26, 23, 20, 0.8)",
          },
        }}
      >
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
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
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
                >
                  Can you spot the better API?
                </Typography>
              </Box>
            </NextLink>
            <NextLink
              href="/changelog"
              style={{ textDecoration: "none", display: "contents" }}
            >
              <Tooltip title="View changelog">
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
              </Tooltip>
            </NextLink>

            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              {/* Search: icon button on mobile, pill on desktop */}
              <Tooltip title="Search">
                <IconButton
                  onClick={() => openSearch("button")}
                  size="small"
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    color: "text.secondary",
                  }}
                  aria-label="Search"
                >
                  <Search size={18} />
                </IconButton>
              </Tooltip>
              <Button
                onClick={() => openSearch("button")}
                size="small"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
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
                Search
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
                <Tooltip title="Learn">
                  <IconButton
                    component="span"
                    size="small"
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      color: "text.secondary",
                    }}
                    aria-label="Learn"
                  >
                    <GraduationCap size={18} />
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    display: { xs: "none", sm: "block" },
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
