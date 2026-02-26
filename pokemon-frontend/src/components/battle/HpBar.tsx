interface HpBarProps {
  current: number;
  max: number;
}

export function HpBar({ current, max }: HpBarProps) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? "#7AC74C" : pct > 20 ? "#f5c518" : "#cc0000";

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-semibold text-foreground">HP</span>
        <span className="tabular-nums text-muted-foreground">
          {Math.max(0, current)} / {max}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.max(0, current)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`HP ${Math.max(0, current)} / ${max}`}
        className="h-2.5 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
