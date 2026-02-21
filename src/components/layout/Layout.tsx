import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar, InnerNavbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;   // landing / auth pages — no sidebar
}

/**
 * Main layout shell.
 *
 * – fullWidth=true  → top nav + full-width content (landing, login, signup)
 * – fullWidth=false → left sidebar + inner top bar + content
 */
export const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  if (fullWidth) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Fixed sidebar */}
      <div className="flex-shrink-0 h-full border-r border-white/[.05]">
        <Sidebar />
      </div>
      {/* Right content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InnerNavbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
};
