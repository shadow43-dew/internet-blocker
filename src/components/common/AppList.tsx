import React, { useState } from 'react';
import { Search } from 'lucide-react';
import AppCard from './AppCard';
import { AppInfo } from '../../lib/types';

interface AppListProps {
  apps: AppInfo[];
  onToggleStatus: (appId: string) => void;
  onAppClick?: (appId: string) => void;
  showSearch?: boolean;
  emptyMessage?: string;
}

export function AppList({
  apps,
  onToggleStatus,
  onAppClick,
  showSearch = true,
  emptyMessage = 'No applications found.',
}: AppListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredApps = searchQuery
    ? apps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : apps;

  return (
    <div>
      {showSearch && (
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      
      {filteredApps.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-secondary-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onToggleStatus={onToggleStatus}
              onClick={onAppClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AppList;