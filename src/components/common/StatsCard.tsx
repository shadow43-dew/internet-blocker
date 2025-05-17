import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  colorScheme?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  colorScheme = 'primary',
}: StatsCardProps) {
  const colorSchemes = {
    primary: {
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueCls: 'text-primary-900',
    },
    success: {
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600',
      valueCls: 'text-success-900',
    },
    danger: {
      iconBg: 'bg-danger-100',
      iconColor: 'text-danger-600',
      valueCls: 'text-danger-900',
    },
    warning: {
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600',
      valueCls: 'text-warning-900',
    },
    neutral: {
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      valueCls: 'text-secondary-900',
    },
  };

  const { iconBg, iconColor, valueCls } = colorSchemes[colorScheme];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-secondary-700">{title}</h3>
        <div className={cn("p-2 rounded-full", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
      
      <div className="mt-2">
        <div className={cn("text-2xl font-semibold", valueCls)}>{value}</div>
        
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? 'text-success-600' : 'text-danger-600'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="ml-1 text-xs text-secondary-500">from last week</span>
          </div>
        )}
        
        {description && (
          <p className="mt-1 text-xs text-secondary-500">{description}</p>
        )}
      </div>
    </div>
  );
}

export default StatsCard;