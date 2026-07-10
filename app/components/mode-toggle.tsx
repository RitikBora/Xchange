"use client";

import { flushSync } from "react-dom";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";

type DocumentWithViewTransitions = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    ready: Promise<void>;
  };
};

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  // Server always renders the "light" icon state (ThemeProvider's SSR default).
  // Stay pinned to that until after mount so hydration has nothing to mismatch,
  // then swap to the real (possibly localStorage-persisted) theme.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark";
    const doc = document as DocumentWithViewTransitions;

    if (!doc.startViewTransition) {
      setTheme(next);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle theme"
      style={{
        width: 38,
        height: 38,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9,
        border: "1px solid var(--border-hairline)",
        background: "var(--surface-card)",
        color: "var(--text-med-emphasis)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "color .15s var(--ease-in-out), border-color .15s var(--ease-in-out)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--accent)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--text-med-emphasis)";
        e.currentTarget.style.borderColor = "var(--border-hairline)";
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          transition: "transform .35s var(--ease-out), opacity .35s var(--ease-out)",
          transform: isDark ? "scale(0.4) rotate(-90deg)" : "scale(1) rotate(0deg)",
          opacity: isDark ? 0 : 1,
        }}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          transition: "transform .35s var(--ease-out), opacity .35s var(--ease-out)",
          transform: isDark ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(90deg)",
          opacity: isDark ? 1 : 0,
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
