import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Shield, Zap } from 'lucide-react';
import { useAppStore } from '../store/store';
import Switch from '../components/ui/Switch';
import AdBlockFeatures from '../components/adblock/AdBlockFeatures';

export function AdBlock() {
  const { adBlockEnabled, toggleAdBlock, stats } = useAppStore();

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
            checked={adBlockEnabled}
            onChange={toggleAdBlock}
            size="lg"
            color="primary"
          />
        </div>
        
        <p className="text-secondary-600 mb-4">
          Block unwanted ads in apps and websites to save data, improve privacy, and enhance your experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-900">Ads Blocked</h3>
            <p className="text-2xl font-bold text-primary-500 mt-1">{stats.adsBlocked}</p>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-900">Data Saved</h3>
            <p className="text-2xl font-bold text-success-500 mt-1">47.8 MB</p>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-900">Loading Speed</h3>
            <p className="text-2xl font-bold text-warning-500 mt-1">
              <span className="flex items-center">
                +38% <Zap className="ml-1 h-5 w-5" />
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-secondary-900 mb-4">Ad Blocking Features</h2>
      <AdBlockFeatures />
    </PageContainer>
  );
}

export default AdBlock;