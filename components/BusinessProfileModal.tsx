
import * as React from 'react';
import { X, Save, Building2, ArrowRight } from 'lucide-react';
import { BusinessProfile } from '../types';
import { INDUSTRY_BENCHMARKS } from '../constants';

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: Omit<BusinessProfile, 'id'>) => void;
}

const BusinessProfileModal: React.FunctionComponent<BusinessProfileModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = React.useState('');
  const [industry, setIndustry] = React.useState('Technology');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a business name.");
      return;
    }
    onSave({ name, industry });
    onClose();
    setName('');
    setIndustry('Technology');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-noble-blue" />
            Create New Business Profile
          </h3>
          <button onClick={onClose} aria-label="Close modal" className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase">Business Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g., SaaS Innovations Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase">Industry Sector</label>
              <select 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue"
              >
                {Object.keys(INDUSTRY_BENCHMARKS).map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500">This determines the benchmarks your business will be compared against.</p>
            </div>
          </div>

          <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-noble-blue hover:bg-noble-blue/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-noble-blue/20 flex items-center gap-2 transition-all"
            >
              Create & Add Data <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfileModal;
