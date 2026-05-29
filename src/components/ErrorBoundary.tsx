"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="font-display text-xl font-bold text-rose-400">
            Ошибка загрузки
          </h1>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {this.state.error.message}
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-brand-600 px-4 py-2 text-sm text-white"
            onClick={() => window.location.reload()}
          >
            Обновить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
