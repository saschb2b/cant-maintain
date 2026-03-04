import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" width={28} height={28} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
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

          <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
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
          </Stack>
        </Stack>
      </Container>
      <Divider />
    </Box>
  );
}
