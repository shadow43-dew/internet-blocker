import { AppInfo } from '../lib/types';

const API_URL = 'http://localhost:3000/api';

export async function blockApp(app: AppInfo): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/block-app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: app.id,
        name: app.name,
        path: app.path
      }),
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
    const response = await fetch(`${API_URL}/unblock-app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: app.id,
        name: app.name,
        path: app.path
      }),
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
    const response = await fetch(`${API_URL}/whitelist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: app.id,
        name: app.name,
        path: app.path
      }),
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
      body: JSON.stringify({
        id: app.id,
        name: app.name,
        path: app.path
      }),
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
    const response = await fetch(`${API_URL}/blocked-apps`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting blocked apps:', error);
    return [];
  }
}

export async function getAdBlockStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/ad-block/status`);
    const data = await response.json();
    return data.enabled;
  } catch (error) {
    console.error('Error getting ad block status:', error);
    return false;
  }
}

export async function toggleAdBlock(enabled: boolean): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/ad-block/toggle`, {
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

export async function getSystemBlockStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/system/status`);
    const data = await response.json();
    return data.enabled;
  } catch (error) {
    console.error('Error getting system block status:', error);
    return false;
  }
}

export async function toggleSystemBlock(enabled: boolean): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/system/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error toggling system block:', error);
    return false;
  }
}