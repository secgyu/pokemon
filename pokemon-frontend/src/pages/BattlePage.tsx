import { useState, useCallback } from "react";
import { Swords, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PokemonMove } from "@/data/pokemon";
import type { TrainerData } from "@/data/trainers";
import { RANK_LABELS, RANK_COLORS } from "@/data/trainers";
import { LoadingScreen } from "@/components/common";
import { BattlePanel } from "@/components/battle/BattlePanel";
import { MoveGrid } from "@/components/battle/MoveGrid";
import { BattleLogPanel } from "@/components/battle/BattleLogPanel";
import { TrainerSelect } from "@/components/battle/TrainerSelect";
import { usePokemonList } from "@/hooks/usePokemonList";
import { fetchPokemonDetail } from "@/lib/pokeapi";
import {
  type BattleLog,
  type BattlerState,
  type TrainerBattleState,
  ensureMoves,
  calculateDamage,
  pickRandomIds,
  buildTrainerBattleState,
  getActiveBattler,
  nextAlivePokemonIndex,
} from "@/lib/battle";

type Phase = "select" | "battle";

export function BattlePage() {
  const { pokemon: allPokemon, loading: listLoading } = usePokemonList();

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerData | null>(null);
  const [player, setPlayer] = useState<BattlerState | null>(null);
  const [enemyState, setEnemyState] = useState<TrainerBattleState | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [battleOver, setBattleOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = useCallback((log: BattleLog) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  const startBattle = useCallback(
    async (trainer: TrainerData) => {
      if (allPokemon.length === 0) return;
      setSelectedTrainer(trainer);
      setDetailLoading(true);
      setBattleOver(false);
      setPlayer(null);
      setEnemyState(null);
      setLogs([]);

      try {
        const pool = allPokemon.map((p) => p.id);
        const [playerId] = pickRandomIds(pool, 1);

        const uniqueEnemyIds = [...new Set(trainer.pokemonIds)];
        const [playerDetail, ...enemyDetails] = await Promise.all([
          fetchPokemonDetail(playerId),
          ...uniqueEnemyIds.map((id) => fetchPokemonDetail(id)),
        ]);

        const enemyDetailMap = new Map(uniqueEnemyIds.map((id, i) => [id, enemyDetails[i]]));
        const orderedEnemyDetails = trainer.pokemonIds.map((id) => enemyDetailMap.get(id)!);

        const pSafe = ensureMoves(playerDetail);
        const trainerState = buildTrainerBattleState(trainer, orderedEnemyDetails);
        const firstEnemy = trainerState.team[0].pokemon;

        setPlayer({ pokemon: pSafe, currentHp: pSafe.stats.hp });
        setEnemyState(trainerState);
        setPhase("battle");
        setLogs([
          { text: `${trainer.nameKo}: "${trainer.quote}"`, type: "info" },
          { text: `${RANK_LABELS[trainer.rank]} ${trainer.nameKo}이(가) 승부를 걸어왔다!`, type: "info" },
          { text: `${trainer.nameKo}은(는) ${firstEnemy.nameKo}을(를) 내보냈다!`, type: "action" },
          { text: `가라, ${pSafe.nameKo}!`, type: "action" },
        ]);
      } catch {
        setLogs([{ text: "포켓몬 데이터를 불러오지 못했습니다. 다시 시도해주세요.", type: "info" }]);
        setPhase("select");
      } finally {
        setDetailLoading(false);
      }
    },
    [allPokemon],
  );

  const updateEnemyHp = (state: TrainerBattleState, newHp: number): TrainerBattleState => ({
    ...state,
    team: state.team.map((b, i) => (i === state.activeIndex ? { ...b, currentHp: newHp } : b)),
  });

  const handleMove = async (move: PokemonMove) => {
    if (battleOver || isAnimating || !player || !enemyState) return;
    setIsAnimating(true);

    let currentEnemyState = enemyState;
    const activeEnemy = getActiveBattler(currentEnemyState);

    // -- 플레이어 턴 --
    const playerHit = Math.random() * 100 <= move.accuracy;
    addLog({ text: `${player.pokemon.nameKo}의 ${move.name}!`, type: "action" });
    await delay(400);

    if (playerHit) {
      const dmg = calculateDamage(player.pokemon, activeEnemy.pokemon, move);
      const newHp = Math.max(0, activeEnemy.currentHp - dmg);
      addLog({ text: `상대에게 ${dmg}의 데미지!`, type: "damage" });

      currentEnemyState = updateEnemyHp(currentEnemyState, newHp);
      setEnemyState(currentEnemyState);

      if (newHp <= 0) {
        await delay(500);
        addLog({ text: `상대의 ${activeEnemy.pokemon.nameKo}은(는) 쓰러졌다!`, type: "result" });

        const nextIdx = nextAlivePokemonIndex(currentEnemyState);
        if (nextIdx === -1) {
          await delay(400);
          addLog({ text: `${currentEnemyState.trainer.nameKo}의 포켓몬이 전부 쓰러졌다!`, type: "result" });
          addLog({ text: "승리!", type: "result" });
          if (currentEnemyState.trainer.badgeName) {
            addLog({ text: `${currentEnemyState.trainer.badgeName}을(를) 획득했다!`, type: "result" });
          }
          setBattleOver(true);
          setIsAnimating(false);
          return;
        }

        await delay(600);
        const nextPokemon = currentEnemyState.team[nextIdx].pokemon;
        addLog({
          text: `${currentEnemyState.trainer.nameKo}은(는) ${nextPokemon.nameKo}을(를) 내보냈다!`,
          type: "action",
        });
        currentEnemyState = { ...currentEnemyState, activeIndex: nextIdx };
        setEnemyState(currentEnemyState);
        setIsAnimating(false);
        return;
      }
    } else {
      addLog({ text: "공격이 빗나갔다!", type: "info" });
    }

    // -- 상대 턴 --
    await delay(600);
    const enemyNow = getActiveBattler(currentEnemyState);
    const enemyMove = enemyNow.pokemon.moves[Math.floor(Math.random() * enemyNow.pokemon.moves.length)];
    const enemyHit = Math.random() * 100 <= enemyMove.accuracy;

    addLog({ text: `상대 ${enemyNow.pokemon.nameKo}의 ${enemyMove.name}!`, type: "action" });
    await delay(400);

    if (enemyHit) {
      const eDmg = calculateDamage(enemyNow.pokemon, player.pokemon, enemyMove);
      const newPlayerHp = Math.max(0, player.currentHp - eDmg);
      addLog({ text: `${eDmg}의 데미지를 받았다!`, type: "damage" });
      setPlayer((prev) => prev && { ...prev, currentHp: newPlayerHp });

      if (newPlayerHp <= 0) {
        await delay(500);
        addLog({ text: `${player.pokemon.nameKo}은(는) 쓰러졌다...`, type: "result" });
        addLog({ text: "패배...", type: "result" });
        setBattleOver(true);
      }
    } else {
      addLog({ text: "상대의 공격이 빗나갔다!", type: "info" });
    }

    setIsAnimating(false);
  };

  const goBack = () => {
    setPhase("select");
    setSelectedTrainer(null);
    setPlayer(null);
    setEnemyState(null);
    setLogs([]);
    setBattleOver(false);
  };

  if (listLoading) {
    return <LoadingScreen message="포켓몬 목록 불러오는 중..." />;
  }

  if (phase === "select") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-pixel text-lg text-foreground sm:text-xl">Battle</h1>
          <p className="mt-1 text-sm text-secondary-custom">체육관 관장, 사천왕, 챔피언에게 도전하세요!</p>
        </div>
        <TrainerSelect onSelect={startBattle} />
      </div>
    );
  }

  if (detailLoading || !player || !enemyState) {
    return <LoadingScreen message="배틀 준비중..." />;
  }

  const currentEnemy = getActiveBattler(enemyState);
  const enemyRemaining = enemyState.team.filter((b) => b.currentHp > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={goBack}
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
          {selectedTrainer && (
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: RANK_COLORS[selectedTrainer.rank] }}
              >
                {RANK_LABELS[selectedTrainer.rank]}
              </span>
              <span className="font-pixel text-sm text-foreground">{selectedTrainer.nameKo}</span>
            </div>
          )}
        </div>
        <Button
          onClick={() => selectedTrainer && startBattle(selectedTrainer)}
          variant="outline"
          size="sm"
          className="gap-2 border-border text-foreground hover:bg-secondary cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          재도전
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Swords className="h-4 w-4 text-primary" />
              <span>VS</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <BattlePanel battler={player} isPlayer />
              <BattlePanel
                battler={currentEnemy}
                isPlayer={false}
                trainer={enemyState.trainer}
                teamSize={enemyState.team.length}
                remaining={enemyRemaining}
              />
            </div>
            <MoveGrid moves={player.pokemon.moves} disabled={battleOver || isAnimating} onSelect={handleMove} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <BattleLogPanel logs={logs} />
        </div>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
