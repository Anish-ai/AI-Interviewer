import { useState } from "react";

export function useSidebarState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  };
} 