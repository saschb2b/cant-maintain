"use client";

import NextLink from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
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
import { Search, GraduationCap } from "lucide-react";
import packageJson from "@/package.json";
import { SearchPalette } from "@/components/search-palette";
import { trackEvent } from "@/lib/analytics";

/** Sun/moon SVG that morphs between states via CSS transitions. */
function ThemeIcon({ isDark, size = 18 }: { isDark: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible" }}
    >
      {/* Moon mask — slides in to create crescent, slides out for full sun */}
      <mask id="theme-toggle-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <circle
          cx={isDark ? 17 : 32}
          cy={isDark ? 7 : 2}
          r="9"
          fill="black"
          style={{ transition: "cx 0.5s ease, cy 0.5s ease" }}
        />
      </mask>

      {/* Sun body / moon body */}
      <circle
        cx="12"
        cy="12"
        r={isDark ? 9 : 5}
        fill="currentColor"
        stroke="none"
        mask="url(#theme-toggle-mask)"
        style={{ transition: "r 0.5s ease" }}
      />

      {/* Sun rays — scale out in dark mode */}
      <g
        style={{
          transformOrigin: "center",
          transition: "transform 0.5s ease, opacity 0.3s ease",
          transform: isDark ? "rotate(45deg) scale(0)" : "rotate(0deg) scale(1)",
          opacity: isDark ? 0 : 1,
        }}
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

function ColorSchemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const emptySubscribe = useCallback(
    // No external store to subscribe to — returns a no-op unsubscribe
    () => () => undefined,
    [],
  );
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Resolve "system" to the actual preference
  const resolvedMode = mode === "system" ? systemMode : mode;
  const isDark = resolvedMode === "dark";

  return (
    <Tooltip title={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : ""}>
      <IconButton
        size="small"
        onClick={mounted ? () => setMode(isDark ? "light" : "dark") : undefined}
        sx={{ color: "text.secondary" }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <Box
          sx={{
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)",
          }}
        >
          <ThemeIcon isDark={isDark} />
        </Box>
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
              <Image src="/icon.svg" alt="" width={28} height={28} priority />
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
