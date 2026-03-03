import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@/components/mesh-gradient";
import { LearnSidebar } from "@/components/learn-sidebar";

export default function LearnLayout({ children }: { children: ReactNode }) {
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
        sx={{ position: "relative", zIndex: 1, flex: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { md: 4 },
          }}
        >
          <LearnSidebar />
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 750,
              py: { xs: 4, md: 5 },
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>

      <SiteFooter />
    </Box>
  );
}
