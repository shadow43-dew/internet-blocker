import React from 'react';
import { Shield, Ban, WifiOff, BatteryMedium } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { useAppStore } from '../../store/store';
import { formatBytes } from '../../lib/utils';

export function StatusOverview() {
  const { stats, masterBlockEnabled } = useAppStore();
  
  // Get the number of blocked apps safely with optional chaining
  const blockedAppsCount = stats?.apps?.filter(app => app.status === 'blocked').length ?? 0;
  
  // Safely access total saved data with optional chaining and default to 0
  const dataSaved = stats?.totalSaved?.data ?? 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Protection Status"
        value={masterBlockEnabled ? "Active" : "Disabled"}
        icon={Shield}
        colorScheme={masterBlockEnabled ? "success" : "danger"}
        description={masterBlockEnabled ? "Your apps are protected" : "Your apps are not protected"}
      />
      
      <StatsCard
        title="Apps Blocked"
        value={blockedAppsCount}
        icon={Ban}
        trend={{ value: 5, isPositive: true }}
        colorScheme="primary"
      />
      
      <StatsCard
        title="Data Saved"
        value={formatBytes(dataSaved)}
        icon={WifiOff}
        trend={{ value: 12, isPositive: true }}
        colorScheme="success"
      />
      
      <StatsCard
        title="Battery Saved"
        value="17%"
        icon={BatteryMedium}
        description="Estimated battery savings"
        colorScheme="warning"
      />
    </div>
  );
}

export default StatusOverview;