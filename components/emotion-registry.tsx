"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

/**
 * Emotion cache registry for Next.js App Router SSR.
 *
 * Collects styles inserted during server rendering and flushes them
 * into `<style>` tags via `useServerInsertedHTML`, preventing
 * hydration mismatches between server and client HTML.
 */
export function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: "mui" });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) return null;

    let styles = "";
    const dataEmotionAttribute = cache.key;

    const flushedNames: string[] = [];
    for (const name of names) {
      const value = cache.inserted[name];
      if (typeof value === "string") {
        flushedNames.push(name);
        styles += value;
      }
    }

    if (styles === "") return null;

    return (
      <style
        key={dataEmotionAttribute}
        data-emotion={`${dataEmotionAttribute} ${flushedNames.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
