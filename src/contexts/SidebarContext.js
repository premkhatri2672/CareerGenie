import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

const MOBILE_BREAKPOINT = 768;

export const useSidebar = () => useContext(SidebarContext) || {
  isSidebarOpen: true,
  sidebarWidth: 230,
  isMobile: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  openSidebar: () => {}
};

export const SidebarProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Start closed on mobile
    if (window.innerWidth <= MOBILE_BREAKPOINT) return false;
    const saved = localStorage.getItem('careerGenieSidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [sidebarWidth, setSidebarWidth] = useState(260);

  // Listen for viewport resize — auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Only persist sidebar state on desktop
    if (!isMobile) {
      localStorage.setItem('careerGenieSidebarOpen', JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, isMobile]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  useEffect(() => {
    // On mobile, sidebar overlays so don't shift content
    if (isMobile) {
      setSidebarWidth(0);
    } else {
      setSidebarWidth(isSidebarOpen ? 260 : 0);
    }
  }, [isSidebarOpen, isMobile]);

  const value = { isSidebarOpen, sidebarWidth, isMobile, toggleSidebar, closeSidebar, openSidebar };

  return React.createElement(SidebarContext.Provider, { value }, children);
};

