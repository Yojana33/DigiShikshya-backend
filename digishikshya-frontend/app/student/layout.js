"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentSidebar from './sidebar/page';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.pathname;

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className={`fixed inset-0 z-40 md:relative md:translate-x-0 md:flex md:flex-col md:w-64 bg-gray-100 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <StudentSidebar currentPath={currentPath} onLinkClick={handleLinkClick} />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden absolute top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
       <div className=' mt-5 mb-5 flex flex-row justify-end'>
       <Menu className="h-5 w-5" />
       </div>
      </Button>
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {children}
        </div>
      </main>
    </div>
  );
}