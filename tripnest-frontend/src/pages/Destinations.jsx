import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { destinationApi } from '../utils/destinationApi';
import { SkeletonGrid } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import MorphTransition from '../components/MorphTransition';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Search, Compass, Sparkles, Calendar, ArrowRight } from 'lucide-react';

const DEFAULT_DESTINATION_IMAGES = [
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80',
];

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce search input by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    destinationApi.list()
      .then((result) => setDestinations(result.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load destinations.'))
      .finally(() => setLoading(false));
  }, []);

  const visible = destinations.filter((d) =>
    `${d.name} ${d.country}`.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <AnimatedPage>
      <PageShell
        title="Discover Hotspots"
        subtitle="Find inspiring locations, travel guides, and top spots for your next adventure."
        action={
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 rounded-xl text-xs text-white light:text-slate-900 placeholder-slate-500 outline-none focus:border-indigo-500 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city, region or country..."
            />
          </div>
        }
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        <MorphTransition
          loading={loading}
          skeleton={<SkeletonGrid count={6} />}
        >
          {visible.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No destinations found"
              description={search ? "Try searching with a different location query." : "No curated destinations in catalogue."}
            />
          ) : (
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {visible.map((destination, idx) => {
                  const img = destination.imageUrl || DEFAULT_DESTINATION_IMAGES[idx % DEFAULT_DESTINATION_IMAGES.length];
                  return (
                    <motion.div
                      layout
                      key={destination.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Link
                        to={`/destinations/${destination.id}`}
                        className="glass-card group overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-indigo"
                      >
                        <div>
                          {/* Card Thumbnail */}
                          <div className="relative h-48 overflow-hidden bg-slate-950">
                            <img
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                              src={img}
                              alt={destination.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-slate-700">
                              {destination.country}
                            </span>

                            {destination.isPopular && (
                              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Popular</span>
                              </span>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="p-5">
                            <h3 className="text-xl font-extrabold text-white light:text-slate-900 group-hover:text-indigo-400 transition">
                              {destination.name}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                              {destination.description || 'Explore local landmarks, cuisine, and day tours.'}
                            </p>

                            {destination.bestTimeToVisit && (
                              <div className="mt-4 pt-3 border-t border-slate-800/80 light:border-slate-200 flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-500">
                                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Best time: <strong className="text-slate-200 light:text-slate-800">{destination.bestTimeToVisit}</strong></span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center justify-between text-xs font-semibold text-indigo-400 light:text-indigo-600 group-hover:text-indigo-300">
                          <span>Explore Destination Guide</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </MorphTransition>
      </PageShell>
    </AnimatedPage>
  );
};

export default Destinations;
