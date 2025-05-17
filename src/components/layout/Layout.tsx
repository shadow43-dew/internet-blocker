import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import FloatingActionButton from '../common/FloatingActionButton';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const target = event.target as Node;

      if (sidebarOpen && sidebar && !sidebar.contains(target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <div id="sidebar">
        <Sidebar isOpen={sidebarOpen} />
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-secondary-900/50 z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <main className="pt-16 md:pl-64 min-h-screen">
        <Outlet />
      </main>
      
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}

export default Layout;