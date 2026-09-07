import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';

const PageShell = ({ children, title, subtitle, action }) => (
  <div className="relative min-h-screen bg-[#0b0f19] light:bg-slate-50 text-slate-100 light:text-slate-900 overflow-x-hidden transition-colors duration-300">
    {/* Ambient background glow elements */}
    <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/10 via-purple-600/10 to-cyan-500/10 light:from-indigo-400/15 light:via-purple-400/15 light:to-cyan-400/15 blur-3xl" />
    <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-600/5 light:bg-indigo-400/10 blur-3xl" />

    <Navbar />
    
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      {title && (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800/80 light:border-slate-200 pb-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 light:text-indigo-600">TripNest Workspace</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white light:text-slate-900 sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-slate-400 light:text-slate-600 text-sm sm:text-base">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-3">{action}</div>}
        </div>
      )}
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </main>
  </div>
);

export default PageShell;
