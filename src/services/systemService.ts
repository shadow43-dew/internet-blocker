import { AppInfo } from '../lib/types';
import si from 'systeminformation';
import psList from 'ps-list';

const API_URL = 'http://localhost:3001/api';

export const getInstalledApps = async (): Promise<AppInfo[]> => {
  try {
    const processes = await psList();
    const networkConnections = await si.networkConnections();
    
    return processes.map(proc => ({
      id: `proc-${proc.pid}`,
      name: proc.name,
      icon: getAppIcon(proc.name),
      status: 'allowed',
      category: getAppCategory(proc.name),
      lastUsed: new Date().toISOString(),
      path: proc.cmd || '',
      dataUsage: {
        wifi: 0,
        mobile: 0
      }
    }));
  } catch (error) {
    console.error('Error getting installed apps:', error);
    return [];
  }
};

export const getRunningProcesses = async (): Promise<AppInfo[]> => {
  try {
    const response = await fetch(`${API_URL}/stats/processes`);
    if (!response.ok) throw new Error('Failed to fetch running processes');
    const data = await response.json();
    
    return data.map((proc: any) => ({
      id: `proc-${proc.pid}`,
      name: proc.name,
      icon: getAppIcon(proc.name),
      status: proc.status || 'allowed',
      category: getAppCategory(proc.name),
      lastUsed: proc.last_used,
      path: proc.path || '',
      dataUsage: {
        wifi: proc.data_usage_wifi || 0,
        mobile: proc.data_usage_mobile || 0
      }
    }));
  } catch (error) {
    console.error('Error getting running processes:', error);
    return [];
  }
};

// Helper function to determine app icon based on name
function getAppIcon(name: string): string {
  const normalizedName = name.toLowerCase();
  
  if (normalizedName.includes('chrome')) return 'Chrome';
  if (normalizedName.includes('firefox')) return 'Firefox';
  if (normalizedName.includes('edge')) return 'Edge';
  if (normalizedName.includes('code')) return 'Code';
  if (normalizedName.includes('terminal')) return 'Terminal';
  if (normalizedName.includes('spotify')) return 'Music';
  if (normalizedName.includes('slack')) return 'MessageSquare';
  if (normalizedName.includes('discord')) return 'MessageCircle';
  if (normalizedName.includes('steam')) return 'Gamepad';
  if (normalizedName.includes('outlook')) return 'Mail';
  if (normalizedName.includes('word')) return 'FileText';
  if (normalizedName.includes('excel')) return 'Table';
  if (normalizedName.includes('node')) return 'Terminal';
  if (normalizedName.includes('python')) return 'Code';
  
  return 'App';
}

// Helper function to categorize apps
function getAppCategory(name: string): string {
  const normalizedName = name.toLowerCase();
  
  if (normalizedName.includes('chrome') || 
      normalizedName.includes('firefox') || 
      normalizedName.includes('edge')) {
    return 'Browsers';
  }
  
  if (normalizedName.includes('code') || 
      normalizedName.includes('node') || 
      normalizedName.includes('python')) {
    return 'Development';
  }
  
  if (normalizedName.includes('spotify') || 
      normalizedName.includes('vlc') || 
      normalizedName.includes('media')) {
    return 'Media';
  }
  
  if (normalizedName.includes('slack') || 
      normalizedName.includes('discord') || 
      normalizedName.includes('teams')) {
    return 'Communication';
  }
  
  if (normalizedName.includes('word') || 
      normalizedName.includes('excel') || 
      normalizedName.includes('powerpoint')) {
    return 'Office';
  }
  
  if (normalizedName.includes('steam') || 
      normalizedName.includes('game')) {
    return 'Games';
  }
  
  return 'System';
}