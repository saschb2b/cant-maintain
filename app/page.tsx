import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {
  ArrowRight,
  Check,
  X,
  Star,
  GitPullRequest,
  Code2,
  Heart,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@/components/mesh-gradient";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { codeBlockStyles } from "@/lib/code-styles";

const BAD_CODE = `interface UserCardProps {
  data: User;
  active: boolean;
  click: () => void;
}`;

const GOOD_CODE = `interface UserCardProps {
  user: User;
  isActive: boolean;
  onClick: () => void;
}`;

export default async function LandingPage() {
  const highlighter = await getHighlighter();
  const badCodeHtml = highlightDual(highlighter, BAD_CODE);
  const goodCodeHtml = highlightDual(highlighter, GOOD_CODE);
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
        maxWidth="lg"
        sx={{
          pt: { xs: 3, md: 12 },
          pb: { xs: 3, md: 8 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 3, md: 8 }}
        >
          {/* Left — title, subtitle, CTA */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              sx={{
                lineHeight: 1.15,
                mb: { xs: 1, md: 2 },
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              One component.
              <br />
              <Box component="span" sx={{ color: "error.main" }}>
                Two APIs.
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                mb: { xs: 2, md: 4 },
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Can you tell which props your future self will thank you for?
              Train your eye in under 5 minutes.
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
            >
              <NextLink href="/play" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    px: { xs: 3, md: 5 },
                    py: { xs: 1, md: 1.5 },
                    fontSize: { xs: "0.9rem", md: "1.05rem" },
                  }}
                >
                  Start Playing
                </Button>
              </NextLink>
              <NextLink href="/learn" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  size="large"
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 1.5 },
                    fontSize: { xs: "0.9rem", md: "1.05rem" },
                  }}
                >
                  Browse Patterns
                </Button>
              </NextLink>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{
                mt: 1.5,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              10 challenges &middot; no signup &middot; takes 3 min
            </Typography>
          </Box>

          {/* Right — code preview */}
          <Box sx={{ flex: 1, minWidth: 0, maxWidth: 520, width: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                overflow: "hidden",
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
                  sx={{ letterSpacing: "0.05em" }}
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
                <Box sx={{ flex: 1 }}>
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
                      Worse
                    </Typography>
                  </Stack>
                  <Box
                    sx={codeBlockStyles}
                    dangerouslySetInnerHTML={{ __html: badCodeHtml }}
                  />
                </Box>

                {/* Divider on mobile */}
                <Divider sx={{ display: { sm: "none" } }} />

                {/* Good code */}
                <Box sx={{ flex: 1 }}>
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
                      Better
                    </Typography>
                  </Stack>
                  <Box
                    sx={codeBlockStyles}
                    dangerouslySetInnerHTML={{ __html: goodCodeHtml }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* What you'll learn */}
      <Box
        sx={{
          bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.6)",
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
            {"Train your eye for code that lasts"}
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
                  bgcolor: "rgba(var(--mui-palette-error-mainChannel) / 0.08)",
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
                  typography: "body2",
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
                  bgcolor:
                    "rgba(var(--mui-palette-success-mainChannel) / 0.08)",
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
                  bgcolor: "rgba(var(--mui-palette-error-mainChannel) / 0.08)",
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
                  typography: "body2",
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
                  bgcolor:
                    "rgba(var(--mui-palette-success-mainChannel) / 0.08)",
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
                  bgcolor: "rgba(var(--mui-palette-error-mainChannel) / 0.08)",
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
                  typography: "body2",
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
                  bgcolor:
                    "rgba(var(--mui-palette-success-mainChannel) / 0.08)",
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

      {/* Open source */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 7 }, position: "relative", zIndex: 1 }}
      >
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            px: { xs: 3, md: 5 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={{ xs: 3, md: 5 }}
          >
            {/* Left — title + description */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" component="p" fontWeight={600}>
                Open source &amp; community-driven
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7, mt: 0.5 }}
              >
                New challenges, categories, and improvements are all welcome.
              </Typography>
            </Box>

            {/* Middle — actions with icon circles */}
            <Stack direction="row" spacing={4} sx={{ flexShrink: 0 }}>
              {[
                {
                  icon: <Star size={18} />,
                  label: "Star",
                  color: "#D4A017",
                  bg: "rgba(212,160,23,0.10)",
                },
                {
                  icon: <GitPullRequest size={18} />,
                  label: "Contribute",
                  color: "success.main",
                  bg: "rgba(var(--mui-palette-success-mainChannel) / 0.10)",
                },
                {
                  icon: <Code2 size={18} />,
                  label: "Add challenges",
                  color: "#4A7FB5",
                  bg: "rgba(74,127,181,0.10)",
                },
                {
                  icon: <Heart size={18} />,
                  label: "Sponsor",
                  color: "error.main",
                  bg: "rgba(var(--mui-palette-error-mainChannel) / 0.10)",
                },
              ].map((item) => (
                <Stack key={item.label} alignItems="center" spacing={0.75}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: item.bg,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Right — CTA button */}
            <NextLink
              href="https://github.com/saschb2b/cant-maintain"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", flexShrink: 0 }}
            >
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  px: 3,
                  borderColor: "divider",
                  color: "text.primary",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "text.secondary",
                    bgcolor: "action.hover",
                  },
                }}
              >
                View on GitHub
              </Button>
            </NextLink>
          </Stack>
        </Paper>
      </Container>

      <SiteFooter />
    </Box>
  );
}
