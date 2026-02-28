import { FolderOpen, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeamResult } from "@/lib/api";

interface SavedTeamsListProps {
  teams: TeamResult[];
  loading: boolean;
  onLoad: (team: TeamResult) => void;
  onDelete: (id: string) => void;
}

export function SavedTeamsList({ teams, loading, onLoad, onDelete }: SavedTeamsListProps) {
  if (loading) {
    return <p className="py-4 text-center text-xs text-muted-foreground">저장된 팀 로딩중...</p>;
  }

  if (teams.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
        <FolderOpen className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">저장된 팀이 없습니다</p>
        <p className="text-xs text-muted-foreground">팀을 구성하고 저장해보세요!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <FolderOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">저장된 팀</h3>
        <span className="ml-auto text-xs text-muted-foreground">{teams.length}개</span>
      </div>
      <div className="divide-y divide-border">
        {teams.map((team) => (
          <div key={team.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{team.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {team.pokemonIds.length}마리 · {new Date(team.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </div>
            <Button variant="ghost" size="icon-xs" onClick={() => onLoad(team)} title="불러오기">
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => onDelete(team.id)} title="삭제">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
