import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PokeballSpinner } from "@/components/pokemon/PokeballSpinner";

export function LoginPage() {
  const { isAuthenticated, loading, login, signup } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  const [tab, setTab] = useState<string>("login");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <PokeballSpinner size={56} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function resetForm() {
    setEmail("");
    setNickname("");
    setPassword("");
    setError(null);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup(email, nickname, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[420px] space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <svg width="64" height="64" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="#cc0000" stroke="#2a2a4a" strokeWidth="4" />
            <rect x="2" y="46" width="96" height="8" fill="#2a2a4a" />
            <circle cx="50" cy="50" r="48" fill="url(#loginHalf)" stroke="#2a2a4a" strokeWidth="4" />
            <defs>
              <linearGradient id="loginHalf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cc0000" />
                <stop offset="46%" stopColor="#cc0000" />
                <stop offset="46%" stopColor="#2a2a4a" />
                <stop offset="54%" stopColor="#2a2a4a" />
                <stop offset="54%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#f0f0f0" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="12" fill="#f0f0f0" stroke="#2a2a4a" strokeWidth="4" />
            <circle cx="50" cy="50" r="6" fill="#2a2a4a" />
          </svg>
          <div className="text-center">
            <h1 className="font-pixel text-lg text-primary">POKéMON</h1>
            <p className="mt-1 text-sm text-muted-foreground">트레이너 인증이 필요합니다</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v);
              resetForm();
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">
                로그인
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">
                회원가입
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">이메일</span>
                  <Input
                    type="email"
                    placeholder="trainer@pokemon.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">비밀번호</span>
                  <Input
                    type="password"
                    placeholder="6자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="current-password"
                  />
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={submitting} className="mt-1">
                  {submitting ? "로그인 중..." : "로그인"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="mt-4 flex flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">이메일</span>
                  <Input
                    type="email"
                    placeholder="trainer@pokemon.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">닉네임</span>
                  <Input
                    type="text"
                    placeholder="2~20자"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    minLength={2}
                    maxLength={20}
                    autoComplete="username"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">비밀번호</span>
                  <Input
                    type="password"
                    placeholder="6자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={submitting} className="mt-1">
                  {submitting ? "가입 중..." : "회원가입"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-[10px] text-muted-custom">Pokémon All-in-One v1.0</p>
      </div>
    </div>
  );
}
