import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import AppList from '../components/common/AppList';
import Button from '../components/ui/Button';
import { useAppStore } from '../store/store';
import { Plus, Shield } from 'lucide-react';

export function Whitelist() {
  const { apps, toggleAppStatus, removeFromWhitelist } = useAppStore();
  const navigate = useNavigate();
  
  const whitelistedApps = apps.filter(app => app.status === 'whitelist');

  return (
    <PageContainer
      title="Whitelist"
      description="Applications that always have internet access"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-secondary-600">
            Whitelisted apps will always be allowed to access the internet, regardless of other settings.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/whitelist/add')}
        >
          Add App
        </Button>
      </div>
      
      <AppList
        apps={whitelistedApps}
        onToggleStatus={removeFromWhitelist}
        onAppClick={(appId) => navigate(`/apps/${appId}`)}
        emptyMessage="No applications are whitelisted."
      />
    </PageContainer>
  );
}

export default Whitelist;