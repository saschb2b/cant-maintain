"use client";

import { useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";

const allCategories = CATEGORY_SECTIONS.flatMap((s) => s.categories);

export function LearnMobileNav() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "block", md: "none" },
        mx: -2,
        px: 2,
        pb: 2,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack direction="row" spacing={0.75} sx={{ minWidth: "max-content" }}>
        {allCategories.map((category) => {
          const isActive = pathname === `/learn/${category}`;
          return (
            <NextLink
              key={category}
              ref={isActive ? activeRef : undefined}
              href={`/learn/${category}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: isActive ? "primary.main" : "rgba(0,0,0,0.05)",
                  color: isActive ? "primary.contrastText" : "text.secondary",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={isActive ? 600 : 500}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {CATEGORY_LABELS[category]}
                </Typography>
              </Box>
            </NextLink>
          );
        })}
      </Stack>
    </Box>
  );
}
