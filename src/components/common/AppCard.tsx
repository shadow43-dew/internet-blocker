import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn, formatBytes, formatDate, getStatusColor } from '../../lib/utils';
import Switch from '../ui/Switch';
import Badge from '../ui/Badge';
import { AppInfo } from '../../lib/types';

interface AppCardProps {
  app: AppInfo;
  onToggleStatus: (appId: string) => void;
  onClick?: (appId: string) => void;
}

export function AppCard({ app, onToggleStatus, onClick }: AppCardProps) {
  const statusLabels = {
    blocked: 'Blocked',
    allowed: 'Allowed',
    whitelist: 'Whitelisted',
  };

  const statusVariants: Record<string, 'danger' | 'success' | 'primary'> = {
    blocked: 'danger',
    allowed: 'success',
    whitelist: 'primary',
  };

  // Get icon dynamically from Lucide icons
  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[app.icon] || LucideIcons.Globe;

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border border-secondary-200 p-4 transition-all duration-200",
        "hover:shadow-md cursor-pointer"
      )}
      onClick={() => onClick && onClick(app.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            "bg-primary-100"
          )}>
            <IconComponent className="text-primary-600" size={20} />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-secondary-900">{app.name}</h3>
            <p className="text-xs text-secondary-500">{app.category}</p>
          </div>
        </div>
        
        <Switch
          checked={app.status !== 'blocked'}
          onChange={(e) => {
            e.stopPropagation();
            onToggleStatus(app.id);
          }}
          color={app.status === 'whitelist' ? 'primary' : 'success'}
          size="md"
        />
      </div>
      
      <div className="mt-4 pt-3 border-t border-secondary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Badge
              variant={statusVariants[app.status]}
              size="sm"
            >
              {statusLabels[app.status]}
            </Badge>
            <span className="ml-2 text-xs text-secondary-500">
              Last used: {formatDate(app.lastUsed)}
            </span>
          </div>
          <div className="text-xs text-secondary-600">{formatBytes(app.dataUsage.wifi + app.dataUsage.mobile)}</div>
        </div>
      </div>
    </div>
  );
}

export default AppCard;