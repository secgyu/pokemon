import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl">😵</div>
        <h2 className="font-pixel text-lg text-[#cc0000]">예상치 못한 오류가 발생했습니다</h2>
        <p className="max-w-md text-sm text-muted-foreground">{this.state.error?.message ?? "알 수 없는 오류"}</p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={this.handleReset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            다시 시도
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    );
  }
}
