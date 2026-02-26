import { describe, it, expect } from "vitest";
import { shuffle, generateSession, NUM_QUESTIONS } from "../quiz";
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

describe("generateSession", () => {
  const pool = makePokemonList(50);

  it("NUM_QUESTIONS 개의 문제 생성", () => {
    const session = generateSession(pool);
    expect(session.questions).toHaveLength(NUM_QUESTIONS);
  });

  it("각 문제에 4개의 선택지 생성", () => {
    const session = generateSession(pool);
    session.choicesPerQuestion.forEach((choices) => {
      expect(choices).toHaveLength(4);
    });
  });

  it("각 문제의 정답이 선택지에 포함", () => {
    const session = generateSession(pool);
    session.questions.forEach((question, i) => {
      const choiceIds = session.choicesPerQuestion[i].map((c) => c.id);
      expect(choiceIds).toContain(question.id);
    });
  });

  it("각 문제의 선택지에 중복 없음", () => {
    const session = generateSession(pool);
    session.choicesPerQuestion.forEach((choices) => {
      const ids = choices.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it("문제 순서가 매번 다를 수 있음 (랜덤성)", () => {
    const sessions = Array.from({ length: 5 }, () => generateSession(pool));
    const firstIds = sessions.map((s) => s.questions.map((q) => q.id).join(","));
    const unique = new Set(firstIds);
    expect(unique.size).toBeGreaterThan(1);
  });

  it("pool이 NUM_QUESTIONS보다 적으면 pool 크기만큼 생성", () => {
    const smallPool = makePokemonList(3);
    const session = generateSession(smallPool);
    expect(session.questions).toHaveLength(3);
  });
});
