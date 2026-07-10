"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./core/Button";
import { ModeToggle } from "./mode-toggle";

const navLinks = [
    { href: "/markets", label: "Markets" },
    { href: "/#features", label: "Features" },
    { href: "/#faq", label: "FAQ" },
];

export const Appbar = () => {
    const router = useRouter();
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "color-mix(in srgb, var(--bg-base) 82%, transparent)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: "1px solid var(--border-hairline)",
            }}
        >
            <nav
                style={{
                    width: "100%",
                    padding: "0 var(--lp-pad, 88px)",
                    height: 68,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                }}
            >
                <Link
                    href="/"
                    style={{
                        fontSize: "1.45rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span style={{ color: "#16A34A" }}>X</span>
                    <span style={{ color: "var(--text-high-emphasis)" }}>change</span>
                </Link>
                <div style={{ display: "var(--lp-navlinks)", alignItems: "center", gap: 6 }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onMouseEnter={() => setHoveredLink(link.href)}
                            onMouseLeave={() => setHoveredLink(null)}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 8,
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: hoveredLink === link.href ? "var(--text-high-emphasis)" : "var(--text-med-emphasis)",
                                background: hoveredLink === link.href ? "var(--surface-elevated)" : "transparent",
                                transition: "color .15s var(--ease-in-out), background .15s var(--ease-in-out)",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <ModeToggle />
                    <Button variant="success" size="sm" onClick={() => router.push("/markets")}>
                        Explore
                    </Button>
                </div>
            </nav>
        </header>
    );
};
