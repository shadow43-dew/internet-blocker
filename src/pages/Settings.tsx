import React from 'react';
import { 
  Shield, 
  Bell, 
  LifeBuoy, 
  Battery, 
  Cpu, 
  RefreshCw,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import ToggleCard from '../components/common/ToggleCard';
import { useAppStore } from '../store/store';

export function Settings() {
  const { systemSettings, updateSystemSettings, updateTheme } = useAppStore();
  
  const handleThemeChange = (isDarkMode: boolean) => {
    updateTheme({
      isDarkMode,
      backgroundColor: isDarkMode ? '#202124' : '#ffffff',
      textColor: isDarkMode ? '#ffffff' : '#202124',
    });
  };

  const colors = [
    { name: 'Blue', value: '#1a73e8' },
    { name: 'Green', value: '#34a853' },
    { name: 'Red', value: '#ea4335' },
    { name: 'Purple', value: '#9334e8' },
    { name: 'Orange', value: '#fa7b17' },
  ];

  return (
    <PageContainer
      title="Settings"
      description="Configure application settings and preferences"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-secondary-900 mb-4">Theme Settings</h2>
          <div className="space-y-4">
            <ToggleCard
              title="Dark Mode"
              description="Enable dark mode for better visibility in low light"
              icon={systemSettings.theme.isDarkMode ? Moon : Sun}
              enabled={systemSettings.theme.isDarkMode}
              onToggle={() => handleThemeChange(!systemSettings.theme.isDarkMode)}
            />
            
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
              <div className="flex items-center mb-3">
                <Palette className="h-5 w-5 text-primary-500" />
                <h3 className="ml-2 text-base font-medium text-secondary-900">Accent Color</h3>
              </div>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full border-2 ${
                      systemSettings.theme.primaryColor === color.value
                        ? 'border-secondary-400'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateTheme({ primaryColor: color.value })}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-secondary-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <ToggleCard
              title="Notifications"
              description="Receive alerts about blocked connections and data usage"
              icon={Bell}
              enabled={systemSettings.notifications}
              onToggle={() => updateSystemSettings({ notifications: !systemSettings.notifications })}
            />
            
            <ToggleCard
              title="Start on Boot"
              description="Automatically start the application when your computer starts"
              icon={LifeBuoy}
              enabled={systemSettings.startupOnBoot}
              onToggle={() => updateSystemSettings({ startupOnBoot: !systemSettings.startupOnBoot })}
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
              enabled={systemSettings.batteryOptimization}
              onToggle={() => updateSystemSettings({ batteryOptimization: !systemSettings.batteryOptimization })}
            />
            
            <ToggleCard
              title="Background Running"
              description="Allow the app to run in the background to maintain protection"
              icon={Cpu}
              enabled={systemSettings.backgroundRunning}
              onToggle={() => updateSystemSettings({ backgroundRunning: !systemSettings.backgroundRunning })}
            />
            
            <ToggleCard
              title="Auto Update"
              description="Automatically update block lists and application"
              icon={RefreshCw}
              enabled={systemSettings.autoUpdate}
              onToggle={() => updateSystemSettings({ autoUpdate: !systemSettings.autoUpdate })}
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