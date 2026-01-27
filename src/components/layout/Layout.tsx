import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNavbar }) => {
  return (
    <div className="min-h-screen bg-background">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? '' : 'pt-16'}>{children}</main>
    </div>
  );
};
