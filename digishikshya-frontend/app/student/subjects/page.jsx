'use client'

import { useState } from 'react'
import StudentSidebar from '../sidebar/page'
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

  return (
   
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="all">All Subjects</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="mcq">MCQs</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <NotesList subjects={subjects} />
              </TabsContent>
              <TabsContent value="mcq">
                <MCQList subjects={subjects} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
  
  )
}

function SubjectCard({ subject }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{subject.name}</CardTitle>
        <CardDescription>Explore notes and practice MCQs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{subject.notesCount} Notes</span>
          <span>{subject.mcqCount} MCQs</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <BookOpen className="h-4 w-4 mr-2" />
          View Notes
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Practice MCQs
        </Button>
      </CardFooter>
    </Card>
  )
}

function NotesList({ subjects }) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <Card key={subject.id}>
          <CardHeader>
            <CardTitle>{subject.name} Notes</CardTitle>
            <CardDescription>{subject.notesCount} notes available</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              View Notes
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function MCQList({ subjects }) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <Card key={subject.id}>
          <CardHeader>
            <CardTitle>{subject.name} MCQs</CardTitle>
            <CardDescription>{subject.mcqCount} questions available</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Start Practice
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}