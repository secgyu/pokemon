import { describe, it, expect } from "vitest";
import {
  getSpriteUrl,
  getArtworkUrl,
  formatPokedexNumber,
  TYPE_COLORS,
  ALL_TYPES,
  GENERATIONS,
} from "../pokemon";

describe("getSpriteUrl", () => {
  it("올바른 URL 형식 반환", () => {
    expect(getSpriteUrl(25)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    );
  });

  it("ID 1번 URL", () => {
    expect(getSpriteUrl(1)).toContain("/1.png");
  });
});

describe("getArtworkUrl", () => {
  it("official-artwork 경로 포함", () => {
    expect(getArtworkUrl(6)).toContain("official-artwork/6.png");
  });
});

describe("formatPokedexNumber", () => {
  it("1자리 → #001", () => {
    expect(formatPokedexNumber(1)).toBe("#001");
  });

  it("2자리 → #025", () => {
    expect(formatPokedexNumber(25)).toBe("#025");
  });

  it("3자리 → #150", () => {
    expect(formatPokedexNumber(150)).toBe("#150");
  });

  it("4자리 → #1025", () => {
    expect(formatPokedexNumber(1025)).toBe("#1025");
  });
});

describe("TYPE_COLORS", () => {
  it("18개 타입 전부 정의", () => {
    expect(Object.keys(TYPE_COLORS)).toHaveLength(18);
  });

  it("모든 값이 hex 색상 코드", () => {
    Object.values(TYPE_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[A-Fa-f0-9]{6}$/);
    });
  });
});

describe("ALL_TYPES", () => {
  it("18개 타입", () => {
    expect(ALL_TYPES).toHaveLength(18);
  });

  it("TYPE_COLORS 키와 동일", () => {
    expect(ALL_TYPES).toEqual(Object.keys(TYPE_COLORS));
  });
});

describe("GENERATIONS", () => {
  it("10개 세대 (전체 + 1~9세대)", () => {
    expect(GENERATIONS).toHaveLength(10);
  });

  it("첫 번째는 전체 범위", () => {
    expect(GENERATIONS[0].label).toBe("전체");
    expect(GENERATIONS[0].range[0]).toBe(1);
    expect(GENERATIONS[0].range[1]).toBe(1025);
  });

  it("세대 범위가 연속적", () => {
    for (let i = 2; i < GENERATIONS.length; i++) {
      expect(GENERATIONS[i].range[0]).toBe(GENERATIONS[i - 1].range[1] + 1);
    }
  });
});
