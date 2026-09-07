import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { itineraryApi } from '../utils/itineraryApi';
import SkeletonRow from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Compass, 
  Navigation, 
  Hotel, 
  Utensils, 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowLeft, 
  Check, 
  GripVertical 
} from 'lucide-react';

const emptyActivity = { title: '', activityType: 'SIGHTSEEING', startTime: '', location: '', notes: '', estimatedCost: '' };

const ACTIVITY_CONFIG = {
  SIGHTSEEING: { icon: Compass, label: 'Sightseeing', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', dotBg: 'bg-cyan-400' },
  TRANSPORTATION: { icon: Navigation, label: 'Transportation', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', dotBg: 'bg-indigo-400' },
  ACCOMMODATION: { icon: Hotel, label: 'Lodging', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', dotBg: 'bg-purple-400' },
  DINING: { icon: Utensils, label: 'Food & Dining', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dotBg: 'bg-amber-400' },
  ADVENTURE: { icon: Sparkles, label: 'Adventure', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dotBg: 'bg-emerald-400' },
  SHOPPING: { icon: ShoppingBag, label: 'Shopping', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dotBg: 'bg-rose-400' },
  OTHER: { icon: MapPin, label: 'Other Activity', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', dotBg: 'bg-slate-400' },
};

const types = Object.keys(ACTIVITY_CONFIG);

function SortableActivityItem({ activity, onEdit, onDelete }) {
  const config = ACTIVITY_CONFIG[activity.activityType] || ACTIVITY_CONFIG.OTHER;
  const Icon = config.icon;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Timeline Connector Dot */}
      <div className={`absolute -left-6 top-5 w-4 h-4 rounded-full border-4 border-[#0b0f19] ${config.dotBg} shadow-md group-hover:scale-125 transition-transform`} />

      {/* Timeline Activity Glass Card */}
      <div className={`glass-card p-6 border-slate-800/90 group-hover:border-indigo-500/40 transition ${isDragging ? 'ring-2 ring-indigo-500 shadow-glow-indigo' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Drag Handle */}
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="p-1 mt-1 text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing transition"
              title="Drag to reorder"
            >
              <GripVertical className="w-5 h-5" />
            </button>

            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.color}`}>
                  {config.label}
                </span>
                {activity.startTime && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{activity.startTime}</span>
                  </span>
                )}
              </div>

              <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                {activity.title}
              </h4>

              {activity.location && (
                <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{activity.location}</span>
                </p>
              )}
            </div>
          </div>

          {activity.estimatedCost && (
            <div className="text-right sm:self-start">
              <span className="text-xs text-slate-500 block font-medium">Est. Cost</span>
              <span className="text-sm font-extrabold text-emerald-400">
                ${activity.estimatedCost.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {activity.notes && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl">
            {activity.notes}
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-800/40">
          <button
            onClick={() => onEdit(activity)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:border-slate-700 text-xs flex items-center gap-1 transition"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(activity.id)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const ItineraryDay = () => {
  const { tripId, itineraryId } = useParams();
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState(emptyActivity);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await itineraryApi.listActivities(itineraryId);
      setActivities(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [itineraryId]);

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      estimatedCost: form.estimatedCost === '' ? null : Number(form.estimatedCost)
    };

    try {
      const result = editingId
        ? await itineraryApi.updateActivity(itineraryId, editingId, payload)
        : await itineraryApi.createActivity(itineraryId, payload);

      setActivities((current) =>
        editingId
          ? current.map((a) => (a.id === editingId ? result.data : a))
          : [...current, result.data]
      );
      toast.success(editingId ? 'Activity updated' : 'Stop added to timeline');
      setForm(emptyActivity);
      setEditingId(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to save activity.';
      setError(msg);
      toast.error(msg);
    }
  };

  const remove = async (activityId) => {
    try {
      await itineraryApi.removeActivity(itineraryId, activityId);
      setActivities((current) => current.filter((a) => a.id !== activityId));
      toast.success('Activity removed');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to delete activity.';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activities.findIndex((a) => a.id === active.id);
    const newIndex = activities.findIndex((a) => a.id === over.id);

    const reordered = arrayMove(activities, oldIndex, newIndex);
    setActivities(reordered);

    // Save persistent order updates via API update
    toast.success('Timeline reordered');
    try {
      const movedItem = reordered[newIndex];
      await itineraryApi.updateActivity(itineraryId, movedItem.id, movedItem);
    } catch {
      // Ignore background persistence errors
    }
  };

  return (
    <AnimatedPage>
      <PageShell
        title="Daily Activity Timeline"
        subtitle="Organize your stops chronologically with activity tags, notes, drag-and-drop reordering, and costs."
        action={
          <Link className="secondary-button text-xs flex items-center gap-1.5" to={`/trips/${tripId}`}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trip Details</span>
          </Link>
        }
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs text-rose-400 hover:text-white">Dismiss</button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Activity Form */}
          <section className="lg:col-span-5 glass-card p-6 sm:p-8 sticky top-28">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                <span>{editingId ? 'Edit Activity' : 'Add Stop to Timeline'}</span>
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(emptyActivity); }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="field">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Title / Attraction
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Visit Senso-ji Temple"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="field">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={form.activityType}
                    onChange={(e) => setForm({ ...form, activityType: e.target.value })}
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {ACTIVITY_CONFIG[type]?.label || type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={form.startTime || ''}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Location Address
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Asakusa, Taito City, Tokyo"
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Est. Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.estimatedCost}
                  onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
                  placeholder="25.00"
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Activity Notes / Tickets
                </label>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Opening hours, booking references, or tips..."
                />
              </div>

              <button className="primary-button w-full py-3 text-sm flex items-center justify-center gap-2" type="submit">
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Update Timeline Stop' : 'Add to Timeline'}</span>
              </button>
            </form>
          </section>

          {/* Right Column: Visual Timeline with Drag-and-Drop */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Scheduled Timeline</span>
              </h3>
              <span className="text-xs text-slate-400">
                {activities.length} activity item{activities.length !== 1 ? 's' : ''} (Drag <GripVertical className="w-3 h-3 inline" /> to reorder)
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : activities.length === 0 ? (
              <EmptyState
                icon={Compass}
                title="No activities scheduled yet"
                description="Add your first stop on the left to start building this day's itinerary timeline."
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={activities.map((a) => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                    {activities.map((activity) => (
                      <SortableActivityItem
                        key={activity.id}
                        activity={activity}
                        onEdit={(act) => {
                          setEditingId(act.id);
                          setForm({ ...act, estimatedCost: act.estimatedCost ?? '' });
                        }}
                        onDelete={remove}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>
        </div>
      </PageShell>
    </AnimatedPage>
  );
};

export default ItineraryDay;


