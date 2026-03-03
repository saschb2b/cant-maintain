"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { ExternalLink } from "lucide-react";

interface ExplanationPanelProps {
  isCorrect: boolean;
  text: string;
  sourceUrl: string;
  sourceLabel: string;
}

export function ExplanationPanel({
  isCorrect,
  text,
  sourceUrl,
  sourceLabel,
}: ExplanationPanelProps) {
  const color = isCorrect ? "success" : "error";

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: isCorrect ? "rgba(91,138,114,0.3)" : "rgba(196,87,58,0.3)",
        bgcolor: isCorrect ? "rgba(91,138,114,0.08)" : "rgba(196,87,58,0.08)",
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 700,
            bgcolor: `${color}.main`,
            color: `${color}.contrastText`,
            mt: 0.25,
          }}
        >
          {isCorrect ? "+" : "-"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
            {text}
          </Typography>
          <Link
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: `${color}.main`,
            }}
          >
            <ExternalLink size={12} />
            {sourceLabel}
          </Link>
        </Box>
      </Stack>
    </Paper>
  );
}
