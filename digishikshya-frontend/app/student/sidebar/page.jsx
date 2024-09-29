'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  LayoutDashboard,
  BookCopy,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'

export default function StudentSidebar({ currentPath, onLinkClick }) {
  const router = useRouter()

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-64 bg-gray-100">
        <div className="flex items-center justify-start mb-6">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-800">DigiShikshya</span>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="space-y-2">
            <Link href="/student/dashboard" className={`flex items-center p-2 rounded-lg ${currentPath === '/student/dashboard' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={onLinkClick}>
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link href="/student/subjects" className={`flex items-center p-2 rounded-lg ${currentPath === '/student/subjects' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={onLinkClick}>
              <BookCopy className="h-5 w-5 mr-3" />
              Subjects
            </Link>
            <Link href="/student/assignments" className={`flex items-center p-2 rounded-lg ${currentPath === '/student/assignments' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={onLinkClick}>
              <FileText className="h-5 w-5 mr-3" />
              Assignments
            </Link>
            <Link href="/student/schedule" className={`flex items-center p-2 rounded-lg ${currentPath === '/student/schedule' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={onLinkClick}>
              <Calendar className="h-5 w-5 mr-3" />
              Schedule
            </Link>
            <Link href="/student/chatbox" className={`flex items-center p-2 rounded-lg ${currentPath === '/student/chatbox' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={onLinkClick}>
              <MessageSquare className="h-5 w-5 mr-3" />
              Chatbox
            </Link>
            <Link href="/student/settings" className={`flex items-center p-2 rounded-lg ${currentPath === '/student/settings' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={onLinkClick}>
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </nav>
        </ScrollArea>
        <Button
          variant="ghost"
          className="mt-4 w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}