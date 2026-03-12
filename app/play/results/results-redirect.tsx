"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ResultsRedirectProps {
  seed?: string;
}

export function ResultsRedirect({ seed }: ResultsRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(seed ? `/play?seed=${seed}` : "/play");
  }, [router, seed]);

  return null;
}
