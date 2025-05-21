import React from 'react';
import { Shield, Zap, Ban, AlertTriangle } from 'lucide-react';
import { useAdBlockStore } from '../../services/adBlockService';
import { formatNumber } from '../../lib/utils';

export function AdBlockStats() {
  const { stats } = useAdBlockStore();

  const categories = [
    { 
      name: 'Ads', 
      count: stats.categoryCounts.ads,
      icon: Ban,
      color: 'text-danger-500',
      bgColor: 'bg-danger-100' 
    },
    { 
      name: 'Trackers', 
      count: stats.categoryCounts.trackers,
      icon: Zap,
      color: 'text-warning-500',
      bgColor: 'bg-warning-100'
    },
    { 
      name: 'Malware', 
      count: stats.categoryCounts.malware,
      icon: AlertTriangle,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100'
    },
    { 
      name: 'Custom', 
      count: stats.categoryCounts.custom,
      icon: Shield,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.name} className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <Icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-secondary-900">{category.name}</h3>
                  <p className="mt-1 text-2xl font-semibold text-secondary-900">
                    {formatNumber(category.count)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Top Blocked Domains</h3>
        <div className="space-y-4">
          {stats.topDomains.map((domain) => (
            <div key={domain.domain} className="flex items-center">
              <div className="flex-1">
                <div className="text-sm font-medium text-secondary-900">{domain.domain}</div>
                <div className="mt-1 text-xs text-secondary-500">
                  Blocked {formatNumber(domain.count)} times
                </div>
              </div>
              <div className="ml-4">
                <div className="w-32 h-2 bg-secondary-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{
                      width: `${(domain.count / stats.topDomains[0].count) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}