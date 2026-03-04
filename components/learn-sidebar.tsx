"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";

export function LearnSidebar() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        width: 220,
        flexShrink: 0,
        position: "sticky",
        top: 24,
        alignSelf: "flex-start",
        py: { md: 4 },
        display: { xs: "none", md: "block" },
      }}
    >
      <NextLink
        href="/learn"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{
            mb: 2.5,
            px: 1.5,
            color: pathname === "/learn" ? "text.primary" : "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          Learn
        </Typography>
      </NextLink>

      <Stack spacing={2.5}>
        {CATEGORY_SECTIONS.map((section) => (
          <Box key={section.label}>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                px: 1.5,
                mb: 0.5,
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              {section.label}
            </Typography>

            <Stack spacing={0.25}>
              {section.categories.map((category) => {
                const isActive = pathname === `/learn/${category}`;
                return (
                  <NextLink
                    key={category}
                    href={`/learn/${category}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "text.primary" : "text.secondary",
                        borderLeft: 2,
                        borderColor: isActive ? "primary.main" : "transparent",
                        borderRadius: 0,
                        transition: "all 0.15s ease",
                        "&:hover": { color: "text.primary" },
                      }}
                    >
                      {CATEGORY_LABELS[category]}
                    </Typography>
                  </NextLink>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
