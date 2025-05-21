import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppInfo, AppStatus, Category, UsageStats, SystemSettings, ThemeSettings } from '../lib/types';
import { getInstalledApps, getRunningProcesses } from '../services/systemService';
import { getStatisticsOverview } from '../services/statsService';
import { blockApp, unblockApp, addToWhitelist as addToWhitelistApi, removeFromWhitelist as removeFromWhitelistApi } from '../services/api';

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
  addToWhitelist: (appId: string, newApp?: AppInfo) => void;
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
      apps: [],
      categories: [],
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
        
        if (newStatus === 'blocked') {
          await blockApp(app);
        } else {
          await unblockApp(app);
        }
        
        set(state => ({
          apps: state.apps.map(a => 
            a.id === appId ? { ...a, status: newStatus } : a
          ),
        }));

        await get().refreshStats();
      },

      toggleAdBlock: () => {
        set(state => ({ adBlockEnabled: !state.adBlockEnabled }));
      },

      toggleMasterBlock: async () => {
        const currentState = get().masterBlockEnabled;
        const newState = !currentState;
        
        set({ masterBlockEnabled: newState });
        
        // Update all non-whitelisted apps based on master block state
        const apps = get().apps.map(app => {
          if (app.status === 'whitelist') return app;
          
          if (newState) {
            return { ...app, status: 'blocked' };
          } else {
            return { ...app, status: 'allowed' };
          }
        });
        
        set({ apps });
        
        // Update all apps in the backend
        await Promise.all(
          apps.map(app => {
            if (app.status === 'blocked') {
              return blockApp(app);
            } else if (app.status === 'allowed') {
              return unblockApp(app);
            }
            return Promise.resolve();
          })
        );
        
        await get().refreshStats();
      },

      addToWhitelist: async (appId: string, newApp?: AppInfo) => {
        let app = get().apps.find(a => a.id === appId);
        
        if (!app && newApp) {
          app = newApp;
          // Add the new app to the apps list
          set(state => ({
            apps: [...state.apps, newApp],
            categories: state.categories.map(cat => 
              cat.name === newApp.category
                ? { ...cat, appCount: cat.appCount + 1 }
                : cat
            )
          }));
        }
        
        if (!app) return;

        const success = await addToWhitelistApi(app);
        if (success) {
          set(state => ({
            apps: state.apps.map(a => {
              if (a.id === appId) {
                return { ...a, status: 'whitelist' };
              }
              return a;
            }),
          }));
        }
      },

      removeFromWhitelist: async (appId: string) => {
        const app = get().apps.find(a => a.id === appId);
        if (!app) return;

        const success = await removeFromWhitelistApi(app);
        if (success) {
          set(state => ({
            apps: state.apps.map(a => {
              if (a.id === appId && a.status === 'whitelist') {
                return { ...a, status: get().masterBlockEnabled ? 'blocked' : 'allowed' };
              }
              return a;
            }),
          }));
        }
      },

      blockApp: async (appId: string) => {
        const app = get().apps.find(a => a.id === appId);
        if (!app) return;

        const success = await blockApp(app);
        if (success) {
          set(state => ({
            apps: state.apps.map(a => {
              if (a.id === appId) {
                return { ...a, status: 'blocked' };
              }
              return a;
            }),
          }));
        }

        await get().refreshStats();
      },

      unblockApp: async (appId: string) => {
        const app = get().apps.find(a => a.id === appId);
        if (!app) return;

        const success = await unblockApp(app);
        if (success) {
          set(state => ({
            apps: state.apps.map(a => {
              if (a.id === appId && a.status === 'blocked') {
                return { ...a, status: 'allowed' };
              }
              return a;
            }),
          }));
        }
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

          const allApps = [...installedApps, ...runningProcesses];
          
          // Create categories based on actual apps
          const categoryMap = new Map<string, number>();
          allApps.forEach(app => {
            const count = categoryMap.get(app.category) || 0;
            categoryMap.set(app.category, count + 1);
          });

          const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
            id: name.toLowerCase(),
            name,
            appCount: count,
          }));

          set({ 
            apps: allApps,
            categories 
          });
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