import { create } from 'zustand';
import { generateRandomAppList } from '../lib/utils';
import { AppInfo, AppStatus, Category, UsageStats } from '../lib/types';

interface AppState {
  apps: AppInfo[];
  categories: Category[];
  stats: UsageStats;
  adBlockEnabled: boolean;
  masterBlockEnabled: boolean;
  
  // Actions
  toggleAppStatus: (appId: string) => void;
  toggleAdBlock: () => void;
  toggleMasterBlock: () => void;
  addToWhitelist: (appId: string) => void;
  removeFromWhitelist: (appId: string) => void;
  blockApp: (appId: string) => void;
  unblockApp: (appId: string) => void;
  getAppsByCategory: (category: string) => AppInfo[];
  getAppById: (appId: string) => AppInfo | undefined;
}

const initialApps = generateRandomAppList(15);

const categoryCounts: Record<string, number> = {};
initialApps.forEach(app => {
  categoryCounts[app.category] = (categoryCounts[app.category] || 0) + 1;
});

const initialCategories: Category[] = Object.keys(categoryCounts).map(name => ({
  id: name.toLowerCase(),
  name,
  appCount: categoryCounts[name],
}));

export const useAppStore = create<AppState>((set, get) => ({
  apps: initialApps,
  categories: initialCategories,
  adBlockEnabled: true,
  masterBlockEnabled: true,
  stats: {
    totalBlocked: 1247,
    totalSaved: {
      data: 456000000, // 456 MB
      bandwidth: 780000000, // 780 MB
    },
    adsBlocked: 3456,
    appStats: initialApps.map(app => ({
      appId: app.id,
      blockedCount: Math.floor(Math.random() * 500),
      dataSaved: Math.floor(Math.random() * 100000000),
    })),
  },

  toggleAppStatus: (appId: string) => {
    set(state => ({
      apps: state.apps.map(app => {
        if (app.id === appId) {
          let newStatus: AppStatus = 'allowed';
          if (app.status === 'allowed') newStatus = 'blocked';
          if (app.status === 'blocked') newStatus = 'allowed';
          if (app.status === 'whitelist') newStatus = 'blocked';
          
          return { ...app, status: newStatus };
        }
        return app;
      }),
    }));
  },

  toggleAdBlock: () => {
    set(state => ({ adBlockEnabled: !state.adBlockEnabled }));
  },

  toggleMasterBlock: () => {
    set(state => ({ masterBlockEnabled: !state.masterBlockEnabled }));
  },

  addToWhitelist: (appId: string) => {
    set(state => ({
      apps: state.apps.map(app => {
        if (app.id === appId) {
          return { ...app, status: 'whitelist' };
        }
        return app;
      }),
    }));
  },

  removeFromWhitelist: (appId: string) => {
    set(state => ({
      apps: state.apps.map(app => {
        if (app.id === appId && app.status === 'whitelist') {
          return { ...app, status: 'allowed' };
        }
        return app;
      }),
    }));
  },

  blockApp: (appId: string) => {
    set(state => ({
      apps: state.apps.map(app => {
        if (app.id === appId) {
          return { ...app, status: 'blocked' };
        }
        return app;
      }),
    }));
  },

  unblockApp: (appId: string) => {
    set(state => ({
      apps: state.apps.map(app => {
        if (app.id === appId && app.status === 'blocked') {
          return { ...app, status: 'allowed' };
        }
        return app;
      }),
    }));
  },

  getAppsByCategory: (category: string) => {
    return get().apps.filter(app => app.category === category);
  },

  getAppById: (appId: string) => {
    return get().apps.find(app => app.id === appId);
  },
}));