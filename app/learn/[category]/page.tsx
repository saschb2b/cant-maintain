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
import { getHighlighter } from "@/lib/shiki";
import { codeBlockStyles } from "@/lib/code-styles";
import { challenges } from "@/lib/game/challenges";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
} from "@/lib/game/categories";
import type { ChallengeCategory, Difficulty } from "@/lib/game/types";

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
      return "rgba(91,138,114,0.15)";
    case "medium":
      return "rgba(212,135,60,0.15)";
    case "hard":
      return "rgba(196,87,58,0.15)";
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!categorySet.has(category)) notFound();

  const cat = category as ChallengeCategory;
  const label = CATEGORY_LABELS[cat];
  const description = CATEGORY_DESCRIPTIONS[cat];
  const categoryChallenges = challenges.filter((c) => c.category === cat);

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
      goodHtml: highlighter.codeToHtml(challenge.goodCode, {
        lang: "typescript",
        theme: "github-light",
      }),
      badHtml: highlighter.codeToHtml(challenge.badCode, {
        lang: "typescript",
        theme: "github-light",
      }),
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
            fontSize: "0.85rem",
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 500,
            color: "#6B7B8D",
          }}
        >
          Learn
        </NextLink>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.85rem" }}
        >
          /
        </Typography>
        <Typography
          variant="body2"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={600}
          sx={{ fontSize: "0.85rem" }}
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
              bgcolor: "rgba(0,0,0,0.06)",
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
            elevation={0}
            sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}
          >
            {/* Header */}
            <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {challenge.title}
                </Typography>
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
              <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
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
                      bgcolor: "rgba(196,87,58,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={11} color="#C4573A" strokeWidth={3} />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono), monospace"
                    color="error.main"
                    sx={{ fontSize: "0.7rem" }}
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

              <Box sx={{ flex: "1 1 50%", minWidth: 0 }}>
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
                      bgcolor: "rgba(91,138,114,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={11} color="#5B8A72" strokeWidth={3} />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono), monospace"
                    color="success.main"
                    sx={{ fontSize: "0.7rem" }}
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
            <Box sx={{ px: 2.5, py: 2 }}>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.7, color: "text.secondary" }}
              >
                {challenge.explanationCorrect}
              </Typography>
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
                  fontSize: "0.8rem",
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
                <ArrowLeft size={16} color="#6B7B8D" />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                    sx={{ fontSize: "0.7rem" }}
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
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Next
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {CATEGORY_LABELS[next]}
                  </Typography>
                </Box>
                <ArrowRight size={16} color="#6B7B8D" />
              </Stack>
            </Paper>
          </NextLink>
        )}
      </Stack>
    </>
  );
}
