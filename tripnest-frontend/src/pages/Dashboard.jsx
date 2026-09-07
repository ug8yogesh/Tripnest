import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import CountUp from '../components/CountUp';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tripApi } from '../utils/tripApi';
import { budgetApi } from '../utils/budgetApi';
import { SkeletonGrid } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { 
  MapPin, 
  Wallet, 
  CreditCard, 
  Users, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  Compass, 
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [overview, setOverview] = useState({ spent: 0, budget: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    tripApi.list()
      .then(async ({ data }) => {
        setTrips(data || []);
        const active = data && data[0];
        if (active) {
          const result = await budgetApi.get(active.id).catch(() => ({ data: null }));
          if (result.data) {
            setOverview({
              spent: result.data.totalSpent || 0,
              budget: result.data.totalAmount || 0
            });
          }
        }
      })
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  // Budget status calculation (Green / Yellow / Red)
  const percentSpent = overview.budget > 0 ? Math.round((overview.spent / overview.budget) * 100) : 0;
  
  let budgetStatusColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  let budgetBarColor = "from-emerald-500 to-teal-400";
  let budgetLabel = "On Track";
  let StatusIcon = CheckCircle;

  if (percentSpent >= 90 || (overview.budget > 0 && overview.spent > overview.budget)) {
    budgetStatusColor = "text-rose-400 border-rose-500/20 bg-rose-500/10";
    budgetBarColor = "from-rose-500 to-red-400";
    budgetLabel = "Budget Exceeded / Critical";
    StatusIcon = AlertTriangle;
  } else if (percentSpent >= 75) {
    budgetStatusColor = "text-amber-400 border-amber-500/20 bg-amber-500/10";
    budgetBarColor = "from-amber-500 to-yellow-400";
    budgetLabel = "Near Threshold";
    StatusIcon = TrendingUp;
  }

  return (
    <AnimatedPage>
      <PageShell
        title={`Welcome back, ${user?.name || user?.email?.split('@')[0] || 'Traveler'}!`}
        subtitle="Here is your travel workspace overview, budget health, and quick actions."
        action={
          <Link to="/trips" className="primary-button text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Trip</span>
          </Link>
        }
      >
        {loading ? (
          <SkeletonGrid count={3} />
        ) : (
          <>
            {/* STAT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Planned Trips Card */}
              <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Trips</span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-white">
                    <CountUp end={trips.length} />
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{trips.filter(t => t.status === 'UPCOMING' || t.status === 'ONGOING').length} active or upcoming</span>
                  </p>
                </div>
              </div>

              {/* Current Budget Card */}
              <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Budget</span>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-white">
                    <CountUp end={overview.budget} prefix="$" />
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Set across active trip plans</p>
                </div>
              </div>

              {/* Total Spent & Status Card */}
              <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Spent</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-4xl font-extrabold text-white">
                      <CountUp end={overview.spent} prefix="$" />
                    </p>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${budgetStatusColor}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{percentSpent}%</span>
                    </span>
                  </div>

                  {/* Color-coded spend progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${budgetBarColor} transition-all duration-500`}
                      style={{ width: `${Math.min(percentSpent, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
                    <span>Status: <strong className="text-slate-200">{budgetLabel}</strong></span>
                    <span>{percentSpent}% of budget</span>
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK ACTION TILES */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Workspace Shortcuts</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* My Trips Tile */}
                <Link
                  to="/trips"
                  className="glass-card p-6 flex flex-col justify-between group hover:border-indigo-500/50 hover:shadow-glow-indigo"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">My Trips</h4>
                    <p className="text-xs text-slate-400 mt-1">View, create, and build day-wise trip itineraries.</p>
                  </div>
                </Link>

                {/* Destinations Discover Tile */}
                <Link
                  to="/destinations"
                  className="glass-card p-6 flex flex-col justify-between group hover:border-cyan-500/50 hover:shadow-glow-cyan"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition duration-300">
                      <Compass className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">Discover Destinations</h4>
                    <p className="text-xs text-slate-400 mt-1">Browse trending hotspots, travel guides, and attractions.</p>
                  </div>
                </Link>

                {/* Collaboration Groups Tile */}
                <Link
                  to="/trips"
                  className="glass-card p-6 flex flex-col justify-between group hover:border-purple-500/50 hover:shadow-glow-purple"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
                      <Users className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition">Group Hub</h4>
                    <p className="text-xs text-slate-400 mt-1">Collaborate with co-travelers, chat live & split bills.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* RECENT TRIPS LIST OR EMPTY STATE */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Recent Trips</h3>
                  <p className="text-xs text-slate-400">Quick access to your travel plans</p>
                </div>
                {trips.length > 0 && (
                  <Link to="/trips" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <span>View all ({trips.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {trips.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title="No trips created yet"
                  description="Start planning your next getaway by creating your first trip."
                  action={
                    <Link to="/trips" className="primary-button text-sm px-6 py-2.5">
                      Create Your First Trip
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trips.slice(0, 3).map((t) => {
                    const isOngoing = t.status === 'ONGOING';
                    return (
                      <Link
                        key={t.id}
                        to={`/trips/${t.id}`}
                        className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/50 hover:border-indigo-500/40 transition group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition truncate max-w-[160px]">
                            {t.destination}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isOngoing
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            }`}
                          >
                            {t.status || 'PLANNING'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t.startDate} — {t.endDate}</span>
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </PageShell>
    </AnimatedPage>
  );
};

export default Dashboard;
