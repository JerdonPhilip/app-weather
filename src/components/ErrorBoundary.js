// src/components/ErrorBoundary.js — one panel crash must never blank the app
import React from 'react';
import { AlertIcon } from './icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Dashboard crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-b from-[#101A34] via-[#0B1224] to-[#080D19]">
        <div className="glass-panel max-w-md w-full p-8 text-center" role="alert">
          <span className="mx-auto mb-4 w-12 h-12 rounded-full grid place-items-center bg-status-alert/15 text-status-alert">
            <AlertIcon className="w-6 h-6" />
          </span>
          <h1 className="font-display font-bold text-xl text-white">Something broke on our side</h1>
          <p className="text-sm text-mist mt-2 leading-relaxed">
            The dashboard hit an unexpected error while rendering. Your data is safe — reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 h-11 px-6 rounded-full bg-horizon/90 hover:bg-horizon text-ink font-display font-semibold text-sm shadow-card transition-colors"
          >
            Reload dashboard
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
