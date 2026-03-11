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
import { TeamPicker } from "@/components/battle/TeamPicker";
import { SwapPanel } from "@/components/battle/SwapPanel";
import { usePokemonList } from "@/hooks/usePokemonList";
import { fetchPokemonDetail } from "@/lib/pokeapi";
import {
  type BattleLog,
  type TrainerBattleState,
  type PlayerBattleState,
  calculateDamage,
  buildTrainerBattleState,
  buildPlayerBattleState,
  getActiveBattler,
  nextAlivePokemonIndex,
  getAliveSwapOptions,
} from "@/lib/battle";

type Phase = "select" | "pick-team" | "battle";

export function BattlePage() {
  const { pokemon: allPokemon, loading: listLoading } = usePokemonList();

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerData | null>(null);
  const [playerState, setPlayerState] = useState<PlayerBattleState | null>(null);
  const [enemyState, setEnemyState] = useState<TrainerBattleState | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [battleOver, setBattleOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [forceSwap, setForceSwap] = useState(false);

  const addLog = useCallback((log: BattleLog) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  const handleTrainerSelect = (trainer: TrainerData) => {
    setSelectedTrainer(trainer);
    setPhase("pick-team");
  };

  const startBattle = useCallback(async (trainer: TrainerData, playerPokemonIds: number[]) => {
    setDetailLoading(true);
    setBattleOver(false);
    setForceSwap(false);
    setPlayerState(null);
    setEnemyState(null);
    setLogs([]);

    try {
      const uniqueEnemyIds = [...new Set(trainer.pokemonIds)];
      const uniquePlayerIds = [...new Set(playerPokemonIds)];

      const [playerDetails, enemyDetails] = await Promise.all([
        Promise.all(uniquePlayerIds.map((id) => fetchPokemonDetail(id))),
        Promise.all(uniqueEnemyIds.map((id) => fetchPokemonDetail(id))),
      ]);

      const playerDetailMap = new Map(uniquePlayerIds.map((id, i) => [id, playerDetails[i]]));
      const orderedPlayerDetails = playerPokemonIds.map((id) => playerDetailMap.get(id)!);

      const enemyDetailMap = new Map(uniqueEnemyIds.map((id, i) => [id, enemyDetails[i]]));
      const orderedEnemyDetails = trainer.pokemonIds.map((id) => enemyDetailMap.get(id)!);

      const pState = buildPlayerBattleState(orderedPlayerDetails);
      const eState = buildTrainerBattleState(trainer, orderedEnemyDetails);
      const firstPlayer = pState.team[0].pokemon;
      const firstEnemy = eState.team[0].pokemon;

      setPlayerState(pState);
      setEnemyState(eState);
      setPhase("battle");
      setLogs([
        { text: `${trainer.nameKo}: "${trainer.quote}"`, type: "info" },
        { text: `${RANK_LABELS[trainer.rank]} ${trainer.nameKo}이(가) 승부를 걸어왔다!`, type: "info" },
        { text: `${trainer.nameKo}은(는) ${firstEnemy.nameKo}을(를) 내보냈다!`, type: "action" },
        { text: `가라, ${firstPlayer.nameKo}!`, type: "action" },
      ]);
    } catch {
      setLogs([{ text: "포켓몬 데이터를 불러오지 못했습니다. 다시 시도해주세요.", type: "info" }]);
      setPhase("pick-team");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const updateEnemyHp = (state: TrainerBattleState, newHp: number): TrainerBattleState => ({
    ...state,
    team: state.team.map((b, i) => (i === state.activeIndex ? { ...b, currentHp: newHp } : b)),
  });

  const updatePlayerHp = (state: PlayerBattleState, newHp: number): PlayerBattleState => ({
    ...state,
    team: state.team.map((b, i) => (i === state.activeIndex ? { ...b, currentHp: newHp } : b)),
  });

  const doEnemyTurn = async (pState: PlayerBattleState, eState: TrainerBattleState) => {
    const enemyNow = getActiveBattler(eState);
    const playerNow = getActiveBattler(pState);
    const enemyMove = enemyNow.pokemon.moves[Math.floor(Math.random() * enemyNow.pokemon.moves.length)];
    const enemyHit = Math.random() * 100 <= enemyMove.accuracy;

    addLog({ text: `상대 ${enemyNow.pokemon.nameKo}의 ${enemyMove.name}!`, type: "action" });
    await delay(400);

    if (enemyHit) {
      const eDmg = calculateDamage(enemyNow.pokemon, playerNow.pokemon, enemyMove);
      const newPlayerHp = Math.max(0, playerNow.currentHp - eDmg);
      addLog({ text: `${eDmg}의 데미지를 받았다!`, type: "damage" });
      const updatedPState = updatePlayerHp(pState, newPlayerHp);
      setPlayerState(updatedPState);

      if (newPlayerHp <= 0) {
        await delay(500);
        addLog({ text: `${playerNow.pokemon.nameKo}은(는) 쓰러졌다...`, type: "result" });

        const nextIdx = nextAlivePokemonIndex(updatedPState);
        if (nextIdx === -1) {
          addLog({ text: "패배...", type: "result" });
          setBattleOver(true);
        } else {
          addLog({ text: "다른 포켓몬을 선택하세요!", type: "info" });
          setForceSwap(true);
        }
      }
    } else {
      addLog({ text: "상대의 공격이 빗나갔다!", type: "info" });
    }
  };

  const handleMove = async (move: PokemonMove) => {
    if (battleOver || isAnimating || !playerState || !enemyState || forceSwap) return;
    setIsAnimating(true);

    let currentEnemyState = enemyState;
    const activeEnemy = getActiveBattler(currentEnemyState);
    const activePlayer = getActiveBattler(playerState);

    addLog({ text: `${activePlayer.pokemon.nameKo}의 ${move.name}!`, type: "action" });
    await delay(400);

    const playerHit = Math.random() * 100 <= move.accuracy;
    if (playerHit) {
      const dmg = calculateDamage(activePlayer.pokemon, activeEnemy.pokemon, move);
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

    await delay(600);
    await doEnemyTurn(playerState, currentEnemyState);
    setIsAnimating(false);
  };

  const handleSwap = async (targetIndex: number) => {
    if (battleOver || (!forceSwap && isAnimating) || !playerState || !enemyState) return;
    setIsAnimating(true);

    const isForced = forceSwap;
    const oldPokemon = getActiveBattler(playerState).pokemon;
    const newState: PlayerBattleState = { ...playerState, activeIndex: targetIndex };
    const newPokemon = getActiveBattler(newState).pokemon;

    setPlayerState(newState);
    setForceSwap(false);

    if (isForced) {
      addLog({ text: `가라, ${newPokemon.nameKo}!`, type: "action" });
      setIsAnimating(false);
      return;
    }

    addLog({ text: `${oldPokemon.nameKo}, 돌아와! 가라, ${newPokemon.nameKo}!`, type: "action" });
    await delay(600);
    await doEnemyTurn(newState, enemyState);
    setIsAnimating(false);
  };

  const goToSelect = () => {
    setPhase("select");
    setSelectedTrainer(null);
    setPlayerState(null);
    setEnemyState(null);
    setLogs([]);
    setBattleOver(false);
    setForceSwap(false);
  };

  const goToPickTeam = () => {
    setPhase("pick-team");
    setPlayerState(null);
    setEnemyState(null);
    setLogs([]);
    setBattleOver(false);
    setForceSwap(false);
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
        <TrainerSelect onSelect={handleTrainerSelect} />
      </div>
    );
  }

  if (phase === "pick-team" && selectedTrainer) {
    const maxTeam = Math.min(6, Math.max(selectedTrainer.pokemonIds.length, 3));
    return (
      <div className="space-y-6">
        <TeamPicker
          trainer={selectedTrainer}
          allPokemon={allPokemon}
          maxTeamSize={maxTeam}
          onConfirm={(ids) => startBattle(selectedTrainer, ids)}
          onBack={goToSelect}
        />
      </div>
    );
  }

  if (detailLoading || !playerState || !enemyState) {
    return <LoadingScreen message="배틀 준비중..." />;
  }

  const currentPlayer = getActiveBattler(playerState);
  const currentEnemy = getActiveBattler(enemyState);
  const playerRemaining = playerState.team.filter((b) => b.currentHp > 0).length;
  const enemyRemaining = enemyState.team.filter((b) => b.currentHp > 0).length;
  const swapOptions = getAliveSwapOptions(playerState);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={goToSelect}
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
        <div className="flex gap-2">
          <Button
            onClick={goToPickTeam}
            variant="outline"
            size="sm"
            className="gap-2 border-border text-foreground hover:bg-secondary cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />팀 변경
          </Button>
          <Button
            onClick={() =>
              selectedTrainer &&
              startBattle(
                selectedTrainer,
                playerState.team.map((b) => b.pokemon.id),
              )
            }
            variant="outline"
            size="sm"
            className="gap-2 border-border text-foreground hover:bg-secondary cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            재도전
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Swords className="h-4 w-4 text-primary" />
              <span>VS</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <BattlePanel
                battler={currentPlayer}
                isPlayer
                teamSize={playerState.team.length}
                remaining={playerRemaining}
              />
              <BattlePanel
                battler={currentEnemy}
                isPlayer={false}
                trainer={enemyState.trainer}
                teamSize={enemyState.team.length}
                remaining={enemyRemaining}
              />
            </div>

            {forceSwap ? (
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium text-destructive">
                  포켓몬이 쓰러졌습니다! 다른 포켓몬을 선택하세요.
                </p>
                <SwapPanel playerState={playerState} disabled={false} onSwap={handleSwap} />
              </div>
            ) : (
              <>
                <MoveGrid
                  moves={currentPlayer.pokemon.moves}
                  disabled={battleOver || isAnimating}
                  onSelect={handleMove}
                />
                {!battleOver && swapOptions.length > 0 && (
                  <SwapPanel playerState={playerState} disabled={isAnimating} onSwap={handleSwap} />
                )}
              </>
            )}
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
