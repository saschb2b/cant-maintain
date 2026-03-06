export interface ChangelogEntry {
  version: string;
  date: string;
  sections: { type: string; items: string[] }[];
}

export function parseChangelog(markdown: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  let current: ChangelogEntry | null = null;
  let currentSection: { type: string; items: string[] } | null = null;

  for (const line of markdown.split("\n")) {
    // Version header: ## [0.7.0] - 2026-03-06
    const versionMatch = /^## \[([^\]]+)\]\s*-\s*(.+)$/.exec(line);
    if (versionMatch?.[1] && versionMatch[2]) {
      if (current) entries.push(current);
      current = {
        version: versionMatch[1],
        date: versionMatch[2].trim(),
        sections: [],
      };
      currentSection = null;
      continue;
    }

    // Section header: ### Added
    const sectionMatch = /^### (.+)$/.exec(line);
    if (sectionMatch?.[1] && current) {
      currentSection = { type: sectionMatch[1], items: [] };
      current.sections.push(currentSection);
      continue;
    }

    // Top-level list item: - Something
    const itemMatch = /^- (.+)$/.exec(line);
    if (itemMatch?.[1] && currentSection) {
      currentSection.items.push(itemMatch[1]);
      continue;
    }

    // Sub-item:   - **Name** — description (append to last item)
    const subItemMatch = /^ {2}- (.+)$/.exec(line);
    if (
      subItemMatch?.[1] &&
      currentSection &&
      currentSection.items.length > 0
    ) {
      currentSection.items.push("  " + subItemMatch[1]);
    }
  }

  if (current) entries.push(current);
  return entries;
}
