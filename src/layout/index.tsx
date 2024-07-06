import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex flex-col'>
        <Header />
        {children}
      </div>
    </div>
  );
}

export default Layout;