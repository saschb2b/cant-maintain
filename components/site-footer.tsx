import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Heart, Coffee, ExternalLink } from "lucide-react";

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
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
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
  );
}
