import { AppInfo } from '../lib/types';

const API_URL = 'http://localhost:3001/api';

export const isRunningAsAdmin = (): boolean => {
  // In a real implementation, this would check if the app has admin privileges
  console.log('Checking if running as admin');
  return false;
};

export const requestAdminPrivileges = async (): Promise<boolean> => {
  // In a real implementation, this would trigger a UAC prompt
  console.log('Requesting admin privileges');
  return false;
};

export const setStartupOnBoot = async (enable: boolean): Promise<boolean> => {
  // In a real implementation, this would add/remove the app from startup items
  console.log(`Setting startup on boot: ${enable}`);
  return true;
};

export const getSystemInfo = async (): Promise<Record<string, any>> => {
  try {
    const response = await fetch(`${API_URL}/system/info`);
    if (!response.ok) throw new Error('Failed to fetch system info');
    return await response.json();
  } catch (error) {
    console.error('Error getting system info:', error);
    return {
      os: 'Windows',
      version: '11',
      arch: 'x64',
      memory: 16000000000, // 16 GB
    };
  }
};

export const getInstalledApps = async (): Promise<AppInfo[]> => {
  try {
    const response = await fetch(`${API_URL}/system/installed-apps`);
    if (!response.ok) throw new Error('Failed to fetch installed apps');
    return await response.json();
  } catch (error) {
    console.error('Error getting installed apps:', error);
    return [];
  }
};

export const getRunningProcesses = async (): Promise<AppInfo[]> => {
  try {
    const response = await fetch(`${API_URL}/system/running-processes`);
    if (!response.ok) throw new Error('Failed to fetch running processes');
    return await response.json();
  } catch (error) {
    console.error('Error getting running processes:', error);
    return [];
  }
};