'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  LayoutDashboard,
  BookCopy,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import axios from 'axios';

export default function StudentSidebar({ currentPath, onLinkClick }) {
  const router = useRouter();

  console.log(currentPath, "currentPath");

  const handleLogout = () => {
    axios.post('/logout')
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        router.push('/');
      });
  };

  return (
    <div className="flex h-full flex-col ">
      {/* Header */}
      <div className="flex items-center  justify-center mb-10 mt-8 px-4 ">
        <BookOpen className="h-8 w-8 text-blue-400 mr-2" />
        <span className="text-2xl font-bold text-white">DigiShikshya</span>
      </div>

      <ScrollArea className="flex ">
        <nav className="space-y-3  ">
          <SidebarLink
            href="/student/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="h-5 w-5 mr-3" />}
            isActive={currentPath === '/student/dashboard'}
            onClick={onLinkClick}
          /> 
          <SidebarLink
            href="/student/subjects"
            label="Subjects"
            icon={<BookCopy className="h-5 w-5 mr-3" />}
            isActive={currentPath === '/student/subjects'}
            onClick={onLinkClick}
          />
          <SidebarLink
            href="/student/assignments"
            label="Assignments"
            icon={<FileText className="h-5 w-5 mr-3" />}
            isActive={currentPath === '/student/assignments'}
            onClick={onLinkClick}
          />
          <SidebarLink
            href="/student/chatbox"
            label="Chatbox"
            icon={<MessageSquare className="h-5 w-5 mr-3" />}
            isActive={currentPath === '/student/chatbox'}
            onClick={onLinkClick}
          />
          <SidebarLink
            href="/student/settings"
            label="Settings"
            icon={<Settings className="h-5 w-5 mr-3" />}
            isActive={currentPath === '/student/settings'}
            onClick={onLinkClick}
          />
        </nav>
      </ScrollArea>

      <Button
        variant="ghost"
        className="mt-6 w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300 ease-in-out"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </Button>
    </div>
  );
}

function SidebarLink({ href, label, icon, isActive, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg  transition-colors duration-300 ease-in-out
      ${isActive ? 'bg-gray-200 text-black' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
