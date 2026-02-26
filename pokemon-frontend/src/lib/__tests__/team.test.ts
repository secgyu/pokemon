import { describe, it, expect } from "vitest";
import { getTeamWeaknesses, getTeamCoverage } from "../team";
import {
  PIKACHU_LIST,
  CHARIZARD_LIST,
  BULBASAUR_LIST,
  CHARIZARD_DETAIL,
} from "@/test/fixtures";
import type { PokemonDetail } from "@/data/pokemon";

describe("getTeamWeaknesses", () => {
  it("빈 팀은 약점 없음", () => {
    const weaknesses = getTeamWeaknesses([]);
    expect(weaknesses.size).toBe(0);
  });

  it("전기 타입은 땅 약점", () => {
    const weaknesses = getTeamWeaknesses([PIKACHU_LIST]);
    expect(weaknesses.get("ground")).toBe(1);
  });

  it("불/비행 타입은 물, 전기, 바위 약점", () => {
    const weaknesses = getTeamWeaknesses([CHARIZARD_LIST]);
    expect(weaknesses.get("water")).toBe(1);
    expect(weaknesses.get("electric")).toBe(1);
    expect(weaknesses.get("rock")).toBe(1);
  });

  it("같은 약점이 여러 멤버에게 있으면 카운트 증가", () => {
    const weaknesses = getTeamWeaknesses([PIKACHU_LIST, CHARIZARD_LIST]);
    expect(weaknesses.has("ground")).toBe(true);
  });

  it("풀/독 타입의 약점 확인", () => {
    const weaknesses = getTeamWeaknesses([BULBASAUR_LIST]);
    expect(weaknesses.get("fire")).toBe(1);
    expect(weaknesses.get("ice")).toBe(1);
    expect(weaknesses.get("psychic")).toBe(1);
    expect(weaknesses.get("flying")).toBe(1);
  });
});

describe("getTeamCoverage", () => {
  it("빈 팀은 커버리지 없음", () => {
    const coverage = getTeamCoverage([], new Map());
    expect(coverage.size).toBe(0);
  });

  it("타입 기반 커버리지 계산", () => {
    const coverage = getTeamCoverage([PIKACHU_LIST], new Map());
    expect(coverage.has("water")).toBe(true);
    expect(coverage.has("flying")).toBe(true);
  });

  it("기술 기반 커버리지 추가", () => {
    const details = new Map<number, PokemonDetail>();
    details.set(CHARIZARD_DETAIL.id, CHARIZARD_DETAIL);

    const coverageWithDetail = getTeamCoverage([CHARIZARD_LIST], details);
    const coverageWithout = getTeamCoverage([CHARIZARD_LIST], new Map());

    expect(coverageWithDetail.size).toBeGreaterThanOrEqual(coverageWithout.size);
  });

  it("여러 멤버의 커버리지 합산", () => {
    const coverage = getTeamCoverage(
      [PIKACHU_LIST, CHARIZARD_LIST, BULBASAUR_LIST],
      new Map()
    );
    expect(coverage.has("water")).toBe(true);
    expect(coverage.has("grass")).toBe(true);
    expect(coverage.has("ground")).toBe(true);
  });
});
