import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-500',
    secondary:
      'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 active:bg-secondary-300 focus:ring-secondary-500',
    outline:
      'bg-transparent border border-secondary-300 text-secondary-800 hover:bg-secondary-50 active:bg-secondary-100 focus:ring-secondary-500',
    ghost:
      'bg-transparent text-secondary-800 hover:bg-secondary-50 active:bg-secondary-100 focus:ring-secondary-500',
    danger:
      'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 focus:ring-danger-500',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  const iconSizeClasses = {
    sm: icon && !children ? 'p-1' : '',
    md: icon && !children ? 'p-2' : '',
    lg: icon && !children ? 'p-3' : '',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        iconSizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className={cn('mr-2')}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={cn('ml-2')}>{icon}</span>}
    </button>
  );
}

export default Button;