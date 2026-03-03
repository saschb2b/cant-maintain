import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {
  Code2,
  ArrowRight,
  Check,
  X,
  Heart,
  Coffee,
  ExternalLink,
} from "lucide-react";

export default function LandingPage() {
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

      {/* Header */}
      <Box component="header" sx={{ position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
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
            </Stack>
          </Stack>
        </Container>
        <Divider />
      </Box>

      {/* Hero */}
      <Container maxWidth="md" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 4, md: 6 }, position: "relative", zIndex: 1 }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            sx={{ textAlign: "center", lineHeight: 1.2, maxWidth: 520 }}
          >
            One prop name.{" "}
            <Box component="span" sx={{ color: "error.main" }}>
              Two choices.
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 440, lineHeight: 1.7 }}
          >
            Can you tell which props your future self will thank you for?
            Train your eye in under 5 minutes.
          </Typography>
        </Stack>

        {/* Code Preview — a taste of the game */}
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
            maxWidth: 540,
            mx: "auto",
            mb: { xs: 4, md: 5 },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: "secondary.main",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
            >
              WHICH IS BETTER?
            </Typography>
          </Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "none", sm: "block" } }}
              />
            }
          >
            {/* Bad code */}
            <Box sx={{ flex: 1, p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5 }}>
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
                  Worse
                </Typography>
              </Stack>
              <Box
                component="pre"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.8rem",
                  lineHeight: 1.7,
                  m: 0,
                  color: "text.secondary",
                  whiteSpace: "pre-wrap",
                }}
              >
                {`interface TodoItemProps {\n  todo: Todo;\n  `}
                <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
                  loading
                </Box>
                {`: boolean;\n  `}
                <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
                  delete
                </Box>
                {`: () => void;\n}`}
              </Box>
            </Box>

            {/* Divider on mobile */}
            <Divider sx={{ display: { sm: "none" } }} />

            {/* Good code */}
            <Box sx={{ flex: 1, p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5 }}>
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
                  Better
                </Typography>
              </Stack>
              <Box
                component="pre"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.8rem",
                  lineHeight: 1.7,
                  m: 0,
                  color: "text.secondary",
                  whiteSpace: "pre-wrap",
                }}
              >
                {`interface TodoItemProps {\n  todo: Todo;\n  `}
                <Box component="span" sx={{ color: "success.main", fontWeight: 600 }}>
                  isLoading
                </Box>
                {`: boolean;\n  `}
                <Box component="span" sx={{ color: "success.main", fontWeight: 600 }}>
                  onDelete
                </Box>
                {`: () => void;\n}`}
              </Box>
            </Box>
          </Stack>
        </Paper>

        {/* CTA */}
        <Stack alignItems="center" spacing={1.5}>
          <NextLink href="/play" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{ px: 5, py: 1.5, fontSize: "1.05rem" }}
            >
              Start Playing
            </Button>
          </NextLink>
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.7rem" }}
          >
            10 challenges &middot; no signup &middot; takes 3 min
          </Typography>
        </Stack>
      </Container>

      {/* What you'll learn */}
      <Box
        sx={{
          bgcolor: "rgba(232,224,212,0.6)",
          backdropFilter: "blur(40px)",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
          py: { xs: 5, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h5"
            component="h2"
            fontWeight={600}
            sx={{ textAlign: "center", mb: 1 }}
          >
            {"Spot the patterns PRs won't teach you"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 4 }}
          >
            Real conventions from React, MUI, and production codebases.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2.5,
                border: 1,
                borderColor: "divider",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "error.main",
                  bgcolor: "rgba(196,87,58,0.08)",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                delete
              </Box>
              <Typography
                component="span"
                sx={{
                  mx: 1,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                vs
              </Typography>
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "success.main",
                  bgcolor: "rgba(91,138,114,0.08)",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                onDelete
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5, lineHeight: 1.5 }}
              >
                Callback naming &mdash; why the{" "}
                <Box
                  component="span"
                  sx={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                >
                  on
                </Box>{" "}
                prefix matters.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2.5,
                border: 1,
                borderColor: "divider",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "error.main",
                  bgcolor: "rgba(196,87,58,0.08)",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                visible
              </Box>
              <Typography
                component="span"
                sx={{
                  mx: 1,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                vs
              </Typography>
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "success.main",
                  bgcolor: "rgba(91,138,114,0.08)",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                isVisible
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5, lineHeight: 1.5 }}
              >
                Boolean props &mdash; making yes/no questions obvious at a
                glance.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2.5,
                border: 1,
                borderColor: "divider",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "error.main",
                  bgcolor: "rgba(196,87,58,0.08)",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                {"data: any"}
              </Box>
              <Typography
                component="span"
                sx={{
                  mx: 1,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                vs
              </Typography>
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "success.main",
                  bgcolor: "rgba(91,138,114,0.08)",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                {"users: User[]"}
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5, lineHeight: 1.5 }}
              >
                Prop specificity &mdash; say what it is, not what it could be.
              </Typography>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ mt: "auto", position: "relative", zIndex: 1 }}>
        <Divider />
        <Container maxWidth="lg">
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
