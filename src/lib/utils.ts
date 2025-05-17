import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: 'blocked' | 'allowed' | 'whitelist'): string {
  switch (status) {
    case 'blocked':
      return 'bg-danger-500';
    case 'allowed':
      return 'bg-success-500';
    case 'whitelist':
      return 'bg-primary-500';
    default:
      return 'bg-secondary-500';
  }
}

export function generateRandomAppList(count: number = 15): any[] {
  const categories = ['Social', 'Productivity', 'Games', 'Entertainment', 'Utilities'];
  const icons = ['Globe', 'MessageSquare', 'Play', 'Film', 'Tool', 'Music', 'Video', 'Mail', 'Coffee', 'Calendar', 'Clock', 'Camera'];
  const statuses: Array<'blocked' | 'allowed' | 'whitelist'> = ['blocked', 'allowed', 'whitelist'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `app-${i + 1}`,
    name: `App ${i + 1}`,
    icon: icons[Math.floor(Math.random() * icons.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    lastUsed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    dataUsage: {
      wifi: Math.floor(Math.random() * 1000000000),
      mobile: Math.floor(Math.random() * 500000000),
    },
  }));
}