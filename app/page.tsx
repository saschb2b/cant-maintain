import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { Game } from "@/components/game/game";
import { Code2, Github } from "lucide-react";

export default function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box component="header">
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Code2 size={24} color="var(--mui-palette-primary-main)" />
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
            </Stack>
            <Link
              href="https://react.dev/learn/passing-props-to-a-component"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.75rem",
              }}
            >
              <Github size={14} />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                React Docs
              </Box>
            </Link>
          </Stack>
        </Container>
        <Divider />
      </Box>

      <Container maxWidth="lg" component="section" sx={{ py: 4, flex: 1 }}>
        <Game />
      </Container>

      <Box component="footer">
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
