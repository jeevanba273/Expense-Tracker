import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onAuthRequired: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onAuthRequired }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={toggleSidebar} />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onCollapse={toggleSidebarCollapse}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(page) => {
          onNavigate(page);
          onAuthRequired();
        }}
        currentPage={currentPage}
      />
      
      <main className={`pt-20 pb-10 transition-all duration-300 min-h-screen ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;