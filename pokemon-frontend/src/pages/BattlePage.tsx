import { useState, useRef, useEffect, useCallback } from "react";
import { Swords, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { POKEMON_DATA, getSpriteUrl, TYPE_COLORS, type Pokemon, type PokemonMove } from "@/data/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

interface BattleLog {
  text: string;
  type: "action" | "damage" | "info" | "result";
}

interface BattlerState {
  pokemon: Pokemon;
  currentHp: number;
}

function getRandomPokemon(exclude?: number): Pokemon {
  const pool = exclude ? POKEMON_DATA.filter((p) => p.id !== exclude) : POKEMON_DATA;
  return pool[Math.floor(Math.random() * pool.length)];
}

function calculateDamage(attacker: Pokemon, defender: Pokemon, move: PokemonMove): number {
  if (move.power === 0) return 0;
  const atkStat = move.category === "special" ? attacker.stats.spAtk : attacker.stats.attack;
  const defStat = move.category === "special" ? defender.stats.spDef : defender.stats.defense;
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  const random = 0.85 + Math.random() * 0.15;
  const base = ((22 * move.power * (atkStat / defStat)) / 50 + 2) * stab * random;
  return Math.max(1, Math.floor(base));
}

function HpBar({ current, max }: { current: number; max: number }) {
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
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#2a2a4a]">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function PokemonBattlePanel({ battler, isPlayer }: { battler: BattlerState; isPlayer: boolean }) {
  const { pokemon, currentHp } = battler;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{isPlayer ? "MY" : "ENEMY"}</span>
        </div>
        <h3 className="font-pixel text-xs text-foreground sm:text-sm">{pokemon.nameKo}</h3>
        <div className="mt-1 flex justify-center gap-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute inset-0 rounded-full opacity-15 blur-2xl"
          style={{ backgroundColor: TYPE_COLORS[pokemon.types[0]] }}
        />
        <img
          src={getSpriteUrl(pokemon.id)}
          alt={pokemon.name}
          className={`relative h-28 w-28 sprite-pixel drop-shadow-lg sm:h-36 sm:w-36 ${
            currentHp <= 0 ? "grayscale opacity-40" : ""
          } transition-all duration-300`}
        />
      </div>

      <div className="w-full max-w-[200px]">
        <HpBar current={currentHp} max={pokemon.stats.hp} />
      </div>
    </div>
  );
}

