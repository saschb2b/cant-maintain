"use client";

import { useState } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as LinkIcon, Check } from "lucide-react";

interface ChallengeAnchorProps {
  id: string;
  title: string;
}

export function ChallengeAnchor({ id, title }: ChallengeAnchorProps) {
  const [copied, setCopied] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      window.history.replaceState(null, "", `#${id}`);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <Link
      href={`#${id}`}
      underline="none"
      color="inherit"
      onClick={handleClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        position: "relative",
        "& .anchor-icon": { opacity: 0, transition: "opacity 0.15s" },
        "&:hover .anchor-icon": { opacity: 0.5 },
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} component="span">
        {title}
      </Typography>
      {copied ? (
        <Check size={14} color="#5B8A72" strokeWidth={2.5} />
      ) : (
        <LinkIcon className="anchor-icon" size={14} />
      )}
    </Link>
  );
}
