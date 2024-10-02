'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
//import StudentSidebar from '../sidebar/page'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, FileText, Bell, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Mock data for subjects - replace with actual data fetching
const subjects = [
  { id: 1, name: "Mathematics", notesCount: 15, mcqCount: 50 },
  { id: 2, name: "Science", notesCount: 20, mcqCount: 75 },
  { id: 3, name: "English", notesCount: 12, mcqCount: 40 },
  { id: 4, name: "Social", notesCount: 18, mcqCount: 60 },
  { id: 5, name: "Computer", notesCount: 25, mcqCount: 80 },
  { id: 6, name: "Nepali", notesCount: 22, mcqCount: 70 },
]

export default function SubjectsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="hidden md:block">
        {/* <StudentSidebar /> */}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          {/* <StudentSidebar /> */}
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="all" className="text-blue-600 hover:text-blue-800">All Subjects</TabsTrigger>
                <TabsTrigger value="notes" className="text-blue-600 hover:text-blue-800">Notes</TabsTrigger>
                <TabsTrigger value="mcq" className="text-blue-600 hover:text-blue-800">MCQs</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} router={router} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <NotesList subjects={subjects} router={router} />
              </TabsContent>
              <TabsContent value="mcq">
                <MCQList subjects={subjects} router={router} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

function SubjectCard({ subject, router }) {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">{subject.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">Explore notes and practice MCQs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">{subject.notesCount} Notes</span>
          <span className="text-gray-700">{subject.mcqCount} MCQs</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => router.push(`/student/notes?subject=${subject.id}`)}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          View Notes
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => router.push(`/student/mcq/question-page?subject=${subject.id}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Practice MCQs
        </Button>
      </CardFooter>
    </Card>
  )
}

function NotesList({ subjects, router }) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <Card key={subject.id} className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">{subject.name} Notes</CardTitle>
            <CardDescription className="text-sm text-gray-500">{subject.notesCount} notes available</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => router.push(`/student/notes?subject=${subject.id}`)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Notes
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function MCQList({ subjects, router }) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <Card key={subject.id} className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">{subject.name} MCQs</CardTitle>
            <CardDescription className="text-sm text-gray-500">{subject.mcqCount} questions available</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => router.push(`/student/mcq/question-page?subject=${subject.id}`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Start Practice
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}