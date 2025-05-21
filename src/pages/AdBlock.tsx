import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Shield } from 'lucide-react';
import { useAdBlockStore } from '../services/adBlockService';
import Switch from '../components/ui/Switch';
import AdBlockStats from '../components/adblock/AdBlockStats';
import AdBlockRules from '../components/adblock/AdBlockRules';

export function AdBlock() {
  const { isEnabled, toggleEnabled, stats } = useAdBlockStore();

  return (
    <PageContainer
      title="Ad Blocker"
      description="Block ads and trackers across applications"
    >
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary-500" />
            <h2 className="ml-2 text-xl font-semibold text-secondary-900">Ad Blocker</h2>
          </div>
          <Switch
            checked={isEnabled}
            onChange={toggleEnabled}
            size="lg"
            color="primary"
          />
        </div>
        
        <p className="text-secondary-600 mb-4">
          Block unwanted ads and trackers to improve privacy and enhance your browsing experience.
          {isEnabled ? ' Currently active and protecting your device.' : ' Currently disabled.'}
        </p>
        
        <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-900">
                Total Blocked
              </p>
              <p className="mt-1 text-2xl font-bold text-primary-500">
                {stats.totalBlocked.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-secondary-900">
                Last Updated
              </p>
              <p className="mt-1 text-sm text-secondary-500">
                {stats.lastUpdated.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Statistics</h2>
          <AdBlockStats />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Blocking Rules</h2>
          <AdBlockRules />
        </section>
      </div>
    </PageContainer>
  );
}

export default AdBlock;