import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import NextLink from "next/link";
import { Heart, ExternalLink } from "lucide-react";

const linkSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  color: "text.secondary",
  textDecoration: "none",
  typography: "caption",
  "&:hover": { color: "text.primary" },
} as const;

export function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{ mt: "auto", position: "relative", zIndex: 1 }}
    >
      <Divider />
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 1.5, sm: 1 }}
          sx={{ py: 2 }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            Made with
            <Box
              component="span"
              sx={{ color: "error.main", display: "inline-flex" }}
            >
              <Heart size={12} fill="currentColor" />
            </Box>
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

          <Stack direction="row" alignItems="center" spacing={2}>
            <NextLink href="/learn" style={{ textDecoration: "none" }}>
              <Box sx={linkSx}>Learn</Box>
            </NextLink>
            <NextLink href="/changelog" style={{ textDecoration: "none" }}>
              <Box sx={linkSx}>Changelog</Box>
            </NextLink>
            <Box
              component="a"
              href="https://github.com/saschb2b/cant-maintain"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              GitHub
              <ExternalLink size={10} />
            </Box>
            <Box
              component="a"
              href="https://buymeacoffee.com/qohreuukw"
              target="_blank"
              rel="noopener noreferrer"
              sx={linkSx}
            >
              Support
              <ExternalLink size={10} />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
