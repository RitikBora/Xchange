"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export const CountUp = ({
    target,
    decimals = 0,
    prefix = "",
    suffix = "",
    className,
    style,
}: {
    target: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    style?: React.CSSProperties;
}) => {
    const [value, setValue] = useState(0);
    const started = useRef(false);

    const start = () => {
        if (started.current) return;
        started.current = true;
        const dur = 1500;
        const t0 = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const step = (now: number) => {
            const p = Math.min(1, (now - t0) / dur);
            setValue(target * ease(p));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    return (
        <motion.div
            className={className}
            style={style}
            onViewportEnter={start}
            viewport={{ once: true, amount: 0.6 }}
        >
            {prefix}{value.toFixed(decimals)}{suffix}
        </motion.div>
    );
};
