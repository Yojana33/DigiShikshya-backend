'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, FileText, Download, Eye } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axiosconfig'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'  // For getting route params
import { Toaster } from '@/components/ui/toaster'

// API calls
const fetchSubjectNotes = async (subjectId) => {
  const response = await axiosInstance.get(`/api/v1/material/all`);
  return response.data.notes;
};

const downloadNoteFile = async (fileUrl, title) => {
  const response = await axiosInstance.get(fileUrl, { responseType: 'blob' });
  return { fileUrl: response.data, title };
};

export default function NotesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { subjectId } = router.query; // Get subjectId from URL parameters

  if (!subjectId) {
    return <div>Loading...</div>; // Wait for subjectId to be available
  }

  // Fetch subject notes using useQuery
  const { data: subjectNotes, isLoading, error } = useQuery(
    ['subjectNotes', subjectId],
    () => fetchSubjectNotes(subjectId),
    {
      onError: () => {
        toast({ title: 'Error fetching notes', description: 'Please try again later.', variant: 'destructive' });
      },
    }
  );

  // Handle file download using useMutation
  const downloadMutation = useMutation({
    mutationFn: downloadNoteFile,
    onSuccess: ({ fileUrl, title }) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileUrl);
      link.download = `${title}.pdf`;
      link.click();
    },
    onError: () => {
      toast({ title: 'Error downloading file', description: 'Please try again later.', variant: 'destructive' });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading notes</div>;
  }

  return (
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{subjectNotes.name} Notes</h1>
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-600">Subject Notes</CardTitle>
              <CardDescription className="text-gray-600">Access notes for {subjectNotes.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {subjectNotes.notes.map((note) => (
                  <li key={note.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="flex items-center text-gray-700">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      {note.title}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100" onClick={() => window.open(note.fileUrl, '_blank')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-100"
                        onClick={() => downloadMutation.mutate({ fileUrl: note.fileUrl, title: note.title })}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
