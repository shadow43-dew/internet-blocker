import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  ListFilter, 
  Ban, 
  BarChart, 
  Settings 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/apps', icon: <ListFilter size={20} />, label: 'Apps' },
  { to: '/adblock', icon: <Ban size={20} />, label: 'Ad Blocker' },
  { to: '/whitelist', icon: <Shield size={20} />, label: 'Whitelist' },
  { to: '/stats', icon: <BarChart size={20} />, label: 'Statistics' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
];

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 transform bg-white border-r border-secondary-200 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0" // Always show on medium and larger screens
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-secondary-200">
          <Shield className="h-8 w-8 text-primary-500" />
          <span className="ml-2 text-lg font-semibold">NetBlocker</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary-50 text-primary-700" 
                      : "text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900"
                  )}
                  end={item.to === '/'}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-secondary-200">
          <div className="bg-primary-50 rounded-lg p-4">
            <h5 className="font-medium text-primary-700 mb-1">Pro Features</h5>
            <p className="text-xs text-secondary-600 mb-3">Unlock advanced blocking & real-time protection</p>
            <button className="w-full py-2 text-xs font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;