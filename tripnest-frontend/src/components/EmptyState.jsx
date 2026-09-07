import { Compass } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Compass, 
  title = "No data found", 
  description = "Get started by creating your first item.", 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/30 backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-glow-indigo">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
