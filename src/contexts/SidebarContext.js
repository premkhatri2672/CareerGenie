import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext) || {
  isSidebarOpen: true,
  sidebarWidth: 230,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  openSidebar: () => {}
};

export const SidebarProvider = ({ children }) => {
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(260);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('careerGenieSidebarOpen');
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('careerGenieSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  useEffect(() => {
    setSidebarWidth(isSidebarOpen ? 260 : 0);
  }, [isSidebarOpen]);

  const value = { isSidebarOpen, sidebarWidth, toggleSidebar, closeSidebar, openSidebar };

  return React.createElement(SidebarContext.Provider, { value }, children);
};

