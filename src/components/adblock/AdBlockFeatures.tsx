import React from 'react';
import { 
  Ban, 
  Sprout, 
  ShieldAlert, 
  Zap,
  LayoutGrid
} from 'lucide-react';
import ToggleCard from '../common/ToggleCard';
import { useAppStore } from '../../store/store';

export function AdBlockFeatures() {
  const { adBlockEnabled, toggleAdBlock } = useAppStore();
  
  // These would be backed by actual state in a full implementation
  const [trackerBlocking, setTrackerBlocking] = React.useState(true);
  const [cookieBlocking, setCookieBlocking] = React.useState(false);
  const [scriptBlocking, setScriptBlocking] = React.useState(true);
  const [customFilters, setCustomFilters] = React.useState(false);
  
  const features = [
    {
      title: 'Ad Blocking',
      description: 'Block advertisements across all apps and browsers',
      icon: Ban,
      enabled: adBlockEnabled,
      onToggle: toggleAdBlock,
    },
    {
      title: 'Tracker Blocking',
      description: 'Prevent tracking services from collecting your data',
      icon: ShieldAlert,
      enabled: trackerBlocking,
      onToggle: () => setTrackerBlocking(!trackerBlocking),
    },
    {
      title: 'Cookie Blocker',
      description: 'Block tracking cookies and improve privacy',
      icon: Sprout,
      enabled: cookieBlocking,
      onToggle: () => setCookieBlocking(!cookieBlocking),
    },
    {
      title: 'Script Blocking',
      description: 'Block potentially harmful scripts from running',
      icon: Zap,
      enabled: scriptBlocking,
      onToggle: () => setScriptBlocking(!scriptBlocking),
    },
    {
      title: 'Custom Filters',
      description: 'Create and apply custom ad blocking rules',
      icon: LayoutGrid,
      enabled: customFilters,
      onToggle: () => setCustomFilters(!customFilters),
    },
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <ToggleCard
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          enabled={feature.enabled}
          onToggle={feature.onToggle}
        />
      ))}
    </div>
  );
}

export default AdBlockFeatures;