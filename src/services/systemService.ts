import { exec } from 'child_process';
import { promisify } from 'util';
import { AppInfo } from '../lib/types';

const execAsync = promisify(exec);

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
  // In a real implementation, this would return system information
  console.log('Getting system info');
  return {
    os: 'Windows',
    version: '11',
    arch: 'x64',
    memory: 16000000000, // 16 GB
  };
};

export const getInstalledApps = async (): Promise<AppInfo[]> => {
  try {
    // Get list of installed applications from Windows Registry
    const { stdout } = await execAsync(
      'powershell -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, InstallLocation"'
    );

    const apps: AppInfo[] = stdout
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        const [name, path] = line.split('  ').filter(Boolean);
        return {
          id: `sys-${index}`,
          name: name || 'Unknown App',
          icon: 'Globe',
          status: 'allowed',
          category: 'System',
          lastUsed: new Date().toISOString(),
          path: path || '',
          dataUsage: {
            wifi: 0,
            mobile: 0,
          },
        };
      });

    return apps;
  } catch (error) {
    console.error('Error getting installed apps:', error);
    return [];
  }
};

export const getRunningProcesses = async (): Promise<AppInfo[]> => {
  try {
    // Get list of running processes
    const { stdout } = await execAsync(
      'powershell -Command "Get-Process | Select-Object ProcessName, Path | Where-Object { $_.Path -ne $null }"'
    );

    const processes: AppInfo[] = stdout
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        const [name, path] = line.split('  ').filter(Boolean);
        return {
          id: `proc-${index}`,
          name: name || 'Unknown Process',
          icon: 'Activity',
          status: 'allowed',
          category: 'Running',
          lastUsed: new Date().toISOString(),
          path: path || '',
          dataUsage: {
            wifi: 0,
            mobile: 0,
          },
        };
      });

    return processes;
  } catch (error) {
    console.error('Error getting running processes:', error);
    return [];
  }
};