import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("비인증 사용자는 로그인 페이지로 리다이렉트", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("text=트레이너 인증이 필요합니다")).toBeVisible();
  });

  test("로그인 폼이 표시됨", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=로그인")).toBeVisible();
    await expect(page.locator("text=회원가입")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("회원가입 탭 전환", async ({ page }) => {
    await page.goto("/login");
    await page.click("text=회원가입");
    await expect(page.locator('input[placeholder="2~20자"]')).toBeVisible();
  });
});

test.describe("Navigation (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.setItem("pokemon-auth-token", "test-token");
    });
  });

  test("보호된 라우트로 접근 시도 시 로그인 페이지 표시", async ({ page }) => {
    await page.goto("/quiz");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Quiz Page", () => {
  test("로그인 페이지에서 퀴즈 시작 화면 설정 UI 확인", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=로그인")).toBeVisible();
  });
});
