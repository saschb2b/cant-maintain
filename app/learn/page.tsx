import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { ArrowRight, Check, X } from "lucide-react";
import { getHighlighter } from "@/lib/shiki";
import { codeBlockStyles } from "@/lib/code-styles";
import { challenges } from "@/lib/game/challenges";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
} from "@/lib/game/categories";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Learn React prop naming conventions across 10 categories. Side-by-side good vs bad code examples with explanations.",
};

export default async function LearnPage() {
  const highlighter = await getHighlighter();

  const sections = CATEGORY_ORDER.map((category) => {
    const categoryChallenges = challenges.filter(
      (c) => c.category === category,
    );
    const preview = categoryChallenges[0];
    return {
      category,
      label: CATEGORY_LABELS[category],
      description: CATEGORY_DESCRIPTIONS[category],
      count: categoryChallenges.length,
      preview: preview
        ? {
            goodHtml: highlighter.codeToHtml(preview.goodCode, {
              lang: "typescript",
              theme: "github-light",
            }),
            badHtml: highlighter.codeToHtml(preview.badCode, {
              lang: "typescript",
              theme: "github-light",
            }),
          }
        : null,
    };
  });

  return (
    <>
      <Stack spacing={1} sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Learn Prop Naming
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520, lineHeight: 1.7 }}
        >
          {String(challenges.length)} patterns across{" "}
          {String(CATEGORY_ORDER.length)} categories. Each one shows the
          convention, a side-by-side example, and why it matters.
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {sections.map((section) => (
          <NextLink
            key={section.category}
            href={`/learn/${section.category}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "text.secondary",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography variant="h6" fontWeight={600}>
                      {section.label}
                    </Typography>
                    <Chip
                      label={`${String(section.count)} patterns`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.7rem",
                        bgcolor: "rgba(0,0,0,0.06)",
                      }}
                    />
                  </Stack>
                  <ArrowRight size={18} color="#6B7B8D" />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.75, lineHeight: 1.6 }}
                >
                  {section.description}
                </Typography>
              </Box>

              {section.preview && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  divider={
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                  }
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    bgcolor: "#FAF8F5",
                  }}
                >
                  <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                      sx={{ px: 2, pt: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: "rgba(196,87,58,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={9} color="#C4573A" strokeWidth={3} />
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        fontFamily="var(--font-geist-mono), monospace"
                        color="error.main"
                        sx={{ fontSize: "0.65rem" }}
                      >
                        Avoid
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        ...codeBlockStyles,
                        "& pre": {
                          ...codeBlockStyles["& pre"],
                          fontSize: "0.75rem",
                          p: 1.5,
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: section.preview.badHtml,
                      }}
                    />
                  </Box>

                  <Divider sx={{ display: { sm: "none" } }} />

                  <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                      sx={{ px: 2, pt: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: "rgba(91,138,114,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check size={9} color="#5B8A72" strokeWidth={3} />
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        fontFamily="var(--font-geist-mono), monospace"
                        color="success.main"
                        sx={{ fontSize: "0.65rem" }}
                      >
                        Prefer
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        ...codeBlockStyles,
                        "& pre": {
                          ...codeBlockStyles["& pre"],
                          fontSize: "0.75rem",
                          p: 1.5,
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: section.preview.goodHtml,
                      }}
                    />
                  </Box>
                </Stack>
              )}
            </Paper>
          </NextLink>
        ))}
      </Stack>
    </>
  );
}
