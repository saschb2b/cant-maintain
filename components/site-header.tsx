import NextLink from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import packageJson from "@/package.json";

export function SiteHeader() {
  return (
    <Box component="header" sx={{ position: "relative", zIndex: 1 }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
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
            <Image src="/icon.svg" alt="" width={28} height={28} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                {"Can't Maintain"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Can you spot the better props?
              </Typography>
            </Box>
          </NextLink>
          <NextLink
            href="/changelog"
            style={{ textDecoration: "none", display: "contents" }}
          >
            <Chip
              clickable
              label={`v${packageJson.version}`}
              size="small"
              variant="outlined"
              sx={{
                ml: 1.5,
                height: 22,
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-geist-mono), monospace",
                borderColor: "primary.main",
                color: "primary.main",
                backgroundColor:
                  "rgba(var(--mui-palette-primary-mainChannel) / 0.08)",
                display: { xs: "none", sm: "flex" },
              }}
            />
          </NextLink>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ ml: "auto" }}
          >
            <NextLink
              href="/learn"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="body2"
                fontWeight={500}
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
              >
                Learn
              </Typography>
            </NextLink>
            <NextLink href="/play" style={{ textDecoration: "none" }}>
              <Button variant="contained" size="small">
                Play
              </Button>
            </NextLink>
          </Stack>
        </Stack>
      </Container>
      <Divider />
    </Box>
  );
}
