"use client";

import { useState } from "react";

type ButtonVariant = "primary" | "success" | "buy" | "sell" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    style?: React.CSSProperties;
    className?: string;
};

const SIZES: Record<ButtonSize, React.CSSProperties> = {
    sm: { height: 36, padding: "0 14px", fontSize: "var(--fs-sm)" },
    md: { height: "var(--h-button)", padding: "0 20px", fontSize: "var(--fs-base)" },
    lg: { height: "var(--h-button-lg)", padding: "0 28px", fontSize: "1.3rem" },
};

const TRANSLUCENT: Record<string, { fill: string; text: string }> = {
    primary: { fill: "var(--accent-active)", text: "var(--accent-active)" },
    success: { fill: "var(--buy)", text: "var(--buy)" },
};

const SOLID: Record<string, { bg: string; text: string }> = {
    buy: { bg: "var(--buy-solid)", text: "var(--buy-solid-text)" },
    sell: { bg: "var(--sell-solid)", text: "var(--sell-solid-text)" },
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    onClick,
    type = "button",
    style,
    className,
}: ButtonProps) {
    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);

    const base: React.CSSProperties = {
        position: "relative",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: fullWidth ? "100%" : "auto",
        borderRadius: variant === "buy" || variant === "sell" ? "var(--radius-xl)" : "var(--radius-lg)",
        border: "none",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-semibold)",
        lineHeight: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity var(--dur-fast) var(--ease-in-out), transform var(--dur-fast) var(--ease-in-out)",
        transform: pressed ? "scale(var(--press-scale))" : "scale(1)",
        ...SIZES[size],
        ...style,
    };

    if (variant === "buy" || variant === "sell") {
        const s = SOLID[variant];
        return (
            <button
                type={type}
                disabled={disabled}
                onClick={onClick}
                className={className}
                style={{ ...base, background: s.bg, color: s.text, opacity: disabled ? 0.5 : 1 }}
                onMouseDown={() => !disabled && setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onMouseLeave={() => setPressed(false)}
            >
                {children}
            </button>
        );
    }

    if (variant === "ghost") {
        return (
            <button
                type={type}
                disabled={disabled}
                onClick={onClick}
                className={className}
                style={{
                    ...base,
                    background: "transparent",
                    color: hovered && !disabled ? "var(--text-high-emphasis)" : "var(--text-med-emphasis)",
                    opacity: disabled ? 0.5 : 1,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {children}
            </button>
        );
    }

    const t = TRANSLUCENT[variant] || TRANSLUCENT.primary;
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={className}
            style={{
                ...base,
                background: "transparent",
                color: t.text,
                opacity: disabled ? 0.5 : hovered ? 0.9 : 1,
            }}
            onMouseEnter={() => !disabled && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span style={{ position: "absolute", inset: 0, background: t.fill, opacity: 0.16 }} />
            <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8 }}>
                {children}
            </span>
        </button>
    );
}
