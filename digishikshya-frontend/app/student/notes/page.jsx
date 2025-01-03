'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, FileText, Download, Eye } from 'lucide-react'

// Mock data for subject notes - replace with actual data fetching
const subjectNotes = {
  id: 2,
  name: "Science",
  notes: [
    { id: 1, title: "Newton's Laws", fileUrl: "/path/to/newtons-laws.pdf" },
    { id: 2, title: "Thermodynamics", fileUrl: "/path/to/thermodynamics.pdf" },
    { id: 3, title: "Periodic Table", fileUrl: "/path/to/periodic-table.pdf" },
    { id: 4, title: "Chemical Bonding", fileUrl: "/path/to/chemical-bonding.pdf" },
    { id: 5, title: "Cell Structure", fileUrl: "/path/to/cell-structure.pdf" },
    { id: 6, title: "Genetics", fileUrl: "/path/to/genetics.pdf" },
  ]
}

export default function NotesPage() {
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
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100" onClick={() => {
                        const link = document.createElement('a');
                        link.href = note.fileUrl;
                        link.download = `${note.title}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>
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
    </div>
  )
}