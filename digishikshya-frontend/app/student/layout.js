"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import StudentSidebar from './sidebar/page';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { Query, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function StudentLayout({ children }) {
    const queryClient = new QueryClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();
  console.log(currentPath, "currentPath");

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 h-auto w-auto rounded-lg">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden sticky  top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className={`h-6 w-6 mb-2 ${isSidebarOpen ? 'text-white' : 'text-gray-400'}`} />
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-800 p-4 text-white transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
      >
        <StudentSidebar currentPath={currentPath} onLinkClick={handleLinkClick} />
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <QueryClientProvider client={queryClient}>
      <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
      </QueryClientProvider>
    </div>
  );
}
