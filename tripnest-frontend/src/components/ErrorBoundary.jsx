import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center backdrop-blur-md shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white dark:text-white light:text-slate-900">
            Something went wrong in this section
          </h2>
          <p className="mt-2 text-xs text-rose-300 dark:text-rose-300 light:text-rose-700 max-w-md mx-auto">
            {this.state.error?.message || 'An unexpected rendering error occurred. You can retry or reload the page.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="primary-button text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Component</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="secondary-button text-xs py-2.5 px-4"
            >
              Reload Entire Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
