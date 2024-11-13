'use client'

import { useState} from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axiosconfig'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, FileText, Bell, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from '@/hooks/use-toast'
//import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// API calls
const fetchSubjects = async () => {
  const response = await axiosInstance.get('/api/v1/subjects');
  return response.data;
};

const fetchNotes = async () => {
  const response = await axiosInstance.get(`/api/v1/material/all`);
  return response.data;
};

// Temporary mock for MCQ data (until the actual API is ready)
const fetchMCQ = async () => {
  return [
    { id: 1, question: 'MCQ 1', options: ['Option A', 'Option B', 'Option C'], answer: 'Option A' },
    { id: 2, question: 'MCQ 2', options: ['Option A', 'Option B', 'Option C'], answer: 'Option B' },
  ];
};

export default function SubjectsPage() {
 // const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();
  const { toast } = useToast();

  // Use React Query to fetch subjects
  const { data: subjects, isLoading, error } = useQuery('subjects', fetchSubjects, {
    onError: () => {
      toast({
        title: 'Error loading subjects',
        description: 'Failed to fetch subjects, please try again later.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) return <div>Loading subjects...</div>;
  if (error) return <div>Error loading subjects</div>;

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="hidden md:block">
        {/* Sidebar can be added here */}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          {/* Sidebar can be added here */}
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
                <AvatarImage src="" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
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
                <NotesList subjects={subjects} />
              </TabsContent>
              <TabsContent value="mcq">
                <MCQList subjects={subjects} />
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

function NotesList({ subjects }) {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      {subjects.map((subject) => {
        const { data: notes, isLoading, error } = useQuery(
          ['notes', subject.id],
          () => fetchNotes(),
          {
            onError: () => {
              toast({
                title: `Error loading notes for ${subject.name}`,
                description: 'Failed to fetch notes, please try again later.',
                variant: 'destructive',
              });
            },
          }
        );

        if (isLoading) return <div>Loading notes for {subject.name}...</div>;
        if (error) return <div>Error loading notes for {subject.name}</div>;

        return (
          <Card key={subject.id} className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">{subject.name} Notes</CardTitle>
              <CardDescription className="text-sm text-gray-500">{notes.length} notes available</CardDescription>
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
        );
      })}
    </div>
  )
}

function MCQList({ subjects }) {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      {subjects.map((subject) => {
        const { data: mcqs, isLoading, error } = useQuery(
          ['mcqs', subject.id],
          () => fetchMCQ(),
          {
            onError: () => {
              toast({
                title: `Error loading MCQs for ${subject.name}`,
                description: 'Failed to fetch MCQs, please try again later.',
                variant: 'destructive',
              });
            },
          }
        );

        if (isLoading) return <div>Loading MCQs for {subject.name}...</div>;
        if (error) return <div>Error loading MCQs for {subject.name}</div>;

        return (
          <Card key={subject.id} className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">{subject.name} MCQs</CardTitle>
              <CardDescription className="text-sm text-gray-500">{mcqs.length} questions available</CardDescription>
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
        );
      })}
    </div>
  )
}
