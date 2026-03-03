import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { ArrowRight, Check, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@/components/mesh-gradient";

export default function LandingPage() {
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

      {/* Hero */}
      <Container
        maxWidth="md"
        sx={{
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
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
            Can you tell which props your future self will thank you for? Train
            your eye in under 5 minutes.
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
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ mb: 1.5 }}
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
                <Box
                  component="span"
                  sx={{ color: "error.main", fontWeight: 600 }}
                >
                  loading
                </Box>
                {`: boolean;\n  `}
                <Box
                  component="span"
                  sx={{ color: "error.main", fontWeight: 600 }}
                >
                  delete
                </Box>
                {`: () => void;\n}`}
              </Box>
            </Box>

            {/* Divider on mobile */}
            <Divider sx={{ display: { sm: "none" } }} />

            {/* Good code */}
            <Box sx={{ flex: 1, p: 2.5 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ mb: 1.5 }}
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
                <Box
                  component="span"
                  sx={{ color: "success.main", fontWeight: 600 }}
                >
                  isLoading
                </Box>
                {`: boolean;\n  `}
                <Box
                  component="span"
                  sx={{ color: "success.main", fontWeight: 600 }}
                >
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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

      <SiteFooter />
    </Box>
  );
}
