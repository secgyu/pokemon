import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { login, signup } = useAuthContext();
  const [tab, setTab] = useState<string>("login");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  function resetForm() {
    setEmail("");
    setNickname("");
    setPassword("");
    setError(null);
    setSubmitting(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      handleOpenChange(false);
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
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-pixel text-base">트레이너 인증</DialogTitle>
          <DialogDescription>로그인하면 퀴즈 랭킹, 팀 저장, 즐겨찾기를 이용할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v);
            setError(null);
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
      </DialogContent>
    </Dialog>
  );
}
