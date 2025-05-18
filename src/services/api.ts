import { AppInfo } from '../lib/types';

const API_URL = 'http://localhost:3001/api';

export async function blockApp(app: AppInfo): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/apps/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appId: app.id }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error blocking app:', error);
    return false;
  }
}

export async function unblockApp(app: AppInfo): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/apps/unblock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appId: app.id }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error unblocking app:', error);
    return false;
  }
}

export async function addToWhitelist(app: AppInfo): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/whitelist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appId: app.id }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    return false;
  }
}

export async function removeFromWhitelist(app: AppInfo): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/whitelist/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appId: app.id }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error removing from whitelist:', error);
    return false;
  }
}

export async function getBlockedApps(): Promise<AppInfo[]> {
  try {
    const response = await fetch(`${API_URL}/stats/processes`);
    const data = await response.json();
    return data.filter((app: any) => app.status === 'blocked');
  } catch (error) {
    console.error('Error getting blocked apps:', error);
    return [];
  }
}

export async function getAdBlockStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/stats/overview`);
    const data = await response.json();
    return data.adsBlocked > 0;
  } catch (error) {
    console.error('Error getting ad block status:', error);
    return false;
  }
}

export async function toggleAdBlock(enabled: boolean): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/adblock/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error toggling ad block:', error);
    return false;
  }
}