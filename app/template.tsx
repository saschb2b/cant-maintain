"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export default function Template({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Inject view transition styles once
    const id = "view-transition-styles";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @media (prefers-reduced-motion: no-preference) {
        ::view-transition-old(root) {
          animation: fade-out 0.15s ease-in forwards;
        }
        ::view-transition-new(root) {
          animation: fade-in 0.2s ease-out;
        }

        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      }

      @media (prefers-reduced-motion: reduce) {
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return <>{children}</>;
}
