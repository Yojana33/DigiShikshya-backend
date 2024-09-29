'use client'

import { useState } from 'react'
import StudentSidebar from './student-sidebar'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Bell, Menu, BookOpen, ChevronRight } from 'lucide-react'

// Mock data - replace with actual data fetching
const mcqData = [
  {
    id: 1,
    subject: "Mathematics",
    chapters: [
      {
        id: 1,
        name: "Algebra",
        totalQuestions: 50,
        completedQuestions: 30,
      },
      {
        id: 2,
        name: "Geometry",
        totalQuestions: 40,
        completedQuestions: 15,
      },
    ]
  },
  {
    id: 2,
    subject: "Science",
    chapters: [
      {
        id: 3,
        name: "Physics",
        totalQuestions: 60,
        completedQuestions: 45,
      },
      {
        id: 4,
        name: "Chemistry",
        totalQuestions: 55,
        completedQuestions: 20,
      },
      {
        id: 5,
        name: "Biology",
        totalQuestions: 70,
        completedQuestions: 50,
      },
    ]
  },
  {
    id: 3,
    subject: "English",
    chapters: [
      {
        id: 6,
        name: "Grammar",
        totalQuestions: 80,
        completedQuestions: 60,
      },
      {
        id: 7,
        name: "Literature",
        totalQuestions: 45,
        completedQuestions: 30,
      },
    ]
  },
]

export default function MCQPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:block">
        <StudentSidebar />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <StudentSidebar />
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
                <AvatarImage src="https://github.com/shadcn.png" alt="Student" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-2xl font-bold mb-6">MCQ Practice</h1>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {mcqData.map((subject) => (
                  <AccordionItem key={subject.id} value={`subject-${subject.id}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        {subject.subject}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-4">
                        {subject.chapters.map((chapter) => (
                          <Card key={chapter.id}>
                            <CardHeader className="pb-2">
                              <CardTitle>{chapter.name}</CardTitle>
                              <CardDescription>
                                {chapter.completedQuestions} / {chapter.totalQuestions} questions completed
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Progress 
                                value={(chapter.completedQuestions / chapter.totalQuestions) * 100} 
                                className="mb-2"
                              />
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                  {Math.round((chapter.completedQuestions / chapter.totalQuestions) * 100)}% complete
                                </span>
                                <Button size="sm">
                                  Practice
                                  <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}