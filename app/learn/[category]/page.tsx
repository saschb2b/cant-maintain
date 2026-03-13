import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { ArrowLeft, ArrowRight, Check, ExternalLink, X } from "lucide-react";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { codeBlockStyles } from "@/lib/code-styles";
import { challenges } from "@/lib/game/challenges";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
} from "@/lib/game/categories";
import type { ChallengeCategory, Difficulty } from "@/lib/game/types";
import { FormattedText } from "@/components/formatted-text";
import { ChallengeAnchor } from "@/components/challenge-anchor";

const categorySet = new Set<string>(CATEGORY_ORDER);

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!categorySet.has(category)) return {};
  const label = CATEGORY_LABELS[category as ChallengeCategory];
  return {
    title: `${label} — Learn`,
    description: CATEGORY_DESCRIPTIONS[category as ChallengeCategory],
  };
}

function difficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "rgba(var(--mui-palette-success-mainChannel) / 0.15)";
    case "medium":
      return "rgba(var(--mui-palette-warning-mainChannel) / 0.15)";
    case "hard":
      return "rgba(var(--mui-palette-error-mainChannel) / 0.15)";
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!categorySet.has(category)) notFound();

  const cat = category as ChallengeCategory;
  const label = CATEGORY_LABELS[cat];
  const description = CATEGORY_DESCRIPTIONS[cat];
  const difficultyOrder: Record<Difficulty, number> = {
    easy: 0,
    medium: 1,
    hard: 2,
  };
  const categoryChallenges = challenges
    .filter((c) => c.category === cat)
    .sort(
      (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
    );

  const currentIndex = CATEGORY_ORDER.indexOf(cat);
  const prev = currentIndex > 0 ? CATEGORY_ORDER[currentIndex - 1] : undefined;
  const next =
    currentIndex < CATEGORY_ORDER.length - 1
      ? CATEGORY_ORDER[currentIndex + 1]
      : undefined;

  const highlighter = await getHighlighter();
  const highlighted = new Map<string, { goodHtml: string; badHtml: string }>();
  for (const challenge of categoryChallenges) {
    highlighted.set(challenge.id, {
      goodHtml: highlightDual(highlighter, challenge.goodCode),
      badHtml: highlightDual(highlighter, challenge.badCode),
    });
  }

  return (
    <>
      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 3 }}>
        <NextLink
          href="/learn"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 500,
            color: "inherit",
          }}
        >
          <Typography variant="body2" component="span" color="text.secondary">
            Learn
          </Typography>
        </NextLink>
        <Typography variant="body2" color="text.secondary">
          /
        </Typography>
        <Typography
          variant="body2"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={600}
        >
          {label}
        </Typography>
      </Stack>

      {/* Page header */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {label}
          </Typography>
          <Chip
            label={`${String(categoryChallenges.length)} patterns`}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              bgcolor: "action.hover",
            }}
          />
        </Stack>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7, maxWidth: 560 }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Challenges */}
      <Stack spacing={3}>
        {categoryChallenges.map((challenge) => (
          <Paper
            key={challenge.id}
            id={challenge.id}
            elevation={0}
            sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}
          >
            {/* Header */}
            <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ChallengeAnchor id={challenge.id} title={challenge.title} />
                <Chip
                  label={challenge.difficulty}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    bgcolor: difficultyColor(challenge.difficulty),
                  }}
                />
              </Stack>
            </Box>

            {/* Code comparison */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />
              }
              sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}
            >
              <Box sx={{ flex: "1 1 50%", minWidth: 0, bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{ px: 2, pt: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      bgcolor:
                        "rgba(var(--mui-palette-error-mainChannel) / 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "error.main",
                    }}
                  >
                    <X size={11} strokeWidth={3} />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono), monospace"
                    color="error.main"
                  >
                    Avoid
                  </Typography>
                </Stack>
                <Box
                  sx={codeBlockStyles}
                  dangerouslySetInnerHTML={{
                    __html: highlighted.get(challenge.id)?.badHtml ?? "",
                  }}
                />
              </Box>

              <Divider sx={{ display: { sm: "none" } }} />

              <Box sx={{ flex: "1 1 50%", minWidth: 0, bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{ px: 2, pt: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      bgcolor:
                        "rgba(var(--mui-palette-success-mainChannel) / 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "success.main",
                    }}
                  >
                    <Check size={11} strokeWidth={3} />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono), monospace"
                    color="success.main"
                  >
                    Prefer
                  </Typography>
                </Stack>
                <Box
                  sx={codeBlockStyles}
                  dangerouslySetInnerHTML={{
                    __html: highlighted.get(challenge.id)?.goodHtml ?? "",
                  }}
                />
              </Box>
            </Stack>

            {/* Explanation + source */}
            <Box sx={{ px: 2.5, py: 2, maxWidth: 720 }}>
              <Box
                sx={{
                  typography: "body2",
                  lineHeight: 1.75,
                  color: "text.primary",
                }}
              >
                <FormattedText text={challenge.explanationCorrect} />
              </Box>
              <Link
                href={challenge.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 1.5,
                  typography: "caption",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontWeight: 500,
                }}
              >
                <ExternalLink size={12} />
                {challenge.sourceLabel}
              </Link>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Previous / Next navigation */}
      <Stack
        direction="row"
        justifyContent={prev ? "space-between" : "flex-end"}
        sx={{ mt: 5 }}
      >
        {prev && (
          <NextLink
            href={`/learn/${prev}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                px: 2.5,
                py: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "text.secondary",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <ArrowLeft size={16} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    Previous
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {CATEGORY_LABELS[prev]}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </NextLink>
        )}
        {next && (
          <NextLink
            href={`/learn/${next}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                px: 2.5,
                py: 2,
                textAlign: "right",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "text.secondary",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    Next
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {CATEGORY_LABELS[next]}
                  </Typography>
                </Box>
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <ArrowRight size={16} />
                </Box>
              </Stack>
            </Paper>
          </NextLink>
        )}
      </Stack>
    </>
  );
}
