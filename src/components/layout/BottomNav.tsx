import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListFilter, Ban, Shield, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/store';

export function BottomNav() {
  const { masterBlockEnabled } = useAppStore();
  
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/apps', icon: <ListFilter size={20} />, label: 'Apps' },
    { to: '/adblock', icon: <Ban size={20} />, label: 'Ad Blocker' },
    { to: '/whitelist', icon: <Shield size={20} />, label: 'Whitelist' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 md:hidden z-10">
      <div className="grid grid-cols-5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center py-2 px-1 text-xs",
              isActive
                ? "text-primary-600"
                : "text-secondary-600 hover:text-secondary-900"
            )}
            end={item.to === '/'}
          >
            <div className="mb-1">{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Protection indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5 transition-colors",
          masterBlockEnabled ? "bg-success-500" : "bg-danger-500"
        )}
      />
    </div>
  );
}

export default BottomNav;