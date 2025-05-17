import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ban } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import { useAppStore } from '../store/store';
import AppList from '../components/common/AppList';

export function BlockApp() {
  const { apps, blockApp } = useAppStore();
  const navigate = useNavigate();
  
  // Filter out already blocked apps
  const availableApps = apps.filter(app => app.status !== 'blocked');
  
  const handleBlockApp = (appId: string) => {
    blockApp(appId);
  };

  return (
    <PageContainer
      title="Block Applications"
      description="Select apps to block internet access"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/apps')}
        >
          Back to Apps
        </Button>
      </div>
      
      <div className="bg-danger-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Ban className="h-5 w-5 text-danger-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Block Internet Access</h3>
            <p className="mt-1 text-sm text-danger-700">
              Blocked apps will not be able to access the internet. 
              Toggle the switch to block an app from connecting to the internet.
            </p>
          </div>
        </div>
      </div>
      
      <AppList
        apps={availableApps}
        onToggleStatus={handleBlockApp}
        onAppClick={(appId) => navigate(`/apps/${appId}`)}
        emptyMessage="All apps are already blocked."
      />
    </PageContainer>
  );
}

export default BlockApp;