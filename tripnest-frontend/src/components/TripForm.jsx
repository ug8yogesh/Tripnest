import { useState } from 'react';
import { MapPin, Calendar, DollarSign, Tag, FileText, Check } from 'lucide-react';

const initialForm = {
  title: '', destination: '', startDate: '', endDate: '', totalBudget: '', description: '', status: 'PLANNING',
};

const TripForm = ({ initialValues = initialForm, onSubmit, submitLabel = 'Save trip', onCancel }) => {
  const [form, setForm] = useState({ ...initialForm, ...initialValues, totalBudget: initialValues.totalBudget ?? '' });
  
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  
  const submit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, totalBudget: form.totalBudget === '' ? null : Number(form.totalBudget) });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
            <Tag className="w-3.5 h-3.5 text-indigo-400" /> Trip Title
          </span>
          <input 
            name="title" 
            value={form.title} 
            onChange={update} 
            required 
            placeholder="e.g. Summer Vacation in Bali" 
          />
        </label>

        <label className="field">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Destination
          </span>
          <input 
            name="destination" 
            value={form.destination} 
            onChange={update} 
            required 
            placeholder="e.g. Bali, Indonesia" 
          />
        </label>

        <label className="field">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Start Date
          </span>
          <input 
            type="date" 
            name="startDate" 
            value={form.startDate || ''} 
            onChange={update} 
            required 
          />
        </label>

        <label className="field">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> End Date
          </span>
          <input 
            type="date" 
            name="endDate" 
            value={form.endDate || ''} 
            onChange={update} 
            required 
          />
        </label>

        <label className="field">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> Target Budget ($)
          </span>
          <input 
            type="number" 
            min="0" 
            step="0.01" 
            name="totalBudget" 
            value={form.totalBudget} 
            onChange={update} 
            placeholder="2500" 
          />
        </label>

        <label className="field">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Status
          </span>
          <select name="status" value={form.status || 'PLANNING'} onChange={update}>
            <option value="PLANNING">Planning</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
          <FileText className="w-3.5 h-3.5 text-indigo-400" /> Notes & Overview
        </span>
        <textarea 
          name="description" 
          value={form.description || ''} 
          onChange={update} 
          rows="3" 
          placeholder="Flight details, hotel references, or key goals..." 
        />
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button className="primary-button flex items-center gap-2" type="submit">
          <Check className="w-4 h-4" />
          <span>{submitLabel}</span>
        </button>
        {onCancel && (
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TripForm;

