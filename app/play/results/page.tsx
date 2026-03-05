import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { decodeResults, getRank } from "@/lib/game/share";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const r = typeof params.r === "string" ? params.r : undefined;
  const decoded = r ? decodeResults(r) : null;

  if (!decoded) {
    return { title: "Results | Can't Maintain" };
  }

  const { score, total } = decoded;
  const percentage = Math.round((score / total) * 100);
  const rank = getRank(percentage);

  return {
    title: `${rank} - ${String(score)}/${String(total)} | Can't Maintain`,
    description: `Scored ${String(score)}/${String(total)} on spotting better React prop naming. Can you beat this score?`,
  };
}

/** Redirects visitors to the game while preserving metadata for crawlers. */
export default async function ResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!params.r) {
    redirect("/play");
  }

  redirect("/play");
}
