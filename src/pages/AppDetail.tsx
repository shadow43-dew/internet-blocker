import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Ban, 
  Wifi, 
  Clock, 
  BarChart
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Switch from '../components/ui/Switch';
import { useAppStore } from '../store/store';
import { formatBytes, formatDate } from '../lib/utils';
import * as LucideIcons from 'lucide-react';

export function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { 
    getAppById, 
    toggleAppStatus, 
    addToWhitelist, 
    removeFromWhitelist, 
    blockApp
  } = useAppStore();
  
  const app = getAppById(appId || '');
  
  if (!app) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-secondary-900">App not found</h2>
          <p className="mt-2 text-secondary-600">The application you're looking for doesn't exist.</p>
          <Button
            className="mt-4"
            onClick={() => navigate('/apps')}
          >
            Back to Apps
          </Button>
        </div>
      </PageContainer>
    );
  }

  // Get icon dynamically
  const IconComponent = (LucideIcons as Record<string, any>)[app.icon] || LucideIcons.Globe;

  const statusLabels = {
    blocked: 'Blocked',
    allowed: 'Allowed',
    whitelist: 'Whitelisted',
  };

  const statusColors = {
    blocked: 'bg-danger-100 text-danger-800',
    allowed: 'bg-success-100 text-success-800',
    whitelist: 'bg-primary-100 text-primary-800',
  };

  return (
    <PageContainer>
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
      
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full">
              <IconComponent className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-secondary-900">{app.name}</h1>
              <p className="text-secondary-600">{app.category}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status]}`}>
              {statusLabels[app.status]}
            </span>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center">
              <Wifi className="h-5 w-5 text-primary-500" />
              <span className="ml-2 text-sm text-secondary-600">Data Usage</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-secondary-900">
              {formatBytes(app.dataUsage.wifi + app.dataUsage.mobile)}
            </p>
          </div>
          
          <div className="p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary-500" />
              <span className="ml-2 text-sm text-secondary-600">Last Used</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-secondary-900">
              {formatDate(app.lastUsed)}
            </p>
          </div>
          
          <div className="p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-primary-500" />
              <span className="ml-2 text-sm text-secondary-600">Wi-Fi Data</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-secondary-900">
              {formatBytes(app.dataUsage.wifi)}
            </p>
          </div>
          
          <div className="p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-primary-500" />
              <span className="ml-2 text-sm text-secondary-600">Mobile Data</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-secondary-900">
              {formatBytes(app.dataUsage.mobile)}
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Internet Access</h2>
          
          <div className="p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Ban className="h-5 w-5 text-danger-500" />
                <span className="ml-2 text-secondary-900 font-medium">Block Internet</span>
              </div>
              <Switch
                checked={app.status !== 'blocked'}
                onChange={() => toggleAppStatus(app.id)}
                color="success"
              />
            </div>
            <p className="mt-2 text-sm text-secondary-600">
              {app.status === 'blocked'
                ? "This app is currently blocked from accessing the internet."
                : "This app is allowed to access the internet."}
            </p>
          </div>
          
          <div className="mt-4 p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary-500" />
                <span className="ml-2 text-secondary-900 font-medium">Add to Whitelist</span>
              </div>
              <Switch
                checked={app.status === 'whitelist'}
                onChange={() => app.status === 'whitelist' 
                  ? removeFromWhitelist(app.id) 
                  : addToWhitelist(app.id)
                }
                color="primary"
              />
            </div>
            <p className="mt-2 text-sm text-secondary-600">
              {app.status === 'whitelist'
                ? "This app is whitelisted and will always have internet access."
                : "Add this app to whitelist to ensure it always has internet access."}
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          {app.status !== 'blocked' ? (
            <Button
              variant="danger"
              icon={<Ban size={18} />}
              onClick={() => blockApp(app.id)}
            >
              Block App
            </Button>
          ) : (
            <Button
              variant="success"
              icon={<Wifi size={18} />}
              onClick={() => toggleAppStatus(app.id)}
            >
              Allow Internet
            </Button>
          )}
          
          {app.status !== 'whitelist' ? (
            <Button
              variant="primary"
              icon={<Shield size={18} />}
              onClick={() => addToWhitelist(app.id)}
            >
              Add to Whitelist
            </Button>
          ) : (
            <Button
              variant="outline"
              icon={<Shield size={18} />}
              onClick={() => removeFromWhitelist(app.id)}
            >
              Remove from Whitelist
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default AppDetail;