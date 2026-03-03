import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { Code2, ArrowRight, Check, X, Zap, Target, Trophy } from "lucide-react";

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box component="header">
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
      <Container maxWidth="md" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 4, md: 6 } }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: { xs: 4, md: 6 } }}>
          <Chip
            label="React prop naming trainer"
            size="small"
            sx={{
              bgcolor: "rgba(43,76,126,0.08)",
              color: "primary.main",
              fontWeight: 600,
              fontSize: "0.7rem",
              mb: 1,
            }}
          />
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
          bgcolor: "secondary.main",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
          py: { xs: 5, md: 6 },
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

      {/* How It Works */}
      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 6 } }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "rgba(43,76,126,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <Zap size={18} color="#2B4C7E" />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>
                Two snippets, one choice
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read real interface code side by side. Pick the one with better
                prop naming. No trick questions.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "rgba(91,138,114,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <Target size={18} color="#5B8A72" />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>
                Instant feedback
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Every answer comes with a clear explanation and a link to the
                source convention. Learn the &ldquo;why&rdquo;, not just the
                rule.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "rgba(212,135,60,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <Trophy size={18} color="#D4873C" />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>
                Adaptive difficulty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start easy, get harder. Challenges scale from basic naming to
                advanced MUI and discriminated union patterns.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Container>

      {/* Bottom CTA */}
      <Box sx={{ textAlign: "center", pb: { xs: 6, md: 8 } }}>
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
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ mt: "auto" }}>
        <Divider />
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{ py: 2 }}
          >
            <Typography variant="caption" color="text.secondary">
              A training game for React prop naming conventions and JSDoc
              documentation.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
            >
              Built for junior devs with love
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
