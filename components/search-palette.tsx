"use client";

import {
  Box,
  Chip,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  Search,
  FileText,
  BookOpen,
  Code,
  Gamepad2,
  GraduationCap,
  ScrollText,
  X,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Fuse, { type FuseResult } from "fuse.js";
import { searchItems, type SearchItem } from "@/lib/search-items";
import { CATEGORY_SECTIONS } from "@/lib/game/categories";
import { trackEvent } from "@/lib/analytics";

const MAX_VISIBLE_CHALLENGES = 5;

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
// Icon resolution
// ---------------------------------------------------------------------------
const typeIconMap: Record<SearchItem["type"], typeof Search> = {
  page: FileText,
  category: BookOpen,
  challenge: Code,
};

const pageIconMap: Record<string, typeof Search> = {
  play: Gamepad2,
  learn: GraduationCap,
  changelog: ScrollText,
};

function getIcon(item: SearchItem): typeof Search {
  if (item.icon) return pageIconMap[item.icon] ?? typeIconMap[item.type];
  return typeIconMap[item.type];
}

// ---------------------------------------------------------------------------
// Difficulty dot color
// ---------------------------------------------------------------------------
function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "var(--mui-palette-success-main)";
    case "medium":
      return "var(--mui-palette-warning-main)";
    case "hard":
      return "var(--mui-palette-error-main)";
    default:
      return "var(--mui-palette-text-disabled)";
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isKeyboardNav = useRef(false);

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

  const hiddenChallengeCount =
    !showAllChallenges && grouped.challenges.length > MAX_VISIBLE_CHALLENGES
      ? grouped.challenges.length - MAX_VISIBLE_CHALLENGES
      : 0;

  const visibleChallenges = showAllChallenges
    ? grouped.challenges
    : grouped.challenges.slice(0, MAX_VISIBLE_CHALLENGES);

  // Flat list for keyboard navigation
  const flatResults = useMemo(
    () => [...grouped.pages, ...grouped.categories, ...visibleChallenges],
    [grouped.pages, grouped.categories, visibleChallenges],
  );

  // Show all items when query is empty (browseable)
  const showBrowse = !query.trim();
  const browseItems = useMemo(() => {
    const pages = searchItems.filter((i) => i.type === "page");
    const categoryItems = searchItems.filter((i) => i.type === "category");
    const categoryMap = new Map(categoryItems.map((c) => [c.href, c]));

    // Group categories by section, preserving CATEGORY_SECTIONS order
    const sections = CATEGORY_SECTIONS.map((section) => ({
      label: section.label,
      items: section.categories
        .map((cat) => categoryMap.get(`/learn/${cat}`))
        .filter(Boolean) as SearchItem[],
    })).filter((s) => s.items.length > 0);

    const flat = [...pages, ...sections.flatMap((s) => s.items)];

    return { pages, sections, flat };
  }, []);

  const activeList = showBrowse ? browseItems.flat : flatResults;

  // Reset "show all" when query changes
  useEffect(() => {
    setShowAllChallenges(false);
  }, [query]);

  // Scroll highlighted item into view (keyboard navigation only)
  useEffect(() => {
    if (isKeyboardNav.current) {
      resultRefs.current[highlightedIndex]?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      isKeyboardNav.current = false;
    }
  }, [highlightedIndex]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setQuery("");
      setHighlightedIndex(0);
      setShowAllChallenges(false);
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
        isKeyboardNav.current = true;
        setHighlightedIndex((i) => (i < activeList.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        isKeyboardNav.current = true;
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
      bgcolor: isHighlighted ? "action.selected" : "transparent",
      transform: isHighlighted ? "translateX(4px)" : "translateX(0)",
      transition:
        "background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease",
      scrollMarginTop: 40,
      "&:hover": { bgcolor: "action.hover" },
    }) as const;

  const renderSearchResult = (
    result: FuseResult<SearchItem>,
    _index: number,
    globalIndex: number,
  ) => {
    const titleMatch = result.matches?.find((m) => m.key === "title");
    const descMatch = result.matches?.find((m) => m.key === "description");
    const isHighlighted = globalIndex === highlightedIndex;
    const Icon = getIcon(result.item);

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
        <Box
          component={Icon}
          size={18}
          strokeWidth={2.5}
          sx={{
            flexShrink: 0,
            color: isHighlighted ? "primary.light" : "text.primary",
            transition: "color 0.15s ease",
          }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{
                color: isHighlighted ? "primary.light" : "text.primary",
                transition: "color 0.15s ease",
              }}
            >
              {highlightMatches(
                result.item.title,
                titleMatch?.indices as [number, number][] | undefined,
              )}
            </Typography>
            {result.item.difficulty && (
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: difficultyColor(result.item.difficulty),
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
          <Typography
            variant="caption"
            noWrap
            color="text.primary"
            display="block"
            sx={{ opacity: 0.7 }}
          >
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
    const Icon = getIcon(item);

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
        <Box
          component={Icon}
          size={18}
          strokeWidth={2.5}
          sx={{
            flexShrink: 0,
            color: isHighlighted ? "primary.light" : "text.primary",
            transition: "color 0.15s ease",
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              color: isHighlighted ? "primary.light" : "text.primary",
              transition: "color 0.15s ease",
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            color="text.primary"
            display="block"
            sx={{ opacity: 0.7 }}
          >
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
        pt: hasItemsAbove ? 1.25 : 0.75,
        pb: 0.75,
        display: "block",
        color: "text.secondary",
        position: "sticky",
        top: 0,
        zIndex: 1,
        bgcolor: "background.paper",
        backgroundImage: "var(--Paper-overlay)",
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
            bgcolor: "rgba(var(--mui-palette-background-defaultChannel) / 0.7)",
            backdropFilter: "blur(8px)",
          },
        },
        paper: {
          sx: {
            overflow: "hidden",
            position: "fixed",
            m: 0,
            display: "flex",
            flexDirection: "column",
            border: 1,
            borderColor: "divider",
            // Mobile: fullscreen / Desktop: centered floating
            top: { xs: 0, sm: "15%" },
            left: { xs: 0, sm: "50%" },
            right: { xs: 0, sm: "auto" },
            transform: { xs: "none", sm: "translateX(-50%)" },
            maxHeight: { xs: "100%", sm: "70vh" },
            height: { xs: "100%", sm: "auto" },
            width: { xs: "100%", sm: "100%" },
            borderRadius: { xs: 0, sm: 1 },
            borderWidth: { xs: 0, sm: 1 },
            boxShadow: {
              xs: "none",
              sm: "0 16px 48px rgba(var(--mui-palette-text-primaryChannel) / 0.15)",
            },
          },
        },
      }}
    >
      {/* Search Input */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, pb: 1, gap: 1 }}>
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
                  <Box
                    component={Search}
                    size={18}
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setQuery("");
                      setHighlightedIndex(0);
                      inputRef.current?.focus();
                    }}
                    sx={{ color: "text.secondary" }}
                  >
                    <X size={16} />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: {
                bgcolor: "background.default",
                "& fieldset": {
                  borderColor: "divider",
                },
              },
            },
          }}
        />
        <Typography
          component="button"
          variant="body2"
          onClick={handleClose}
          sx={{
            display: { xs: "block", sm: "none" },
            flexShrink: 0,
            background: "none",
            border: "none",
            color: "primary.main",
            cursor: "pointer",
            fontWeight: 500,
            p: 0,
          }}
        >
          Cancel
        </Typography>
      </Box>

      {/* Results */}
      <Box
        sx={{
          maxHeight: { xs: "none", sm: "calc(70vh - 130px)" },
          flex: { xs: 1, sm: "initial" },
          overflowY: "auto",
          pb: 0.5,
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
            {browseItems.sections.map((section) => (
              <Box key={section.label}>
                {renderGroupHeader(section.label, true)}
                {section.items.map((item) =>
                  renderBrowseItem(item, globalIndex++),
                )}
              </Box>
            ))}
          </>
        ) : flatResults.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4, px: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No results found
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ mt: 0.5, display: "block" }}
            >
              Try a prop name, category, or pattern like &quot;onClick&quot; or
              &quot;boolean&quot;
            </Typography>
          </Box>
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
            {visibleChallenges.length > 0 && (
              <>
                {renderGroupHeader(
                  "Challenges",
                  grouped.pages.length > 0 || grouped.categories.length > 0,
                )}
                {visibleChallenges.map((result, i) =>
                  renderSearchResult(result, i, globalIndex++),
                )}
                {hiddenChallengeCount > 0 && (
                  <Chip
                    label={`Show ${String(hiddenChallengeCount)} more challenges`}
                    size="small"
                    variant="outlined"
                    onClick={() => setShowAllChallenges(true)}
                    sx={{
                      mx: 3,
                      mt: 0.5,
                      mb: 0.5,
                      borderColor: "divider",
                      color: "text.secondary",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "secondary.main",
                        borderColor: "text.secondary",
                      },
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </Box>

      {/* Footer — keyboard hints (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          gap: 3,
          px: 2.5,
          py: 1.25,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.default",
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
