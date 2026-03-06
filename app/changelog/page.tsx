import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { parseChangelog } from "@/lib/parse-changelog";
import { changelog } from "@/lib/changelog-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Can't Maintain",
  description:
    "See what's new in Can't Maintain — new challenges, features, and improvements.",
};

const sectionConfig: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  Added: { label: "Added", color: "#0284c7", bg: "rgba(43,76,126,0.08)", dot: "#a7d8ff" },
  Changed: { label: "Changed", color: "#9F6625", bg: "rgba(159,102,37,0.08)", dot: "#ffe7a3" },
  Fixed: { label: "Fixed", color: "#15803d", bg: "rgba(74,122,98,0.08)", dot: "#bfebd6" },
  Improved: { label: "Improved", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", dot: "#ddd6fe" },
};

function getSectionStyle(type: string) {
  return (
    sectionConfig[type] ?? {
      label: type,
      color: "#536476",
      bg: "rgba(83,100,118,0.08)",
      dot: "#cbd5e1",
    }
  );
}

/** Render inline markdown (bold + code) */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return (
        <Box key={i} component="span" sx={{ fontWeight: 700 }}>
          {boldMatch[1]}
        </Box>
      );
    }
    const codeMatch = part.match(/^`(.+)`$/);
    if (codeMatch) {
      return (
        <Box
          key={i}
          component="code"
          sx={{
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            bgcolor: "rgba(0,0,0,0.05)",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.85em",
          }}
        >
          {codeMatch[1]}
        </Box>
      );
    }
    return part;
  });
}

export default function ChangelogPage() {
  const entries = parseChangelog(changelog);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        {/* Page header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" }, mb: 1 }}
          >
            Changelog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            New challenges, features, and improvements.
          </Typography>
        </Box>

        {/* Timeline */}
        <Timeline
          position="right"
          sx={{
            p: 0,
            // hide the opposite-content gutter
            "& .MuiTimelineItem-root::before": { display: "none" },
          }}
        >
          {entries.map((entry, idx) => {
            const isLatest = idx === 0;
            const isLast = idx === entries.length - 1;
            return (
              <TimelineItem key={entry.version}>
                <TimelineSeparator>
                  <TimelineDot
                    color={isLatest ? "primary" : undefined}
                    variant={isLatest ? "filled" : "outlined"}
                    sx={isLatest ? undefined : { borderColor: "divider" }}
                  />
                  {!isLast && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: { xs: 4, md: 5 } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      border: 1,
                      borderColor: isLatest ? "primary.main" : "divider",
                    }}
                  >
                    {/* Version + date header */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Chip
                        label={`v${entry.version}`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          bgcolor: isLatest
                            ? "rgba(var(--mui-palette-primary-mainChannel) / 0.1)"
                            : "rgba(0,0,0,0.04)",
                          color: isLatest ? "primary.main" : "text.secondary",
                          border: 1,
                          borderColor: isLatest
                            ? "rgba(var(--mui-palette-primary-mainChannel) / 0.25)"
                            : "divider",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                        sx={{
                          fontFamily: "var(--font-geist-mono), monospace",
                        }}
                      >
                        {entry.date}
                      </Typography>
                      {isLatest && (
                        <Chip
                          label="Latest"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                          }}
                        />
                      )}
                    </Stack>

                    {/* Sections */}
                    <Stack spacing={2.5}>
                      {entry.sections.map((section) => {
                        const style = getSectionStyle(section.type);
                        return (
                          <Box key={section.type}>
                            {/* Section label */}
                            <Chip
                              label={style.label}
                              size="small"
                              variant="outlined"
                              sx={{
                                mb: 1.5,
                                height: 24,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: style.color,
                                bgcolor: style.bg,
                                borderColor: style.dot,
                              }}
                            />

                            {/* Items */}
                            <Stack spacing={0.75}>
                              {section.items.map((item, itemIdx) => {
                                const isSub = item.startsWith("  ");
                                const text = isSub ? item.slice(2) : item;
                                return (
                                  <Box
                                    key={itemIdx}
                                    sx={{
                                      display: "flex",
                                      gap: 1.5,
                                      pl: isSub ? 3 : 0,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        mt: "8px",
                                        width: isSub ? 5 : 7,
                                        height: isSub ? 5 : 7,
                                        borderRadius: "50%",
                                        bgcolor: style.dot,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        lineHeight: 1.6,
                                        color: "text.primary",
                                        fontWeight: isSub ? 400 : 500,
                                      }}
                                    >
                                      {renderInline(text)}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Container>

      <SiteFooter />
    </Box>
  );
}
