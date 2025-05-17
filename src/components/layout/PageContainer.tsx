import React from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function PageContainer({ 
  children, 
  title, 
  description,
  className,
}: PageContainerProps) {
  return (
    <div className={cn("px-4 pt-4 pb-20 md:pb-4", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>}
          {description && <p className="mt-1 text-sm text-secondary-600">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export default PageContainer;