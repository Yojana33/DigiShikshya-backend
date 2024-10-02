'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BookOpen,
  LayoutDashboard,
  BookCopy,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'

export default function TeacherSidebar({ currentPath, onLinkClick }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    router.push('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex items-center justify-start mb-6 p-4">
        <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
        <span className="text-xl font-bold text-gray-800">DigiShikshya</span>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="space-y-2 px-4">
          <Link href="/teacher/dashboard" className={`flex items-center p-2 rounded-lg ${currentPath === '/teacher/dashboard' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={() => { onLinkClick(); setIsOpen(false); }}>
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/teacher/subjects" className={`flex items-center p-2 rounded-lg ${currentPath === '/teacher/subjects' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={() => { onLinkClick(); setIsOpen(false); }}>
            <BookCopy className="h-5 w-5 mr-3" />
            Subjects
          </Link>
          <Link href="/teacher/assignments" className={`flex items-center p-2 rounded-lg ${currentPath === '/teacher/assignments' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={() => { onLinkClick(); setIsOpen(false); }}>
            <ClipboardList className="h-5 w-5 mr-3" />
            Assignments
          </Link>
          <Link href="/teacher/chatbox" className={`flex items-center p-2 rounded-lg ${currentPath === '/teacher/chatbox' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={() => { onLinkClick(); setIsOpen(false); }}>
            <MessageSquare className="h-5 w-5 mr-3" />
            Chatbox
          </Link>
          <Link href="/teacher/settings" className={`flex items-center p-2 rounded-lg ${currentPath === '/teacher/settings' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`} onClick={() => { onLinkClick(); setIsOpen(false); }}>
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </nav>
      </ScrollArea>
      <Button
        variant="ghost"
        className="mt-4 w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700 px-4 mb-4"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </Button>
    </div>
  )

  return (
    <>
      {/* Hamburger menu for mobile and tablet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex h-screen">
        <div className="w-64">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}