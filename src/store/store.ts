import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateRandomAppList } from '../lib/utils';
import { AppInfo, AppStatus, Category, UsageStats, SystemSettings, ThemeSettings } from '../lib/types';
import { getInstalledApps, getRunningProcesses } from '../services/systemService';
import { getStatisticsOverview, updateAppStats } from '../services/statsService';

interface AppState {
  apps: AppInfo[];
  categories: Category[];
  stats: UsageStats;
  adBlockEnabled: boolean;
  masterBlockEnabled: boolean;
  systemSettings: SystemSettings;
  
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
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  refreshSystemApps: () => Promise<void>;
  refreshStats: () => Promise<void>;
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

const defaultTheme: ThemeSettings = {
  primaryColor: '#1a73e8',
  backgroundColor: '#ffffff',
  textColor: '#202124',
  isDarkMode: false,
};

const defaultSystemSettings: SystemSettings = {
  theme: defaultTheme,
  notifications: true,
  startupOnBoot: true,
  batteryOptimization: true,
  backgroundRunning: true,
  autoUpdate: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      apps: initialApps,
      categories: initialCategories,
      adBlockEnabled: true,
      masterBlockEnabled: true,
      systemSettings: defaultSystemSettings,
      stats: {
        totalBlocked: 0,
        totalSaved: {
          data: 0,
          bandwidth: 0,
        },
        adsBlocked: 0,
        appStats: [],
      },

      refreshStats: async () => {
        const stats = await getStatisticsOverview();
        set({ stats });
      },

      toggleAppStatus: async (appId: string) => {
        const app = get().apps.find(a => a.id === appId);
        if (!app) return;

        const newStatus: AppStatus = app.status === 'blocked' ? 'allowed' : 'blocked';
        
        // Update local state
        set(state => ({
          apps: state.apps.map(a => 
            a.id === appId ? { ...a, status: newStatus } : a
          ),
        }));

        // Update statistics
        await updateAppStats(appId, {
          dataUsageWifi: Math.floor(Math.random() * 1000000),
          dataUsageMobile: Math.floor(Math.random() * 500000),
          connectionsBlocked: newStatus === 'blocked' ? 1 : 0,
        });

        // Refresh stats
        await get().refreshStats();
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

      blockApp: async (appId: string) => {
        set(state => ({
          apps: state.apps.map(app => {
            if (app.id === appId) {
              return { ...app, status: 'blocked' };
            }
            return app;
          }),
        }));

        // Update statistics
        await updateAppStats(appId, {
          dataUsageWifi: 0,
          dataUsageMobile: 0,
          connectionsBlocked: 1,
        });

        // Refresh stats
        await get().refreshStats();
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

      updateTheme: (theme: Partial<ThemeSettings>) => {
        set(state => ({
          systemSettings: {
            ...state.systemSettings,
            theme: {
              ...state.systemSettings.theme,
              ...theme,
            },
          },
        }));
      },

      updateSystemSettings: (settings: Partial<SystemSettings>) => {
        set(state => ({
          systemSettings: {
            ...state.systemSettings,
            ...settings,
          },
        }));
      },

      refreshSystemApps: async () => {
        try {
          const [installedApps, runningProcesses] = await Promise.all([
            getInstalledApps(),
            getRunningProcesses(),
          ]);

          const systemApps = [...installedApps, ...runningProcesses];
          const existingApps = get().apps.filter(app => !app.id.startsWith('sys-') && !app.id.startsWith('proc-'));

          set(state => ({
            apps: [...existingApps, ...systemApps],
            categories: [
              ...state.categories,
              { id: 'system', name: 'System', appCount: installedApps.length },
              { id: 'running', name: 'Running', appCount: runningProcesses.length },
            ],
          }));
        } catch (error) {
          console.error('Error refreshing system apps:', error);
        }
      },
    }),
    {
      name: 'netblocker-storage',
      partialize: (state) => ({
        systemSettings: state.systemSettings,
        adBlockEnabled: state.adBlockEnabled,
        masterBlockEnabled: state.masterBlockEnabled,
      }),
    }
  )
);