export function BattlePage() {
  const [player, setPlayer] = useState<BattlerState>(() => {
    const p = POKEMON_DATA[3]; // Pikachu
    return { pokemon: p, currentHp: p.stats.hp };
  });
  const [enemy, setEnemy] = useState<BattlerState>(() => {
    const e = getRandomPokemon(25);
    return { pokemon: e, currentHp: e.stats.hp };
  });
  const [logs, setLogs] = useState<BattleLog[]>([{ text: "배틀 시작! 상대의 포켓몬이 나타났다!", type: "info" }]);
  const [battleOver, setBattleOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = useCallback((log: BattleLog) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  const handleMove = async (move: PokemonMove) => {
    if (battleOver || isAnimating) return;
    setIsAnimating(true);

    const hit = Math.random() * 100 <= move.accuracy;

    if (hit) {
      const dmg = calculateDamage(player.pokemon, enemy.pokemon, move);
      const newHp = Math.max(0, enemy.currentHp - dmg);
      addLog({ text: `${player.pokemon.nameKo}의 ${move.name}!`, type: "action" });

      await new Promise((r) => setTimeout(r, 400));
      addLog({ text: `상대에게 ${dmg}의 데미지!`, type: "damage" });
      setEnemy((prev) => ({ ...prev, currentHp: newHp }));

      if (newHp <= 0) {
        await new Promise((r) => setTimeout(r, 500));
        addLog({ text: `상대의 ${enemy.pokemon.nameKo}은(는) 쓰러졌다!`, type: "result" });
        addLog({ text: "🎉 승리!", type: "result" });
        setBattleOver(true);
        setIsAnimating(false);
        return;
      }
    } else {
      addLog({ text: `${player.pokemon.nameKo}의 ${move.name}!`, type: "action" });
      await new Promise((r) => setTimeout(r, 400));
      addLog({ text: "공격이 빗나갔다!", type: "info" });
    }

    await new Promise((r) => setTimeout(r, 600));

    const enemyMove = enemy.pokemon.moves[Math.floor(Math.random() * enemy.pokemon.moves.length)];
    const enemyHit = Math.random() * 100 <= enemyMove.accuracy;

    if (enemyHit) {
      const eDmg = calculateDamage(enemy.pokemon, player.pokemon, enemyMove);
      const newPlayerHp = Math.max(0, player.currentHp - eDmg);
      addLog({ text: `상대 ${enemy.pokemon.nameKo}의 ${enemyMove.name}!`, type: "action" });

      await new Promise((r) => setTimeout(r, 400));
      addLog({ text: `${eDmg}의 데미지를 받았다!`, type: "damage" });
      setPlayer((prev) => ({ ...prev, currentHp: newPlayerHp }));

      if (newPlayerHp <= 0) {
        await new Promise((r) => setTimeout(r, 500));
        addLog({ text: `${player.pokemon.nameKo}은(는) 쓰러졌다...`, type: "result" });
        addLog({ text: "패배...", type: "result" });
        setBattleOver(true);
      }
    } else {
      addLog({ text: `상대 ${enemy.pokemon.nameKo}의 ${enemyMove.name}!`, type: "action" });
      await new Promise((r) => setTimeout(r, 400));
      addLog({ text: "상대의 공격이 빗나갔다!", type: "info" });
    }

    setIsAnimating(false);
  };

  const resetBattle = () => {
    const p = POKEMON_DATA[Math.floor(Math.random() * POKEMON_DATA.length)];
    const e = getRandomPokemon(p.id);
    setPlayer({ pokemon: p, currentHp: p.stats.hp });
    setEnemy({ pokemon: e, currentHp: e.stats.hp });
    setLogs([{ text: "새로운 배틀 시작!", type: "info" }]);
    setBattleOver(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-lg text-foreground sm:text-xl">Battle</h1>
          <p className="mt-1 text-sm text-secondary-custom">포켓몬 배틀 시뮬레이터</p>
        </div>
        <Button
          onClick={resetBattle}
          variant="outline"
          size="sm"
          className="gap-2 border-border text-foreground hover:bg-secondary cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />새 배틀
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Battle Field */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Swords className="h-4 w-4 text-primary" />
              <span>VS</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PokemonBattlePanel battler={player} isPlayer />
              <PokemonBattlePanel battler={enemy} isPlayer={false} />
            </div>

            {/* Move Buttons */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium text-muted-foreground">기술 선택</p>
              <div className="grid grid-cols-2 gap-2">
                {player.pokemon.moves.map((move) => (
                  <button
                    key={move.name}
                    onClick={() => handleMove(move)}
                    disabled={battleOver || isAnimating}
                    className="group flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left transition-all duration-150 hover:border-[#4a4a8a] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${TYPE_COLORS[move.type]}15, transparent)`,
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{move.name}</p>
                      <TypeBadge type={move.type} />
                    </div>
                    <div className="text-right text-[10px] text-muted-foreground">
                      <p>PWR {move.power || "—"}</p>
                      <p>ACC {move.accuracy}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Battle Log</h3>
            </div>
            <ScrollArea className="h-[400px] p-3">
              <div className="space-y-1.5 font-mono text-xs">
                {logs.map((log, i) => (
                  <p
                    key={i}
                    className={
                      log.type === "action"
                        ? "text-foreground"
                        : log.type === "damage"
                          ? "text-[#cc0000] font-semibold"
                          : log.type === "result"
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                    }
                  >
                    {log.text}
                  </p>
                ))}
                <div ref={logEndRef} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
