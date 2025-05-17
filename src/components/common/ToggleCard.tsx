import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Switch from '../ui/Switch';

interface ToggleCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  enabled: boolean;
  onToggle: () => void;
}

export function ToggleCard({
  title,
  description,
  icon: Icon,
  enabled,
  onToggle,
}: ToggleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Icon className="h-5 w-5 text-primary-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-secondary-900">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-secondary-500">{description}</p>
            )}
          </div>
        </div>
        <Switch
          checked={enabled}
          onChange={onToggle}
          color="primary"
        />
      </div>
    </div>
  );
}

export default ToggleCard;