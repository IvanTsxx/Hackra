"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  title?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, title }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft(targetDate));
  }, [targetDate]);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, mounted]);

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col items-center">
        {title && (
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-brand-purple" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HRS", value: timeLeft.hours },
            { label: "MIN", value: timeLeft.minutes },
            { label: "SEC", value: timeLeft.seconds },
          ].map((item, index) => (
            <div key={item.label} className="flex items-center">
              <div
                className={`glass border p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] text-center ${
                  isUrgent
                    ? "border-brand-purple/50 bg-brand-purple/5"
                    : "border-border/40"
                }`}
              >
                <p
                  className={`text-lg sm:text-2xl font-bold ${
                    isUrgent ? "text-brand-purple" : "text-brand-green"
                  }`}
                >
                  {String(item.value).padStart(2, "0")}
                </p>
                <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
              {index < 3 && (
                <span
                  className={`text-lg sm:text-2xl mx-0.5 sm:mx-1 ${
                    isUrgent ? "text-brand-purple" : "text-muted-foreground"
                  }`}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
