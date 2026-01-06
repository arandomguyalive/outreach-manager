import React from 'react';
import type { FilterState } from '../types';
import { Search, X } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  options: {
    categories: string[];
    platforms: string[];
    tiers: string[];
  };
}

export const Filters: React.FC<FiltersProps> = ({ filters, setFilters, options }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      platform: 'All',
      tier: 'All',
      status: 'All'
    });
  };

  const hasActiveFilters = filters.category !== 'All' || filters.platform !== 'All' || filters.tier !== 'All' || filters.status !== 'All' || filters.search !== '';

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or handle..."
          className="w-full bg-km18-card border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-km18-cyan focus:ring-1 focus:ring-km18-cyan transition-all"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        <select
          className="bg-km18-card border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-km18-cyan"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="All">Status: All</option>
          <option value="New">New</option>
          <option value="Sent">Sent</option>
          <option value="Delivered">Delivered</option>
          <option value="Opened">Opened</option>
          <option value="Viewed">Viewed</option>
          <option value="Replied">Replied</option>
          <option value="Bounced">Bounced</option>
        </select>

        <select
          className="bg-km18-card border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-km18-cyan"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="All">Category: All</option>
          {options.categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="bg-km18-card border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-km18-cyan"
          value={filters.tier}
          onChange={(e) => handleChange('tier', e.target.value)}
        >
          <option value="All">Tier: All</option>
          {options.tiers.map(tier => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 bg-red-900/20 text-red-400 rounded-lg text-sm hover:bg-red-900/40 transition-colors whitespace-nowrap"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};