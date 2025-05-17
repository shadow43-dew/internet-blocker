import React, { useState } from 'react';
import { Plus, Shield, Ban, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const fabActions = [
    { 
      icon: <Shield size={20} />, 
      label: 'Add to Whitelist', 
      to: '/whitelist/add',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    { 
      icon: <Ban size={20} />, 
      label: 'Block App', 
      to: '/apps/block',
      color: 'bg-danger-500 hover:bg-danger-600'
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-20 md:hidden"
          onClick={toggleOpen}
        />
      )}
    
      {/* FAB Menu */}
      <div className="fixed right-4 bottom-20 z-30 md:hidden">
        <div className="relative flex flex-col-reverse items-center">
          {/* FAB Actions */}
          {isOpen && (
            <div className="mb-2 flex flex-col items-end space-y-2 animate-fade-in">
              {fabActions.map((action, index) => (
                <Link 
                  key={index}
                  to={action.to}
                  className={cn(
                    "flex items-center rounded-full shadow-floating-button text-white pl-4 pr-5 py-2 text-sm font-medium",
                    action.color
                  )}
                  onClick={toggleOpen}
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          )}
          
          {/* Main FAB Button */}
          <button
            onClick={toggleOpen}
            className={cn(
              "w-14 h-14 rounded-full shadow-floating-button flex items-center justify-center text-white transition-transform",
              isOpen ? "bg-danger-500 rotate-45" : "bg-primary-500"
            )}
          >
            {isOpen ? <X size={24} /> : <Plus size={24} />}
          </button>
        </div>
      </div>
    </>
  );
}

export default FloatingActionButton;