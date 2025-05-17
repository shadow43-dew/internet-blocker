import { UsageStats } from '../lib/types';

const API_URL = 'http://localhost:3001/api';

export async function getStatisticsOverview(): Promise<UsageStats> {
  try {
    const response = await fetch(`${API_URL}/stats/overview`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      totalBlocked: 0,
      totalSaved: { data: 0, bandwidth: 0 },
      adsBlocked: 0,
      appStats: []
    };
  }
}

export async function getProcessStats(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/stats/processes`);
    if (!response.ok) throw new Error('Failed to fetch process statistics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching process statistics:', error);
    return [];
  }
}

export async function getSystemStats(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/stats/system`);
    if (!response.ok) throw new Error('Failed to fetch system statistics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching system statistics:', error);
    return {
      cpu: 0,
      memory: { used: 0, total: 0 },
      network: { rx_bytes: 0, tx_bytes: 0 },
      processes: [],
      history: []
    };
  }
}