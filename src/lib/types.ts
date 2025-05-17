export type AppStatus = 'blocked' | 'allowed' | 'whitelist';

export interface AppInfo {
  id: string;
  name: string;
  icon: string;
  status: AppStatus;
  category: string;
  lastUsed: string;
  path: string;
  dataUsage: {
    wifi: number;
    mobile: number;
  };
}

export interface Category {
  id: string;
  name: string;
  appCount: number;
}

export interface UsageStats {
  totalBlocked: number;
  totalSaved: { 
    data: number;
    bandwidth: number; 
  };
  adsBlocked: number;
  appStats: Array<{
    appId: string;
    blockedCount: number;
    dataSaved: number;
  }>;
}