import { describe, it, expect } from "vitest";
import { shuffle, generateSession, DIFFICULTY_CONFIGS } from "../quiz";
import { makePokemonList } from "@/test/fixtures";

describe("shuffle", () => {
  it("배열 길이 보존", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it("원본 배열 변경하지 않음", () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffle(arr);
    expect(arr).toEqual(original);
  });

  it("같은 요소를 포함", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("빈 배열 처리", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("단일 요소 배열 처리", () => {
    expect(shuffle([42])).toEqual([42]);
  });
});

describe("generateSession - silhouette", () => {
  const pool = makePokemonList(50);

  it("normal 난이도에서 10개의 문제 생성", () => {
    const session = generateSession(pool, "normal", "silhouette");
    expect(session.questions).toHaveLength(DIFFICULTY_CONFIGS.normal.numQuestions);
  });

  it("hard 난이도에서 15개의 문제 생성", () => {
    const session = generateSession(pool, "hard", "silhouette");
    expect(session.questions).toHaveLength(DIFFICULTY_CONFIGS.hard.numQuestions);
  });

  it("각 문제에 난이도별 선택지 수 생성", () => {
    const session = generateSession(pool, "normal", "silhouette");
    session.questions.forEach((q) => {
      if (q.mode === "silhouette") {
        expect(q.choices).toHaveLength(DIFFICULTY_CONFIGS.normal.numChoices);
      }
    });
  });

  it("각 문제의 정답이 선택지에 포함", () => {
    const session = generateSession(pool, "normal", "silhouette");
    session.questions.forEach((q) => {
      if (q.mode === "silhouette") {
        const choiceIds = q.choices.map((c) => c.id);
        expect(choiceIds).toContain(q.pokemon.id);
      }
    });
  });

  it("각 문제의 선택지에 중복 없음", () => {
    const session = generateSession(pool, "normal", "silhouette");
    session.questions.forEach((q) => {
      if (q.mode === "silhouette") {
        const ids = q.choices.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });
  });

  it("문제 순서가 매번 다를 수 있음 (랜덤성)", () => {
    const sessions = Array.from({ length: 5 }, () => generateSession(pool, "normal", "silhouette"));
    const firstIds = sessions.map((s) => s.questions.map((q) => q.pokemon.id).join(","));
    const unique = new Set(firstIds);
    expect(unique.size).toBeGreaterThan(1);
  });

  it("pool이 numQuestions보다 적으면 pool 크기만큼 생성", () => {
    const smallPool = makePokemonList(3);
    const session = generateSession(smallPool, "normal", "silhouette");
    expect(session.questions).toHaveLength(3);
  });
});

describe("generateSession - type", () => {
  const pool = makePokemonList(50);

  it("타입 퀴즈에서 정답 타입이 선택지에 포함", () => {
    const session = generateSession(pool, "normal", "type");
    session.questions.forEach((q) => {
      if (q.mode === "type") {
        q.answer.forEach((a) => {
          expect(q.choices).toContain(a);
        });
      }
    });
  });
});

describe("generateSession - generation", () => {
  const pool = makePokemonList(50);

  it("세대 퀴즈에서 정답 세대가 선택지에 포함", () => {
    const session = generateSession(pool, "normal", "generation");
    session.questions.forEach((q) => {
      if (q.mode === "generation") {
        expect(q.choices).toContain(q.answer);
      }
    });
  });
});
