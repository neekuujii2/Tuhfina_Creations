'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    expiryDate: Date;
    onExpire?: () => void;
}

export default function CountdownTimer({ expiryDate, onExpire }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(expiryDate).getTime() - new Date().getTime();

            if (difference <= 0) {
                setTimeLeft('EXPIRED');
                if (onExpire) onExpire();
                return;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiryDate, onExpire]);

    if (timeLeft === 'EXPIRED') return null;

    return (
        <div className="inline-flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold animate-pulse">
            <Clock size={12} />
            <span>Ends in {timeLeft}</span>
        </div>
    );
}
