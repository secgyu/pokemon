import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorScreen } from "@/components/common/ErrorScreen";
import { SearchInput } from "@/components/common/SearchInput";
import { PokemonSprite } from "@/components/common/PokemonSprite";

describe("ErrorScreen", () => {
  it("기본 제목 렌더링", () => {
    render(<ErrorScreen />);
    expect(screen.getByText("로딩 실패")).toBeInTheDocument();
  });

  it("커스텀 제목 렌더링", () => {
    render(<ErrorScreen title="에러 발생" />);
    expect(screen.getByText("에러 발생")).toBeInTheDocument();
  });

  it("메시지가 있으면 표시", () => {
    render(<ErrorScreen message="네트워크 오류" />);
    expect(screen.getByText("네트워크 오류")).toBeInTheDocument();
  });

  it("메시지가 없으면 표시 안함", () => {
    const { container } = render(<ErrorScreen />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(1);
  });
});

describe("SearchInput", () => {
  it("placeholder 표시", () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="포켓몬 검색" />);
    expect(screen.getByPlaceholderText("포켓몬 검색")).toBeInTheDocument();
  });

  it("입력 시 onChange 호출", () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "피카" } });
    expect(onChange).toHaveBeenCalledWith("피카");
  });

  it("값이 있으면 X 버튼 표시", () => {
    const onChange = vi.fn();
    render(<SearchInput value="피카" onChange={onChange} />);
    const clearBtn = screen.getByRole("button");
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("값이 없으면 X 버튼 미표시", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("PokemonSprite", () => {
  it("올바른 src 생성", () => {
    render(<PokemonSprite id={25} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    );
  });

  it("기본 alt 텍스트", () => {
    render(<PokemonSprite id={25} />);
    expect(screen.getByAltText("Pokemon #25")).toBeInTheDocument();
  });

  it("커스텀 alt 텍스트", () => {
    render(<PokemonSprite id={25} alt="피카츄" />);
    expect(screen.getByAltText("피카츄")).toBeInTheDocument();
  });

  it("lazy loading 속성", () => {
    render(<PokemonSprite id={1} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "lazy");
  });
});
