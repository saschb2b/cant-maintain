"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ResultsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/play");
  }, [router]);

  return null;
}
