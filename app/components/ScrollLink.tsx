'use client';

import { type ReactNode } from 'react';

export default function ScrollLink({
    target,
    children,
    className,
}: {
    target: string;
    children: ReactNode;
    className?: string;
}) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a href={target} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
