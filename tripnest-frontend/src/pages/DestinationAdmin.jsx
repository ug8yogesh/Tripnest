import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { destinationApi } from '../utils/destinationApi';
import { Shield, Check, Edit2, Trash2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = { name: '', country: '', description: '', imageUrl: '', bestTimeToVisit: '', isPopular: false };

const DestinationAdmin = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') {
      destinationApi.list()
        .then((result) => setItems(result.data || []))
        .catch((err) => setError(err.response?.data?.message || 'Unable to load destinations.'));
    }
  }, [user]);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN')) {
    return <Navigate to="/destinations" replace />;
  }

  const save = async (event) => {
    event.preventDefault();
    try {
      const result = editingId
        ? await destinationApi.update(editingId, form)
        : await destinationApi.create(form);

      setItems((current) =>
        editingId ? current.map((item) => (item.id === editingId ? result.data : item)) : [...current, result.data]
      );
      toast.success(editingId ? 'Destination updated!' : 'Destination created!');
      setForm(empty);
      setEditingId(null);
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to save destination.';
      setError(msg);
      toast.error(msg);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this destination from public catalogue?')) return;
    try {
      await destinationApi.remove(id);
      setItems((current) => current.filter((item) => item.id !== id));
      toast.success('Destination removed from catalogue');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to delete destination.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <AnimatedPage>
      <PageShell
        title="Destination Catalogue Admin"
        subtitle="Manage global travel destinations, images, and popular featured tags."
      >
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Admin Form */}
        <form className="lg:col-span-5 glass-card p-6 sm:p-8 space-y-4" onSubmit={save}>
          <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>{editingId ? 'Edit Destination' : 'Add New Destination'}</span>
          </h2>

          {['name', 'country', 'imageUrl', 'bestTimeToVisit'].map((key) => (
            <label className="field" key={key}>
              <span className="text-xs uppercase text-slate-400 font-semibold">{key}</span>
              <input
                value={form[key] || ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={key === 'name' || key === 'country'}
                placeholder={`Enter ${key}...`}
              />
            </label>
          ))}

          <label className="field">
            <span className="text-xs uppercase text-slate-400 font-semibold">Description</span>
            <textarea
              rows="4"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Highlight landmarks, attractions, and local experiences..."
            />
          </label>

          <label className="flex items-center gap-3 text-xs font-semibold text-slate-300 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPopular || false}
              onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
              className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
            />
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Feature as Popular Hotspot</span>
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button className="primary-button flex-1 py-3 text-sm flex items-center justify-center gap-2" type="submit">
              <Check className="w-4 h-4" />
              <span>{editingId ? 'Update Record' : 'Create Record'}</span>
            </button>
            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={() => { setEditingId(null); setForm(empty); }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Catalogue Listing */}
        <section className="lg:col-span-7 glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Destination Catalogue</h2>
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              {items.length} Entries
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/40 transition group"
                key={item.id}
              >
                <div className="flex items-center gap-3.5">
                  {item.imageUrl ? (
                    <img className="w-12 h-12 rounded-xl object-cover" src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs">
                      No Img
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                      {item.name}, {item.country}
                    </h4>
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-0.5 ${
                      item.isPopular ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {item.isPopular ? 'Featured Popular' : 'Standard Catalogue'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    onClick={() => { setEditingId(item.id); setForm({ ...item, isPopular: Boolean(item.isPopular) }); }}
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    onClick={() => remove(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  </AnimatedPage>
  );
};

export default DestinationAdmin;

