"use client";

import {
  Box,
  Dialog,
  InputAdornment,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Search,
  FileText,
  BookOpen,
  Code,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Fuse, { type FuseResult } from "fuse.js";
import { searchItems, type SearchItem } from "@/lib/search-items";
import { trackEvent } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Highlight helper — wraps matched characters in <mark>
// ---------------------------------------------------------------------------
function highlightMatches(
  text: string,
  indices: readonly [number, number][] | undefined,
) {
  if (!indices || indices.length === 0) return text;

  const parts: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;

  for (const [start, end] of indices) {
    if (start > lastIndex) {
      parts.push({ text: text.slice(lastIndex, start), highlight: false });
    }
    parts.push({ text: text.slice(start, end + 1), highlight: true });
    lastIndex = end + 1;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return (
    <>
      {parts.map((part, i) =>
        part.highlight ? (
          <Box
            key={`${String(i)}-${part.text}`}
            component="mark"
            sx={{
              bgcolor: "transparent",
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            {part.text}
          </Box>
        ) : (
          <span key={`${String(i)}-${part.text}`}>{part.text}</span>
        ),
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------
const iconMap: Record<SearchItem["type"], typeof Search> = {
  page: FileText,
  category: BookOpen,
  challenge: Code,
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const theme = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuse instance (static data, no fetch needed)
  const fuse = useMemo(
    () =>
      new Fuse(searchItems, {
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 2 },
          { name: "keywords", weight: 1 },
        ],
        threshold: 0.3,
        includeMatches: true,
        minMatchCharLength: 2,
      }),
    [],
  );

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query);
  }, [fuse, query]);

  // Group results by type
  const grouped = useMemo(() => {
    const pages = results.filter((r) => r.item.type === "page");
    const categories = results.filter((r) => r.item.type === "category");
    const challenges = results.filter((r) => r.item.type === "challenge");
    return { pages, categories, challenges };
  }, [results]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(
    () => [
      ...grouped.pages,
      ...grouped.categories,
      ...grouped.challenges,
    ],
    [grouped],
  );

  // Show all items when query is empty (browseable)
  const showBrowse = !query.trim();
  const browseItems = useMemo(() => {
    const pages = searchItems.filter((i) => i.type === "page");
    const categories = searchItems.filter((i) => i.type === "category");
    return { pages, categories, flat: [...pages, ...categories] };
  }, []);

  const activeList = showBrowse ? browseItems.flat : flatResults;

  // Scroll highlighted item into view
  useEffect(() => {
    resultRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setQuery("");
      setHighlightedIndex(0);
    }, 200);
  }, [onClose]);

  const navigate = useCallback(
    (href: string) => {
      handleClose();
      router.push(href);
    },
    [handleClose, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => (i < activeList.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => (i > 0 ? i - 1 : activeList.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = activeList[highlightedIndex];
        if (item) {
          const href = "item" in item ? item.item.href : item.href;
          trackEvent("search-selected", {
            query,
            selectedTitle: "item" in item ? item.item.title : item.title,
            selectedHref: href,
          });
          navigate(href);
        }
      }
    },
    [activeList, highlightedIndex, navigate, query],
  );

  // Shared row styles
  const rowSx = (isHighlighted: boolean) =>
    ({
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 2,
      py: 1.25,
      cursor: "pointer",
      borderRadius: 1,
      mx: 1,
      bgcolor: isHighlighted ? "secondary.main" : "transparent",
      transition: "background-color 0.1s ease",
      "&:hover": { bgcolor: "secondary.main" },
    }) as const;

  const renderSearchResult = (
    result: FuseResult<SearchItem>,
    _index: number,
    globalIndex: number,
  ) => {
    const titleMatch = result.matches?.find((m) => m.key === "title");
    const descMatch = result.matches?.find((m) => m.key === "description");
    const isHighlighted = globalIndex === highlightedIndex;
    const Icon = iconMap[result.item.type];

    return (
      <Box
        key={`${result.item.type}-${result.item.title}-${result.item.href}`}
        ref={(el: HTMLDivElement | null) => {
          resultRefs.current[globalIndex] = el;
        }}
        onClick={() => {
          trackEvent("search-selected", {
            query,
            selectedTitle: result.item.title,
            selectedHref: result.item.href,
          });
          navigate(result.item.href);
        }}
        onMouseEnter={() => setHighlightedIndex(globalIndex)}
        sx={rowSx(isHighlighted)}
      >
        <Icon
          size={18}
          style={{
            flexShrink: 0,
            color: isHighlighted
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              color: isHighlighted ? "primary.main" : "text.primary",
            }}
          >
            {highlightMatches(
              result.item.title,
              titleMatch?.indices as [number, number][] | undefined,
            )}
          </Typography>
          <Typography variant="caption" noWrap color="text.secondary" display="block">
            {highlightMatches(
              result.item.description,
              descMatch?.indices as [number, number][] | undefined,
            )}
          </Typography>
          {result.item.subtitle && (
            <Typography
              variant="caption"
              color="text.disabled"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {result.item.subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderBrowseItem = (item: SearchItem, globalIndex: number) => {
    const isHighlighted = globalIndex === highlightedIndex;
    const Icon = iconMap[item.type];

    return (
      <Box
        key={item.href}
        ref={(el: HTMLDivElement | null) => {
          resultRefs.current[globalIndex] = el;
        }}
        onClick={() => {
          trackEvent("search-selected", {
            query: "",
            selectedTitle: item.title,
            selectedHref: item.href,
          });
          navigate(item.href);
        }}
        onMouseEnter={() => setHighlightedIndex(globalIndex)}
        sx={rowSx(isHighlighted)}
      >
        <Icon
          size={18}
          style={{
            flexShrink: 0,
            color: isHighlighted
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              color: isHighlighted ? "primary.main" : "text.primary",
            }}
          >
            {item.title}
          </Typography>
          <Typography variant="caption" noWrap color="text.secondary" display="block">
            {item.description}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderGroupHeader = (label: string, hasItemsAbove: boolean) => (
    <Typography
      variant="overline"
      sx={{
        px: 3,
        py: 0.75,
        display: "block",
        color: "text.secondary",
        mt: hasItemsAbove ? 0.5 : 0,
      }}
    >
      {label}
    </Typography>
  );

  let globalIndex = 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      slotProps={{
        transition: {
          onEntered: () => {
            inputRef.current?.focus();
          },
        },
        backdrop: {
          sx: {
            bgcolor: alpha(theme.palette.background.default, 0.7),
            backdropFilter: "blur(6px)",
          },
        },
        paper: {
          sx: {
            overflow: "hidden",
            position: "fixed",
            top: "15%",
            m: 0,
            maxHeight: "70vh",
            border: 1,
            borderColor: "divider",
            boxShadow: `0 16px 48px ${alpha(theme.palette.text.primary, 0.12)}`,
          },
        },
      }}
    >
      {/* Search Input */}
      <Box sx={{ p: 2, pb: 1 }}>
        <TextField
          inputRef={inputRef}
          autoFocus
          fullWidth
          placeholder="Search pages, categories, challenges..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    size={18}
                    style={{ color: theme.palette.text.secondary }}
                  />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "secondary.main",
                "& fieldset": { border: "none" },
              },
            },
          }}
        />
      </Box>

      {/* Results */}
      <Box
        sx={{
          maxHeight: "calc(70vh - 130px)",
          overflowY: "auto",
          py: 0.5,
        }}
      >
        {showBrowse ? (
          <>
            {browseItems.pages.length > 0 && (
              <>
                {renderGroupHeader("Pages", false)}
                {browseItems.pages.map((item) =>
                  renderBrowseItem(item, globalIndex++),
                )}
              </>
            )}
            {browseItems.categories.length > 0 && (
              <>
                {renderGroupHeader(
                  "Categories",
                  browseItems.pages.length > 0,
                )}
                {browseItems.categories.map((item) =>
                  renderBrowseItem(item, globalIndex++),
                )}
              </>
            )}
          </>
        ) : flatResults.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            No results found
          </Typography>
        ) : (
          <>
            {grouped.pages.length > 0 && (
              <>
                {renderGroupHeader("Pages", false)}
                {grouped.pages.map((result, i) =>
                  renderSearchResult(result, i, globalIndex++),
                )}
              </>
            )}
            {grouped.categories.length > 0 && (
              <>
                {renderGroupHeader("Categories", grouped.pages.length > 0)}
                {grouped.categories.map((result, i) =>
                  renderSearchResult(result, i, globalIndex++),
                )}
              </>
            )}
            {grouped.challenges.length > 0 && (
              <>
                {renderGroupHeader(
                  "Challenges",
                  grouped.pages.length > 0 || grouped.categories.length > 0,
                )}
                {grouped.challenges.map((result, i) =>
                  renderSearchResult(result, i, globalIndex++),
                )}
              </>
            )}
          </>
        )}
      </Box>

      {/* Footer — keyboard hints */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          px: 2.5,
          py: 1.25,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "secondary.main",
        }}
      >
        {[
          {
            icons: [
              { key: "d", node: <ArrowDown size={12} /> },
              { key: "u", node: <ArrowUp size={12} /> },
            ],
            label: "Navigate",
          },
          {
            icons: [{ key: "r", node: <CornerDownLeft size={12} /> }],
            label: "Select",
          },
          {
            icons: [
              {
                key: "e",
                node: (
                  <Box
                    component="span"
                    sx={{
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      lineHeight: 1,
                      fontFamily: "var(--font-geist-mono), monospace",
                    }}
                  >
                    ESC
                  </Box>
                ),
              },
            ],
            label: "Close",
          },
        ].map((hint) => (
          <Box
            key={hint.label}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {hint.icons.map((icon) => (
              <Box
                key={icon.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: 0.5,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  color: "text.secondary",
                }}
              >
                {icon.node}
              </Box>
            ))}
            <Typography variant="caption" color="text.secondary">
              {hint.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Dialog>
  );
}
