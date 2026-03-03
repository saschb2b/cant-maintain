import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Game } from "@/components/game/game";
import { Code2, Heart, Coffee, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Play — Can't Maintain",
};

export default function PlayPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Mesh gradient background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(43,76,126,0.18) 0%, transparent 100%)",
            "radial-gradient(ellipse 70% 50% at 90% 15%, rgba(91,138,114,0.16) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 5% 70%, rgba(212,135,60,0.13) 0%, transparent 100%)",
            "radial-gradient(ellipse 70% 60% at 85% 75%, rgba(43,76,126,0.10) 0%, transparent 100%)",
            "radial-gradient(circle at 50% 50%, rgba(196,87,58,0.05) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <Box component="header" sx={{ position: "relative", zIndex: 1 }}>
        <Container maxWidth="md">
          <Stack
            direction="row"
            alignItems="center"
            sx={{ py: 2 }}
          >
            <NextLink
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Code2 size={24} color="var(--mui-palette-primary-main)" />
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  lineHeight={1.2}
                >
                  {"Can't Maintain"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  Can you spot the better props?
                </Typography>
              </Box>
            </NextLink>
          </Stack>
        </Container>
        <Divider />
      </Box>

      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: 4, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Game />
      </Container>

      <Box component="footer" sx={{ position: "relative", zIndex: 1 }}>
        <Divider />
        <Container maxWidth="md">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={{ xs: 1.5, sm: 1 }}
            sx={{ py: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                Made with
                <Heart size={12} color="#C4573A" fill="#C4573A" />
                by{" "}
                <Box
                  component="a"
                  href="https://www.saschb2b.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Sascha
                </Box>
              </Typography>
              <Box
                component="a"
                href="https://github.com/saschb2b/cant-maintain"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  "&:hover": { color: "text.primary" },
                }}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" /></svg>
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Open Source
                </Box>
              </Box>
            </Stack>
            <Box
              component="a"
              href="https://buymeacoffee.com/qohreuukw"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "0.75rem",
                "&:hover": { color: "text.primary" },
              }}
            >
              <Coffee size={14} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Buy me a coffee
              </Box>
              <ExternalLink size={10} />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
