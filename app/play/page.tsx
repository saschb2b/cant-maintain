import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Game } from "@/components/game/game";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@/components/mesh-gradient";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Pick the better React prop naming in 10 side-by-side code challenges. Covers callbacks, booleans, JSDoc, discriminated unions, and more.",
};

export default function PlayPage() {
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
        <Game />
      </Container>

      <SiteFooter />
    </Box>
  );
}
