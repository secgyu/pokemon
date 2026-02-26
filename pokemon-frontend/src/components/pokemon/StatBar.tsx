import { useEffect, useRef, useState } from "react";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
}

function getStatColor(value: number): string {
  if (value <= 45) return "#cc0000";
  if (value <= 90) return "#f5c518";
  return "#7AC74C";
}

export function StatBar({ label, value, max = 255 }: StatBarProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const percentage = Math.min((value / max) * 100, 100);
  const color = getStatColor(value);

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="w-12 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="w-8 text-right text-sm font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <div className="flex-1 h-2 rounded-full bg-[#2a2a4a] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${animated ? "animate-stat-fill" : ""}`}
          style={{
            width: animated ? `${percentage}%` : "0%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
