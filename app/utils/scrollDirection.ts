"use client";

let direction: "up" | "down" = "down";
let lastY = 0;
let initialized = false;

function init() {
    if (initialized || typeof window === "undefined") return;
    initialized = true;
    lastY = window.scrollY;
    window.addEventListener(
        "scroll",
        () => {
            const y = window.scrollY;
            if (y > lastY) direction = "down";
            else if (y < lastY) direction = "up";
            lastY = y;
        },
        { passive: true }
    );
}

export function getScrollDirection(): "up" | "down" {
    init();
    return direction;
}
