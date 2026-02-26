import { useState, useCallback, useEffect } from "react";
import { Swords, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PokemonMove } from "@/data/pokemon";
import { LoadingScreen } from "@/components/common";
import { BattlePanel } from "@/components/battle/BattlePanel";
import { MoveGrid } from "@/components/battle/MoveGrid";
import { BattleLogPanel } from "@/components/battle/BattleLogPanel";
import { usePokemonList } from "@/hooks/usePokemonList";
import { fetchPokemonDetail } from "@/lib/pokeapi";
import { type BattleLog, type BattlerState, ensureMoves, calculateDamage, pickRandomIds } from "@/lib/battle";

export function BattlePage() {
  const { pokemon: allPokemon, loading: listLoading } = usePokemonList();

  const [player, setPlayer] = useState<BattlerState | null>(null);
  const [enemy, setEnemy] = useState<BattlerState | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [battleOver, setBattleOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = useCallback((log: BattleLog) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  const loadBattle = useCallback(async () => {
    if (allPokemon.length === 0) return;
    setDetailLoading(true);
    setBattleOver(false);
    setPlayer(null);
    setEnemy(null);
    setLogs([]);

    try {
      const pool = allPokemon.map((p) => p.id);
      const [pId, eId] = pickRandomIds(pool, 2);
      const [pDetail, eDetail] = await Promise.all([fetchPokemonDetail(pId), fetchPokemonDetail(eId)]);

      const pSafe = ensureMoves(pDetail);
      const eSafe = ensureMoves(eDetail);

      setPlayer({ pokemon: pSafe, currentHp: pSafe.stats.hp });
      setEnemy({ pokemon: eSafe, currentHp: eSafe.stats.hp });
      setLogs([
        { text: `${pSafe.nameKo} vs ${eSafe.nameKo}`, type: "info" },
        { text: "배틀 시작! 상대의 포켓몬이 나타났다!", type: "info" },
      ]);
    } catch {
      setLogs([{ text: "포켓몬 데이터를 불러오지 못했습니다. 다시 시도해주세요.", type: "info" }]);
    } finally {
      setDetailLoading(false);
    }
  }, [allPokemon]);

  useEffect(() => {
    if (allPokemon.length > 0 && !player && !detailLoading) loadBattle();
  }, [allPokemon, player, detailLoading, loadBattle]);

  const handleMove = async (move: PokemonMove) => {
    if (battleOver || isAnimating || !player || !enemy) return;
    setIsAnimating(true);

    const playerHit = Math.random() * 100 <= move.accuracy;
    if (playerHit) {
      const dmg = calculateDamage(player.pokemon, enemy.pokemon, move);
      const newHp = Math.max(0, enemy.currentHp - dmg);
      addLog({ text: `${player.pokemon.nameKo}의 ${move.name}!`, type: "action" });
      await delay(400);
      addLog({ text: `상대에게 ${dmg}의 데미지!`, type: "damage" });
      setEnemy((prev) => prev && { ...prev, currentHp: newHp });

      if (newHp <= 0) {
        await delay(500);
        addLog({ text: `상대의 ${enemy.pokemon.nameKo}은(는) 쓰러졌다!`, type: "result" });
        addLog({ text: "승리!", type: "result" });
        setBattleOver(true);
        setIsAnimating(false);
        return;
      }
    } else {
      addLog({ text: `${player.pokemon.nameKo}의 ${move.name}!`, type: "action" });
      await delay(400);
      addLog({ text: "공격이 빗나갔다!", type: "info" });
    }

    await delay(600);

    const enemyMove = enemy.pokemon.moves[Math.floor(Math.random() * enemy.pokemon.moves.length)];
    const enemyHit = Math.random() * 100 <= enemyMove.accuracy;
    if (enemyHit) {
      const eDmg = calculateDamage(enemy.pokemon, player.pokemon, enemyMove);
      const newPlayerHp = Math.max(0, player.currentHp - eDmg);
      addLog({ text: `상대 ${enemy.pokemon.nameKo}의 ${enemyMove.name}!`, type: "action" });
      await delay(400);
      addLog({ text: `${eDmg}의 데미지를 받았다!`, type: "damage" });
      setPlayer((prev) => prev && { ...prev, currentHp: newPlayerHp });

      if (newPlayerHp <= 0) {
        await delay(500);
        addLog({ text: `${player.pokemon.nameKo}은(는) 쓰러졌다...`, type: "result" });
        addLog({ text: "패배...", type: "result" });
        setBattleOver(true);
      }
    } else {
      addLog({ text: `상대 ${enemy.pokemon.nameKo}의 ${enemyMove.name}!`, type: "action" });
      await delay(400);
      addLog({ text: "상대의 공격이 빗나갔다!", type: "info" });
    }

    setIsAnimating(false);
  };

  if (listLoading || detailLoading || !player || !enemy) {
    return <LoadingScreen message={listLoading ? "포켓몬 목록 불러오는 중..." : "배틀 포켓몬 준비중..."} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-lg text-foreground sm:text-xl">Battle</h1>
          <p className="mt-1 text-sm text-secondary-custom">포켓몬 배틀 시뮬레이터</p>
        </div>
        <Button
          onClick={loadBattle}
          variant="outline"
          size="sm"
          className="gap-2 border-border text-foreground hover:bg-secondary cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />새 배틀
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
              <BattlePanel battler={enemy} isPlayer={false} />
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
