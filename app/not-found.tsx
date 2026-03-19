"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("404-visited", { path: pathname });
    router.replace("/");
  }, [router, pathname]);

  return null;
}
