import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import { useAppStore } from '../store/store';
import AppList from '../components/common/AppList';

export function AddToWhitelist() {
  const { apps, addToWhitelist } = useAppStore();
  const navigate = useNavigate();
  
  // Filter out already whitelisted apps
  const availableApps = apps.filter(app => app.status !== 'whitelist');
  
  const handleAddToWhitelist = (appId: string) => {
    addToWhitelist(appId);
  };

  return (
    <PageContainer
      title="Add to Whitelist"
      description="Select apps to always allow internet access"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/whitelist')}
        >
          Back to Whitelist
        </Button>
      </div>
      
      <div className="bg-primary-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Shield className="h-5 w-5 text-primary-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-primary-800">Add Apps to Whitelist</h3>
            <p className="mt-1 text-sm text-primary-700">
              Whitelisted apps will always have internet access, even when general blocking is enabled.
              Toggle the switch to add an app to the whitelist.
            </p>
          </div>
        </div>
      </div>
      
      <AppList
        apps={availableApps}
        onToggleStatus={handleAddToWhitelist}
        onAppClick={(appId) => navigate(`/apps/${appId}`)}
        emptyMessage="All apps are already whitelisted."
      />
    </PageContainer>
  );
}

export default AddToWhitelist;