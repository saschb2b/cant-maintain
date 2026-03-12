import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
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

const sectionColors: Record<
  string,
  "info" | "warning" | "success" | "primary"
> = {
  Added: "info",
  Changed: "warning",
  Fixed: "success",
  Improved: "primary",
};

function getSectionColor(type: string) {
  return sectionColors[type] ?? "primary";
}

/** Render inline markdown (bold + code) */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const boldMatch = /^\*\*(.+)\*\*$/.exec(part);
    if (boldMatch) {
      return (
        <Box key={i} component="span" fontWeight={700}>
          {boldMatch[1]}
        </Box>
      );
    }
    const codeMatch = /^`(.+)`$/.exec(part);
    if (codeMatch) {
      return (
        <Typography
          key={i}
          component="code"
          variant="body2"
          sx={{
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            bgcolor: "action.hover",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.85em",
          }}
        >
          {codeMatch[1]}
        </Typography>
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
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Changelog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            New challenges, features, and improvements.
          </Typography>
        </Box>

        <Timeline
          position="right"
          sx={{
            p: 0,
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
                    color={isLatest ? "primary" : "grey"}
                    variant={isLatest ? "filled" : "outlined"}
                  />
                  {!isLast && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: { xs: 4, md: 5 } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: isLatest ? "primary.main" : "divider",
                      overflow: "hidden",
                    }}
                  >
                    {/* Card header */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        px: { xs: 2, md: 3 },
                        py: 1,
                        bgcolor: "secondary.main",
                        borderBottom: 1,
                        borderColor: isLatest ? "primary.main" : "divider",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        fontFamily="var(--font-geist-mono), monospace"
                        sx={{ fontSize: "0.72rem" }}
                      >
                        v{entry.version}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontSize: "0.68rem" }}
                      >
                        {entry.date}
                      </Typography>
                      {isLatest && (
                        <Chip
                          label="Latest"
                          size="small"
                          color="primary"
                          sx={{
                            height: 18,
                            fontSize: "0.6rem",
                            ml: "auto",
                          }}
                        />
                      )}
                    </Stack>

                    {/* Card body */}
                    <Stack spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
                      {entry.sections.map((section) => {
                        const color = getSectionColor(section.type);
                        return (
                          <Box key={section.type}>
                            <Chip
                              label={section.type}
                              size="small"
                              color={color}
                              variant="outlined"
                              sx={{ mb: 1, height: 22, fontSize: "0.7rem" }}
                            />
                            <List dense disablePadding>
                              {section.items.map((item, itemIdx) => {
                                const isSub = item.startsWith("  ");
                                const text = isSub ? item.slice(2) : item;
                                return (
                                  <ListItem
                                    key={itemIdx}
                                    disableGutters
                                    disablePadding
                                    sx={{ pl: isSub ? 3 : 0, py: 0 }}
                                  >
                                    <ListItemText
                                      primary={renderInline(text)}
                                      slotProps={{
                                        primary: { variant: "body2" },
                                      }}
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
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
