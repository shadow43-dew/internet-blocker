import React from 'react';
import { Shield, Menu, X, Settings } from 'lucide-react';
import Button from '../ui/Button';
import { useAppStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const { masterBlockEnabled, toggleMasterBlock } = useAppStore();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 fixed top-0 left-0 right-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4 md:hidden"
            onClick={onToggleSidebar}
            icon={sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          />
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-lg font-semibold">Internet Blocker</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant={masterBlockEnabled ? "primary" : "outline"}
            size="sm"
            onClick={toggleMasterBlock}
            className="hidden sm:flex"
          >
            {masterBlockEnabled ? "Protection Active" : "Protection Disabled"}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon={<Settings size={20} />}
            className="text-secondary-700"
            onClick={() => navigate('/settings')}
          />
        </div>
      </div>
      
      {/* Protection status indicator */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
          masterBlockEnabled ? 'bg-success-500' : 'bg-danger-500'
        }`}
      />
    </header>
  );
}

export default Header