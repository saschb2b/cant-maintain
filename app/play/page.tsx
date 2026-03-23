import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Game } from "@/components/game/game";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@/components/mesh-gradient";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { challenges } from "@/lib/game/challenges";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Pick the better React component API in 10 side-by-side code challenges. Covers props, composition, TypeScript patterns, and more.",
};

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const { seed: defaultSeed } = await searchParams;
  const highlighter = await getHighlighter();

  const highlightMap: Record<string, { goodHtml: string; badHtml: string }> =
    {};
  for (const challenge of challenges) {
    highlightMap[challenge.id] = {
      goodHtml: highlightDual(highlighter, challenge.goodCode),
      badHtml: highlightDual(highlighter, challenge.badCode),
    };
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <MeshGradient />
      <SiteHeader />

      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: 4, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Game
          challenges={challenges}
          highlightMap={highlightMap}
          defaultSeed={defaultSeed}
        />
      </Container>

      <SiteFooter />
    </Box>
  );
}
