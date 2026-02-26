import { describe, it, expect } from "vitest";
import { calculateDamage, ensureMoves, pickRandomIds, DEFAULT_MOVE } from "../battle";
import {
  PIKACHU_DETAIL,
  CHARIZARD_DETAIL,
  NO_MOVES_POKEMON,
  MOVE_THUNDERBOLT,
  MOVE_STATUS,
} from "@/test/fixtures";

describe("ensureMoves", () => {
  it("기술이 있으면 그대로 반환", () => {
    const result = ensureMoves(PIKACHU_DETAIL);
    expect(result).toBe(PIKACHU_DETAIL);
    expect(result.moves).toHaveLength(2);
  });

  it("기술이 없으면 기본 Tackle 추가", () => {
    const result = ensureMoves(NO_MOVES_POKEMON);
    expect(result.moves).toHaveLength(1);
    expect(result.moves[0]).toEqual(DEFAULT_MOVE);
  });

  it("기술 없는 포켓몬을 수정해도 원본 불변", () => {
    ensureMoves(NO_MOVES_POKEMON);
    expect(NO_MOVES_POKEMON.moves).toHaveLength(0);
  });
});

describe("calculateDamage", () => {
  it("power가 0인 기술은 데미지 0 반환", () => {
    const dmg = calculateDamage(PIKACHU_DETAIL, CHARIZARD_DETAIL, MOVE_STATUS);
    expect(dmg).toBe(0);
  });

  it("일반 공격은 항상 1 이상의 데미지", () => {
    for (let i = 0; i < 20; i++) {
      const dmg = calculateDamage(PIKACHU_DETAIL, CHARIZARD_DETAIL, MOVE_THUNDERBOLT);
      expect(dmg).toBeGreaterThanOrEqual(1);
    }
  });

  it("STAB (자속 보정) 적용 여부에 따라 데미지 차이", () => {
    const stabDamages: number[] = [];
    const noStabDamages: number[] = [];

    for (let i = 0; i < 100; i++) {
      stabDamages.push(
        calculateDamage(PIKACHU_DETAIL, CHARIZARD_DETAIL, MOVE_THUNDERBOLT)
      );
      noStabDamages.push(
        calculateDamage(PIKACHU_DETAIL, CHARIZARD_DETAIL, {
          ...MOVE_THUNDERBOLT,
          type: "water",
        })
      );
    }

    const avgStab = stabDamages.reduce((a, b) => a + b) / stabDamages.length;
    const avgNoStab = noStabDamages.reduce((a, b) => a + b) / noStabDamages.length;
    expect(avgStab).toBeGreaterThan(avgNoStab);
  });

  it("special 기술은 spAtk/spDef 사용", () => {
    const specialMove = { ...MOVE_THUNDERBOLT, category: "special" as const };
    const dmg = calculateDamage(PIKACHU_DETAIL, CHARIZARD_DETAIL, specialMove);
    expect(dmg).toBeGreaterThanOrEqual(1);
  });

  it("physical 기술은 attack/defense 사용", () => {
    const physicalMove = { ...MOVE_THUNDERBOLT, category: "physical" as const };
    const dmg = calculateDamage(PIKACHU_DETAIL, CHARIZARD_DETAIL, physicalMove);
    expect(dmg).toBeGreaterThanOrEqual(1);
  });
});

describe("pickRandomIds", () => {
  it("요청한 개수만큼 반환", () => {
    const result = pickRandomIds([1, 2, 3, 4, 5], 3);
    expect(result).toHaveLength(3);
  });

  it("원본 pool에서만 선택", () => {
    const pool = [10, 20, 30, 40, 50];
    const result = pickRandomIds(pool, 2);
    result.forEach((id) => expect(pool).toContain(id));
  });

  it("중복 없이 선택", () => {
    const pool = [1, 2, 3, 4, 5];
    const result = pickRandomIds(pool, 5);
    expect(new Set(result).size).toBe(5);
  });

  it("원본 pool 변경하지 않음", () => {
    const pool = [1, 2, 3, 4, 5];
    const original = [...pool];
    pickRandomIds(pool, 3);
    expect(pool).toEqual(original);
  });
});
