import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BattleLog } from "@/lib/battle";

const LOG_STYLE: Record<BattleLog["type"], string> = {
  action: "text-foreground",
  damage: "text-[#cc0000] font-semibold",
  result: "text-primary font-bold",
  info: "text-muted-foreground",
};

interface BattleLogPanelProps {
  logs: BattleLog[];
}

export function BattleLogPanel({ logs }: BattleLogPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Battle Log</h3>
      </div>
      <ScrollArea className="h-[400px] p-3">
        <div aria-live="polite" className="space-y-1.5 font-mono text-xs">
          {logs.map((log, i) => (
            <p key={i} className={LOG_STYLE[log.type]}>
              {log.text}
            </p>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
