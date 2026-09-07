import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import TripForm from '../components/TripForm';
import { tripApi } from '../utils/tripApi';
import { itineraryApi } from '../utils/itineraryApi';
import SkeletonCard from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import MorphTransition from '../components/MorphTransition';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  Edit3, 
  Users, 
  Wallet, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

const TripDetail = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [editing, setEditing] = useState(false);
  const [days, setDays] = useState([]);
  const [dayForm, setDayForm] = useState({ dayNumber: '', date: '', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tripResult, itineraryResult] = await Promise.all([
          tripApi.get(tripId), 
          itineraryApi.list(tripId)
        ]);
        setTrip(tripResult.data);
        setDays(itineraryResult.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this trip.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tripId]);

  const saveTrip = async (payload) => {
    try {
      const updated = await tripApi.update(tripId, payload);
      setTrip(updated.data);
      setEditing(false);
      toast.success('Trip settings updated');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to update trip.';
      setError(msg);
      toast.error(msg);
    }
  };

  const addDay = async (event) => {
    event.preventDefault();
    try {
      const result = await itineraryApi.createDay(tripId, {
        ...dayForm,
        dayNumber: Number(dayForm.dayNumber)
      });
      setDays((current) => [...current, { ...result.data, activities: result.data.activities || [] }]);
      setDayForm({ dayNumber: '', date: '', notes: '' });
      toast.success('Itinerary day added');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to add itinerary day.';
      setError(msg);
      toast.error(msg);
    }
  };

  const deleteDay = async (dayId) => {
    try {
      await itineraryApi.removeDay(tripId, dayId);
      setDays((current) => current.filter((day) => day.id !== dayId));
      toast.success('Itinerary day removed');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to remove itinerary day.';
      setError(msg);
      toast.error(msg);
    }
  };

  const isOngoing = trip?.status === 'ONGOING';

  return (
    <AnimatedPage>
      {/* STICKY MINI-HEADER ON SCROLL */}
      <AnimatePresence>
        {showStickyHeader && trip && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-30 bg-slate-950/90 light:bg-white/90 backdrop-blur-xl border-b border-slate-800 light:border-slate-200 py-3 shadow-lg"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-extrabold text-white light:text-slate-900 truncate">{trip.title}</h3>
                  <p className="text-[11px] text-slate-400 light:text-slate-500 truncate">{trip.destination}</p>
                </div>
                <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  isOngoing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  {trip.status || 'PLANNING'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link className="secondary-button text-[11px] py-1.5 px-3 flex items-center gap-1" to={`/trips/${tripId}/budget`}>
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Budget</span>
                </Link>
                <Link className="secondary-button text-[11px] py-1.5 px-3 flex items-center gap-1" to={`/trips/${tripId}/groups`}>
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Chat</span>
                </Link>
                <button
                  className="primary-button text-[11px] py-1.5 px-3 flex items-center gap-1"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setEditing(true);
                  }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageShell
        title={trip?.title || 'Trip Details'}
        subtitle={trip ? `${trip.destination} · ${trip.startDate} to ${trip.endDate}` : ''}
        action={
          trip && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link className="secondary-button text-xs flex items-center gap-1.5" to={`/trips/${tripId}/budget`}>
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Budget</span>
              </Link>

              <Link className="secondary-button text-xs flex items-center gap-1.5" to={`/trips/${tripId}/groups`}>
                <Users className="w-4 h-4 text-purple-400" />
                <span>Group Chat</span>
              </Link>

              <button
                className="secondary-button text-xs flex items-center gap-1.5"
                onClick={() => setEditing((value) => !value)}
              >
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>{editing ? 'Close Editor' : 'Edit Trip'}</span>
              </button>
            </div>
          )
        }
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs text-rose-400 hover:text-white">Dismiss</button>
          </div>
        )}

        <MorphTransition
          loading={loading}
          skeleton={<SkeletonCard className="h-64" />}
        >
          {!trip ? (
            <EmptyState title="Unable to load trip" description={error || "This trip does not exist or was deleted."} />
          ) : (
            <>
              {/* EDIT MODAL/CARD */}
              {editing && (
                <div className="glass-card p-6 sm:p-8 mb-8 border-indigo-500/40 shadow-glow-indigo">
                  <h2 className="text-xl font-bold text-white light:text-slate-900 mb-6 pb-3 border-b border-slate-800 light:border-slate-200">
                    Edit Trip Settings
                  </h2>
                  <TripForm initialValues={trip} onSubmit={saveTrip} onCancel={() => setEditing(false)} submitLabel="Update Trip" />
                </div>
              )}

              {/* HEADER METRICS GRID */}
              <div className="mb-8 grid gap-5 md:grid-cols-3">
                <div className="glass-card p-6 md:col-span-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 light:text-indigo-600 mb-2 block">
                      Trip Overview & Notes
                    </span>
                    <p className="text-sm leading-relaxed text-slate-300 light:text-slate-700">
                      {trip.description || 'No overview notes added yet. Click "Edit Trip" above to add context, accommodation links, or flights.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/80 light:border-slate-200 flex items-center gap-4 text-xs text-slate-400 light:text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {trip.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {trip.startDate} — {trip.endDate}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 light:text-slate-500">Target Budget</span>
                    <p className="mt-2 text-4xl font-black text-white light:text-slate-900">
                      {trip.totalBudget ? `$${trip.totalBudget.toLocaleString()}` : 'Not Set'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isOngoing
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      Status: {trip.status || 'PLANNING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ITINERARY BUILDER SECTION */}
              <section className="glass-card p-6 sm:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 light:border-slate-200 pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 light:text-indigo-600">Day-by-Day Planning</p>
                    <h2 className="text-2xl font-extrabold text-white light:text-slate-900">Itinerary Timeline</h2>
                  </div>
                  <span className="text-xs text-slate-400 light:text-slate-600 bg-slate-950 light:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-800 light:border-slate-200">
                    {days.length} Day{days.length !== 1 ? 's' : ''} Planned
                  </span>
                </div>

                {/* Inline Add Day Form */}
                <form
                  onSubmit={addDay}
                  className="mb-8 grid gap-3 rounded-2xl bg-slate-950/70 light:bg-slate-100/70 p-4 border border-slate-800 light:border-slate-200 md:grid-cols-[100px_170px_1fr_auto] items-end"
                >
                  <div className="field">
                    <label className="text-[11px] font-semibold text-slate-400 light:text-slate-600 uppercase">Day #</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Day"
                      value={dayForm.dayNumber}
                      onChange={(e) => setDayForm({ ...dayForm, dayNumber: e.target.value })}
                      required
                      className="py-2.5 text-xs"
                    />
                  </div>

                  <div className="field">
                    <label className="text-[11px] font-semibold text-slate-400 light:text-slate-600 uppercase">Date</label>
                    <input
                      type="date"
                      value={dayForm.date}
                      onChange={(e) => setDayForm({ ...dayForm, date: e.target.value })}
                      required
                      className="py-2.5 text-xs"
                    />
                  </div>

                  <div className="field">
                    <label className="text-[11px] font-semibold text-slate-400 light:text-slate-600 uppercase">Day Focus / Notes</label>
                    <input
                      placeholder="e.g. Arrive in Tokyo & check into hotel"
                      value={dayForm.notes}
                      onChange={(e) => setDayForm({ ...dayForm, notes: e.target.value })}
                      className="py-2.5 text-xs"
                    />
                  </div>

                  <button className="primary-button py-2.5 text-xs flex items-center justify-center gap-1.5 whitespace-nowrap" type="submit">
                    <Plus className="w-4 h-4" />
                    <span>Add Day</span>
                  </button>
                </form>

                {/* Days List */}
                <div className="space-y-4">
                  {days.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title="No days in itinerary yet"
                      description="Use the form above to add Day 1 of your trip plan."
                    />
                  ) : (
                    days.map((day) => (
                      <div
                        key={day.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800/80 light:border-slate-200 bg-slate-950/50 light:bg-slate-50/50 hover:border-indigo-500/40 transition group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-sm shrink-0">
                            D{day.dayNumber}
                          </div>
                          <div>
                            <h3 className="font-bold text-white light:text-slate-900 text-base flex items-center gap-2">
                              <span>Day {day.dayNumber}</span>
                              <span className="text-xs text-slate-400 light:text-slate-500 font-normal">({day.date})</span>
                            </h3>
                            <p className="mt-1 text-xs text-slate-400 light:text-slate-600">{day.notes || 'No specific focus defined'}</p>
                            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 light:text-cyan-600">
                              <Sparkles className="w-3 h-3" />
                              <span>{day.activities?.length || 0} activities scheduled</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Link
                            to={`/trips/${tripId}/itinerary/${day.id}`}
                            className="primary-button py-2 px-4 text-xs flex items-center gap-1"
                          >
                            <span>Timeline & Activities</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => deleteDay(day.id)}
                            className="p-2 rounded-xl border border-slate-800 light:border-slate-200 bg-slate-950 light:bg-slate-100 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Remove day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </MorphTransition>
      </PageShell>
    </AnimatedPage>
  );
};

export default TripDetail;
