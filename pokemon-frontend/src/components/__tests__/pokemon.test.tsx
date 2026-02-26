import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { PIKACHU_LIST, CHARIZARD_LIST } from "@/test/fixtures";

describe("TypeBadge", () => {
  it("타입 이름 표시", () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText("fire")).toBeInTheDocument();
  });

  it("올바른 배경색 적용", () => {
    render(<TypeBadge type="water" />);
    const badge = screen.getByText("water");
    expect(badge).toHaveStyle({ backgroundColor: "#6390F0" });
  });

  it("sm 사이즈 기본 적용", () => {
    render(<TypeBadge type="electric" />);
    const badge = screen.getByText("electric");
    expect(badge.className).toContain("text-[11px]");
  });

  it("md 사이즈 적용", () => {
    render(<TypeBadge type="grass" size="md" />);
    const badge = screen.getByText("grass");
    expect(badge.className).toContain("text-xs");
  });
});

describe("PokemonCard", () => {
  it("포켓몬 이름 렌더링", () => {
    render(<PokemonCard pokemon={PIKACHU_LIST} />);
    expect(screen.getByText("피카츄")).toBeInTheDocument();
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("도감 번호 표시", () => {
    render(<PokemonCard pokemon={PIKACHU_LIST} />);
    expect(screen.getByText("#025")).toBeInTheDocument();
  });

  it("타입 뱃지 렌더링", () => {
    render(<PokemonCard pokemon={CHARIZARD_LIST} />);
    expect(screen.getByText("fire")).toBeInTheDocument();
    expect(screen.getByText("flying")).toBeInTheDocument();
  });

  it("클릭 시 onClick 호출", () => {
    const onClick = vi.fn();
    render(<PokemonCard pokemon={PIKACHU_LIST} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("스프라이트 이미지 렌더링", () => {
    render(<PokemonCard pokemon={PIKACHU_LIST} />);
    const img = screen.getByAltText("Pikachu");
    expect(img).toHaveAttribute("src", expect.stringContaining("/25.png"));
  });
});
