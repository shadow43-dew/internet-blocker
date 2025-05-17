import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import StatusOverview from '../components/dashboard/StatusOverview';
import AppList from '../components/common/AppList';
import { useAppStore } from '../store/store';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart2 } from 'lucide-react';

export function Dashboard() {
  const { apps, toggleAppStatus } = useAppStore();
  const navigate = useNavigate();

  // Top apps by data usage
  const topApps = [...apps]
    .sort((a, b) => (b.dataUsage.wifi + b.dataUsage.mobile) - (a.dataUsage.wifi + a.dataUsage.mobile))
    .slice(0, 6);

  return (
    <PageContainer
      title="Dashboard"
      description="Monitor and control your internet usage"
    >
      <StatusOverview />
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-secondary-900">Top Data Usage</h2>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            icon={<BarChart2 size={16} />}
            onClick={() => navigate('/stats')}
          >
            View Stats
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/apps')}
          >
            Manage Apps
          </Button>
        </div>
      </div>
      
      <AppList
        apps={topApps}
        onToggleStatus={toggleAppStatus}
        onAppClick={(appId) => navigate(`/apps/${appId}`)}
        showSearch={false}
        emptyMessage="No apps have been monitored yet."
      />
    </PageContainer>
  );
}

export default Dashboard;