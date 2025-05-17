import React from 'react';
import { 
  Shield, 
  Bell, 
  LifeBuoy, 
  Clock, 
  Battery, 
  Cpu, 
  RefreshCw,
  HardDrive
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import ToggleCard from '../components/common/ToggleCard';
import { useAppStore } from '../store/store';

export function Settings() {
  const { masterBlockEnabled, toggleMasterBlock } = useAppStore();
  
  // These would be backed by actual state in a full implementation
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [startupEnabled, setStartupEnabled] = React.useState(true);
  const [batteryOptimization, setBatteryOptimization] = React.useState(true);
  const [autoUpdate, setAutoUpdate] = React.useState(false);
  const [backgroundRunning, setBackgroundRunning] = React.useState(true);

  return (
    <PageContainer
      title="Settings"
      description="Configure application settings and preferences"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-secondary-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <ToggleCard
              title="Master Protection"
              description="Enable/disable all internet blocking features"
              icon={Shield}
              enabled={masterBlockEnabled}
              onToggle={toggleMasterBlock}
            />
            
            <ToggleCard
              title="Notifications"
              description="Receive alerts about blocked connections and data usage"
              icon={Bell}
              enabled={notificationsEnabled}
              onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            
            <ToggleCard
              title="Start on Boot"
              description="Automatically start the application when your computer starts"
              icon={LifeBuoy}
              enabled={startupEnabled}
              onToggle={() => setStartupEnabled(!startupEnabled)}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-secondary-900 mb-4">Performance Settings</h2>
          <div className="space-y-4">
            <ToggleCard
              title="Battery Optimization"
              description="Optimize application performance to save battery"
              icon={Battery}
              enabled={batteryOptimization}
              onToggle={() => setBatteryOptimization(!batteryOptimization)}
            />
            
            <ToggleCard
              title="Background Running"
              description="Allow the app to run in the background to maintain protection"
              icon={Cpu}
              enabled={backgroundRunning}
              onToggle={() => setBackgroundRunning(!backgroundRunning)}
            />
            
            <ToggleCard
              title="Auto Update"
              description="Automatically update block lists and application"
              icon={RefreshCw}
              enabled={autoUpdate}
              onToggle={() => setAutoUpdate(!autoUpdate)}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-medium text-secondary-900 mb-4">About</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-secondary-700">Version</span>
              <span className="text-secondary-900 font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-700">Build</span>
              <span className="text-secondary-900 font-medium">2025.01.01</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-700">Platform</span>
              <span className="text-secondary-900 font-medium">Windows</span>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-100">
              <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
                Privacy Policy
              </button>
              <span className="mx-2 text-secondary-300">•</span>
              <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
                Terms of Service
              </button>
              <span className="mx-2 text-secondary-300">•</span>
              <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
                Licenses
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Settings;