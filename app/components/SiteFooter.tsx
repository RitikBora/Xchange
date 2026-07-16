interface SocialLinkProps {
  href: string;
  label: string;
  /** Tailwind hover text-color class carrying the platform's brand color. */
  hoverColor: string;
  children: React.ReactNode;
}

function SocialLink({ href, label, hoverColor, children }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex size-9 items-center justify-center rounded-md text-[var(--text-low-emphasis)] transition-colors ${hoverColor}`}
    >
      {children}
    </a>
  );
}

// Brand SVGs sourced from simpleicons.org (CC0 / public domain) — inlined so
// they pick up currentColor and stay theme-aware.
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export function SiteFooter() {
  return (
    <footer
      className="w-full"
      style={{ borderTop: "1px solid var(--border-hairline)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-[var(--text-med-emphasis)]">
          <span className="inline-flex items-center gap-1.5">
            Made with <span className="text-[var(--accent)]"><HeartIcon /></span> by Ritik
          </span>
          <span aria-hidden className="text-[var(--text-low-emphasis)]">·</span>
          <a
            href="https://buymeacoffee.com/ritikbora"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee"
            className="inline-flex items-center transition-transform duration-200 hover:rotate-12"
          >
            <img src="/coffee.png" alt="" width={18} height={18} className="size-[18px]" />
          </a>
        </div>
        <div className="flex items-center gap-1">
          <SocialLink href="https://www.linkedin.com/in/ritikbora/" label="LinkedIn" hoverColor="hover:text-[#0A66C2]">
            <LinkedinIcon />
          </SocialLink>
          <SocialLink href="https://twitter.com/RitikBora11" label="Twitter / X" hoverColor="hover:text-[var(--text-high-emphasis)]">
            <TwitterIcon />
          </SocialLink>
          <SocialLink href="https://github.com/RitikBora" label="GitHub" hoverColor="hover:text-[var(--text-high-emphasis)]">
            <GithubIcon />
          </SocialLink>
          <SocialLink href="https://ritikbora.dev" label="Website" hoverColor="hover:text-[var(--accent)]">
            <GlobeIcon />
          </SocialLink>
        </div>
      </div>
    </footer>
  );
}
