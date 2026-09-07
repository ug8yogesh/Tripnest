import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import TripForm from '../components/TripForm';
import { tripApi } from '../utils/tripApi';
import { SkeletonGrid } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import MorphTransition from '../components/MorphTransition';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Search, 
  Filter,
  Compass
} from 'lucide-react';

const DESTINATION_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476514525535-ce74f45814d1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&auto=format&fit=crop&q=80',
];

const getStatusBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'ONGOING':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]';
    case 'UPCOMING':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'COMPLETED':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'CANCELLED':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'PLANNING':
    default:
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  }
};

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setShowCreate(true);
    }
  }, [searchParams]);

  useKeyboardShortcuts({
    onNewTrip: () => setShowCreate(true),
    onFocusSearch: () => searchInputRef.current?.focus(),
    onEscape: () => setShowCreate(false),
  });

  const loadTrips = async () => {
    setLoading(true);
    try {
      const res = await tripApi.list();
      setTrips(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTrips(); }, []);

  const createTrip = async (payload) => {
    try {
      const result = await tripApi.create(payload);
      setShowCreate(false);
      toast.success('Trip created successfully');
      navigate(`/trips/${result.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to create trip.';
      setError(msg);
      toast.error(msg);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await tripApi.remove(tripId);
      setTrips((current) => current.filter((trip) => trip.id !== tripId));
      toast.success('Trip deleted');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to delete trip.';
      setError(msg);
      toast.error(msg);
    }
  };

  const filteredTrips = trips.filter((t) => {
    const matchesSearch = 
      (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.destination || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (t.status || 'PLANNING').toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AnimatedPage>
      <PageShell
        title="Your Travel Plans"
        subtitle="Keep every route, reservation, and itinerary organized in one place."
        action={
          <button
            className="primary-button text-sm flex items-center gap-2"
            onClick={() => setShowCreate((value) => !value)}
            title="Press 'N' to open"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreate ? 'Close Form' : 'New Trip'}</span>
            <kbd className="hidden sm:inline-block text-[10px] bg-indigo-700/50 px-1.5 py-0.5 rounded text-white font-extrabold border border-indigo-400/40 ml-1">
              N
            </kbd>
          </button>
        }
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs text-rose-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* CREATE TRIP MODAL/CARD */}
        {showCreate && (
          <div className="glass-card p-6 sm:p-8 mb-8 border-indigo-500/40 shadow-glow-indigo">
            <div className="mb-6 pb-4 border-b border-slate-800 light:border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white light:text-slate-900">Create a New Trip</h2>
                <p className="text-xs text-slate-400 light:text-slate-500">Specify dates, destination, and budget goals</p>
              </div>
              <kbd className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded">Esc to close</kbd>
            </div>
            <TripForm onSubmit={createTrip} onCancel={() => setShowCreate(false)} submitLabel="Create Trip" />
          </div>
        )}

        {/* FILTER & SEARCH BAR */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 light:bg-white/80 p-4 rounded-2xl border border-slate-800/80 light:border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search title or destination... (Press '/')"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-slate-950/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 rounded-xl text-xs text-white light:text-slate-900 placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <kbd className="absolute right-3 top-2.5 text-[10px] text-slate-500 bg-slate-800 light:bg-slate-200 px-1.5 py-0.5 rounded">
              /
            </kbd>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            {['ALL', 'PLANNING', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950/60 light:bg-slate-100 text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* SKELETON-TO-CONTENT MORPH CROSSFADE */}
        <MorphTransition
          loading={loading}
          skeleton={<SkeletonGrid count={6} />}
        >
          {filteredTrips.length === 0 ? (
            <EmptyState
              icon={Compass}
              title={search || statusFilter !== 'ALL' ? "No matching trips" : "Your travel map is empty"}
              description={search || statusFilter !== 'ALL' ? "Try adjusting your search query or status filter." : "Create your first trip to start building your day-by-day itinerary."}
              action={
                <button className="primary-button text-sm px-6 py-2.5" onClick={() => setShowCreate(true)}>
                  Start Your First Trip
                </button>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip, idx) => {
                const bgImg = DESTINATION_IMAGES[idx % DESTINATION_IMAGES.length];
                return (
                  <article
                    key={trip.id}
                    className="glass-card group overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Card Header Image Thumbnail */}
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={bgImg}
                          alt={trip.destination}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        
                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getStatusBadgeClass(trip.status)}`}>
                          {trip.status || 'PLANNING'}
                        </span>

                        <div className="absolute bottom-3 left-4 right-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Destination</span>
                          <h3 className="text-xl font-extrabold text-white truncate">{trip.title}</h3>
                        </div>
                      </div>

                      {/* Body Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center text-xs text-slate-300 light:text-slate-700 gap-2">
                          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="truncate">{trip.destination}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 light:border-slate-200/80 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-400 light:text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{trip.startDate} — {trip.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1 font-bold text-white light:text-slate-900">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{trip.totalBudget ? trip.totalBudget.toLocaleString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="p-5 pt-0 flex gap-3">
                      <Link
                        to={`/trips/${trip.id}`}
                        className="primary-button flex-1 text-center py-2.5 text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>View Trip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="p-2.5 rounded-xl border border-slate-800 light:border-slate-200 bg-slate-950/60 light:bg-slate-100 text-slate-400 light:text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition"
                        title="Delete trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </MorphTransition>
      </PageShell>
    </AnimatedPage>
  );
};

export default Trips;
