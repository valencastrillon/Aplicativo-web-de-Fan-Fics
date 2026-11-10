import React from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { useAuth } from "@/contexts/AuthContext";

const AppLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 sm:px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:inline">{user?.username}</span>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
