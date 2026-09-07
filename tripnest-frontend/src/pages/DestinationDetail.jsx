import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { destinationApi } from '../utils/destinationApi';
import SkeletonCard from '../components/Skeleton';
import { MapPin, Calendar, ArrowLeft, Plus } from 'lucide-react';

const DestinationDetail = () => {
  const { destinationId } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    destinationApi.get(destinationId)
      .then((result) => setDestination(result.data))
      .finally(() => setLoading(false));
  }, [destinationId]);

  if (loading) {
    return (
      <PageShell title="Loading destination...">
        <SkeletonCard className="h-64" />
      </PageShell>
    );
  }

  if (!destination) {
    return (
      <PageShell title="Destination Not Found">
        <div className="glass-card p-8 text-center text-slate-400">
          Destination details could not be found.
        </div>
      </PageShell>
    );
  }

  return (
    <AnimatedPage>
      <PageShell
        title={destination.name}
        subtitle={`Explore ${destination.name}, ${destination.country}`}
        action={
          <div className="flex gap-3">
            <Link className="secondary-button text-xs flex items-center gap-1.5" to="/destinations">
              <ArrowLeft className="w-4 h-4" />
              <span>All Destinations</span>
            </Link>
            <Link className="primary-button text-xs flex items-center gap-1.5" to="/trips">
              <Plus className="w-4 h-4" />
              <span>Plan Trip Here</span>
            </Link>
          </div>
        }
      >
        <article className="glass-card overflow-hidden p-0 border-slate-800/90">
          {destination.imageUrl ? (
            <div className="relative h-72 sm:h-96 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={destination.imageUrl}
                alt={destination.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-slate-700">
                  {destination.country}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  {destination.name}
                </h2>
              </div>
            </div>
          ) : null}

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between pb-6 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Location: <strong className="text-white">{destination.country}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Best Time to Visit: <strong className="text-indigo-300">{destination.bestTimeToVisit || 'Year-round'}</strong></span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">About this Destination</h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base max-w-4xl">
                {destination.description || 'No detailed description available yet.'}
              </p>
            </div>
          </div>
        </article>
      </PageShell>
    </AnimatedPage>
  );
};

export default DestinationDetail;

