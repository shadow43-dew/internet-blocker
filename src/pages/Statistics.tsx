import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useAppStore } from '../store/store';
import { formatBytes } from '../lib/utils';
import * as LucideIcons from 'lucide-react';

export function Statistics() {
  const { apps, stats } = useAppStore();
  const [timeRange, setTimeRange] = useState('week');
  
  // Sort apps by data usage
  const sortedApps = [...apps]
    .sort((a, b) => (b.dataUsage.wifi + b.dataUsage.mobile) - (a.dataUsage.wifi + a.dataUsage.mobile))
    .slice(0, 10);

  return (
    <PageContainer
      title="Statistics"
      description="Detailed usage statistics and savings"
    >
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Overview</h2>
          
          <div className="inline-flex rounded-md shadow-sm">
            {['day', 'week', 'month'].map((range) => (
              <button
                key={range}
                type="button"
                className={`
                  px-4 py-2 text-sm font-medium
                  ${range === 'day' ? 'rounded-l-md' : ''}
                  ${range === 'month' ? 'rounded-r-md' : ''}
                  ${timeRange === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50'}
                  border border-secondary-300
                `}
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary-50">
            <h3 className="text-sm font-medium text-secondary-700">Total Blocked</h3>
            <p className="mt-1 text-2xl font-semibold text-secondary-900">{stats.totalBlocked}</p>
            <p className="mt-1 text-xs text-secondary-500">Connection attempts</p>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary-50">
            <h3 className="text-sm font-medium text-secondary-700">Data Saved</h3>
            <p className="mt-1 text-2xl font-semibold text-secondary-900">
              {formatBytes(stats.totalSaved.data)}
            </p>
            <p className="mt-1 text-xs text-secondary-500">Estimated data usage reduction</p>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary-50">
            <h3 className="text-sm font-medium text-secondary-700">Ads Blocked</h3>
            <p className="mt-1 text-2xl font-semibold text-secondary-900">{stats.adsBlocked}</p>
            <p className="mt-1 text-xs text-secondary-500">Advertisements prevented from loading</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Top Data Usage</h2>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Application
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Data Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Wi-Fi Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Mobile Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {sortedApps.map((app) => {
                const IconComponent = (LucideIcons as Record<string, any>)[app.icon] || LucideIcons.Globe;
                
                const statusColor = {
                  blocked: 'bg-danger-100 text-danger-800',
                  allowed: 'bg-success-100 text-success-800',
                  whitelist: 'bg-primary-100 text-primary-800',
                };
                
                const statusText = {
                  blocked: 'Blocked',
                  allowed: 'Allowed',
                  whitelist: 'Whitelist',
                };
                
                return (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">{app.name}</div>
                          <div className="text-sm text-secondary-500">{app.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {formatBytes(app.dataUsage.wifi + app.dataUsage.mobile)}
                      </div>
                      <div className="w-full h-2 bg-secondary-100 rounded-full mt-1">
                        <div
                          className="h-2 bg-primary-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((app.dataUsage.wifi + app.dataUsage.mobile) / (sortedApps[0].dataUsage.wifi + sortedApps[0].dataUsage.mobile)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[app.status]}`}>
                        {statusText[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {formatBytes(app.dataUsage.wifi)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {formatBytes(app.dataUsage.mobile)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}

export default Statistics;