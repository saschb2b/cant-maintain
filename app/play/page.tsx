import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Game } from "@/components/game/game";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@/components/mesh-gradient";
import { getHighlighter } from "@/lib/shiki";
import { challenges } from "@/lib/game/challenges";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Pick the better React prop naming in 10 side-by-side code challenges. Covers callbacks, booleans, JSDoc, discriminated unions, and more.",
};

export default async function PlayPage() {
  const highlighter = await getHighlighter();

  const highlightMap: Record<string, { goodHtml: string; badHtml: string }> =
    {};
  for (const challenge of challenges) {
    highlightMap[challenge.id] = {
      goodHtml: highlighter.codeToHtml(challenge.goodCode, {
        lang: "typescript",
        theme: "github-light",
      }),
      badHtml: highlighter.codeToHtml(challenge.badCode, {
        lang: "typescript",
        theme: "github-light",
      }),
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
        <Game challenges={challenges} highlightMap={highlightMap} />
      </Container>

      <SiteFooter />
    </Box>
  );
}
