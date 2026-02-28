import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { type RankingEntry, apiQuizRankings } from "@/lib/api";

export function QuizRankings() {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiQuizRankings(10)
      .then(setRankings)
      .catch(() => setRankings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="py-4 text-center text-xs text-muted-foreground">랭킹 로딩중...</p>;
  }

  if (rankings.length === 0) {
    return <p className="py-4 text-center text-xs text-muted-foreground">아직 기록이 없습니다</p>;
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">랭킹 보드</h3>
      </div>
      <div className="divide-y divide-border">
        {rankings.map((entry) => (
          <div key={entry.rank} className="flex items-center gap-3 px-4 py-2.5">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                entry.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {entry.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{entry.nickname}</p>
              <p className="text-[10px] text-muted-foreground">{entry.totalGames}게임</p>
            </div>
            <p className="text-sm font-bold tabular-nums text-primary">{entry.bestScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
