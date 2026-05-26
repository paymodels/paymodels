'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const avatarPool = [
    { seed: 'Alex', fallback: '张' },
    { seed: 'Bella', fallback: '李' },
    { seed: 'Charlie', fallback: '王' },
    { seed: 'Diana', fallback: '赵' },
    { seed: 'Ethan', fallback: '陈' },
    { seed: 'Fiona', fallback: '刘' },
    { seed: 'George', fallback: '黄' },
    { seed: 'Hannah', fallback: '周' },
    { seed: 'Ivan', fallback: '吴' },
    { seed: 'Julia', fallback: '林' },
];

const apiBase = 'https://api.dicebear.com/9.x/notionists/svg?backgroundColor=c0aede';
const count = 3;
const avatarSize = 32;
const overlap = 12;
const step = avatarSize - overlap;
const interval = 2500;

export default function SocialProof() {
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState<(typeof avatarPool)[0] | null>(null);
    const timerRef = useRef<number | null>(null);
    const leavingTimerRef = useRef<number | null>(null);

    const advance = useCallback(() => {
        const oldLeaving = avatarPool[index % avatarPool.length];
        setLeaving(oldLeaving);
        setIndex((prev) => (prev + 1) % avatarPool.length);

        if (leavingTimerRef.current !== null) clearTimeout(leavingTimerRef.current);
        leavingTimerRef.current = window.setTimeout(() => {
            setLeaving(null);
        }, 450);
    }, [index]);

    useEffect(() => {
        timerRef.current = window.setInterval(advance, interval);
        return () => {
            if (timerRef.current !== null) clearInterval(timerRef.current);
            if (leavingTimerRef.current !== null) clearTimeout(leavingTimerRef.current);
        };
    }, [advance]);

    const containerWidth = avatarSize + (count - 1) * step;

    const avatars: Array<{
        seed: string;
        fallback: string;
        position: number;
        isLeaving: boolean;
        isEntering: boolean;
        key: string;
    }> = [];

    if (leaving) {
        avatars.push({
            ...leaving,
            position: -1,
            isLeaving: true,
            isEntering: false,
            key: `leave-${leaving.seed}`,
        });
    }

    for (let i = 0; i < count; i++) {
        const poolIndex = (index + i) % avatarPool.length;
        const user = avatarPool[poolIndex];
        avatars.push({
            ...user,
            position: i,
            isLeaving: false,
            isEntering: !!(leaving && i === count - 1),
            key: `${poolIndex}-${user.seed}`,
        });
    }

    return (
        <div className="mt-10 flex items-center justify-center gap-3">
            <div
                className="relative overflow-hidden"
                style={{ width: containerWidth, height: avatarSize }}
            >
                {avatars.map((item) => (
                    <Avatar
                        key={item.key}
                        className="absolute top-0 size-8 border-2 border-background ring-2 ring-background transition-all duration-500 ease-out"
                        style={{
                            left: item.position * step,
                            opacity: item.isLeaving ? 0 : 1,
                            zIndex: item.isLeaving ? 0 : item.position + 1,
                        }}
                    >
                        <AvatarImage src={`${apiBase}&seed=${item.seed}`} alt={item.seed} />
                        <AvatarFallback className="text-xs">{item.fallback}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">
                已帮助 <span className="font-semibold text-foreground">10万+</span> 位用户完成充值
            </p>
        </div>
    );
}
