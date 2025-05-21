import { create } from 'zustand';

interface AdBlockRule {
  id: string;
  pattern: string;
  isEnabled: boolean;
  isCustom: boolean;
  category: 'ads' | 'trackers' | 'malware' | 'custom';
  description?: string;
  hitCount: number;
  lastHit?: Date;
}

interface AdBlockStats {
  totalBlocked: number;
  lastUpdated: Date;
  topDomains: Array<{ domain: string; count: number }>;
  categoryCounts: Record<AdBlockRule['category'], number>;
}

// Default rules for common ad networks and trackers
const defaultRules: AdBlockRule[] = [
  {
    id: 'ads-1',
    pattern: '*://*.doubleclick.net/*',
    isEnabled: true,
    isCustom: false,
    category: 'ads',
    description: 'Google DoubleClick ads',
    hitCount: 0
  },
  {
    id: 'ads-2',
    pattern: '*://*.googlesyndication.com/*',
    isEnabled: true,
    isCustom: false,
    category: 'ads',
    description: 'Google Syndication ads',
    hitCount: 0
  },
  {
    id: 'tracker-1',
    pattern: '*://*.google-analytics.com/*',
    isEnabled: true,
    isCustom: false,
    category: 'trackers',
    description: 'Google Analytics tracking',
    hitCount: 0
  },
  {
    id: 'malware-1',
    pattern: '*://*.malware-domain.com/*',
    isEnabled: true,
    isCustom: false,
    category: 'malware',
    description: 'Known malware domains',
    hitCount: 0
  }
];

interface AdBlockStore {
  isEnabled: boolean;
  rules: AdBlockRule[];
  stats: AdBlockStats;
  toggleEnabled: () => void;
  addRule: (rule: Omit<AdBlockRule, 'id' | 'hitCount'>) => void;
  removeRule: (id: string) => void;
  toggleRule: (id: string) => void;
  updateStats: (domain: string) => void;
}

export const useAdBlockStore = create<AdBlockStore>((set) => ({
  isEnabled: true,
  rules: defaultRules,
  stats: {
    totalBlocked: 0,
    lastUpdated: new Date(),
    topDomains: [],
    categoryCounts: {
      ads: 0,
      trackers: 0,
      malware: 0,
      custom: 0
    }
  },

  toggleEnabled: () => set((state) => ({ isEnabled: !state.isEnabled })),

  addRule: (rule) => set((state) => ({
    rules: [...state.rules, { ...rule, id: `custom-${Date.now()}`, hitCount: 0 }]
  })),

  removeRule: (id) => set((state) => ({
    rules: state.rules.filter(rule => rule.id !== id)
  })),

  toggleRule: (id) => set((state) => ({
    rules: state.rules.map(rule =>
      rule.id === id ? { ...rule, isEnabled: !rule.isEnabled } : rule
    )
  })),

  updateStats: (domain) => set((state) => {
    const newStats = { ...state.stats };
    newStats.totalBlocked++;
    newStats.lastUpdated = new Date();

    // Update top domains
    const domainIndex = newStats.topDomains.findIndex(d => d.domain === domain);
    if (domainIndex >= 0) {
      newStats.topDomains[domainIndex].count++;
    } else {
      newStats.topDomains.push({ domain, count: 1 });
    }
    newStats.topDomains.sort((a, b) => b.count - a.count);
    if (newStats.topDomains.length > 10) {
      newStats.topDomains.length = 10;
    }

    // Update rules hit count
    const rules = state.rules.map(rule => {
      if (rule.isEnabled && domain.match(rule.pattern)) {
        return {
          ...rule,
          hitCount: rule.hitCount + 1,
          lastHit: new Date()
        };
      }
      return rule;
    });

    // Update category counts
    const categoryCounts = { ...newStats.categoryCounts };
    rules.forEach(rule => {
      if (rule.isEnabled && domain.match(rule.pattern)) {
        categoryCounts[rule.category]++;
      }
    });

    return { stats: newStats, rules };
  })
}));