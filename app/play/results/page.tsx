import type { Metadata } from "next";
import { decodeResults, getRank } from "@/lib/game/share";
import { ResultsRedirect } from "./results-redirect";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const r = typeof params.r === "string" ? params.r : undefined;
  const decoded = r ? decodeResults(r) : null;

  if (!decoded) {
    return { title: "Results | Can't Maintain" };
  }

  const { score, total } = decoded;
  const percentage = Math.round((score / total) * 100);
  const rank = getRank(percentage);

  const title = `${rank} — ${String(score)}/${String(total)} | Can't Maintain`;
  const description = `I scored ${String(score)}/${String(total)} on spotting better React component APIs. Can you beat my score? Train your eye for clean React component APIs in under 5 minutes.`;
  const ogImage = "https://cant-maintain.saschb2b.com/opengraph-image";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Can't Maintain",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Can't Maintain — React Component API Game",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Renders a minimal page so crawlers can read OG meta tags,
 * then redirects browsers to /play via client-side navigation.
 */
export default function ResultsPage() {
  return <ResultsRedirect />;
}
