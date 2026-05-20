import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In production this could be sent to a logging service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _error = error;
    const _errorInfo = errorInfo;
    // Silent catch to avoid console noise in production builds
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-error-warning-line text-brand-navy text-2xl" />
            </div>
            <h1 className="text-display text-xl md:text-2xl font-medium text-brand-navy mb-3">
              頁面載入發生問題
            </h1>
            <p className="text-brand-textLight text-sm leading-relaxed mb-6">
              很抱歉，這個頁面在載入時遇到了錯誤。
              <br />
              請重新整理頁面，或返回首頁繼續瀏覽。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary w-full sm:w-auto whitespace-nowrap"
              >
                重新整理
              </button>
              <a
                href="/"
                className="btn-outline w-full sm:w-auto whitespace-nowrap"
              >
                返回首頁
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}