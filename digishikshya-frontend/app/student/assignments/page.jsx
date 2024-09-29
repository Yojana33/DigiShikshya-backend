'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Menu, FileText, Upload, CheckCircle, Clock } from 'lucide-react'

// Mock data - replace with actual data fetching
const assignmentsData = {
  newAssignments: [
    { id: 1, title: "Math Problem Set 3", subject: "Mathematics", dueDate: "2023-06-25" },
    { id: 2, title: "English Essay", subject: "English", dueDate: "2023-06-28" },
    { id: 3, title: "Science Lab Report", subject: "Science", dueDate: "2023-06-30" },
  ],
  submittedAssignments: [
    { id: 4, title: "History Research Paper", subject: "History", submittedDate: "2023-06-10", grade: "A-" },
    { id: 5, title: "Physics Problem Set", subject: "Physics", submittedDate: "2023-06-12", grade: "B+" },
    { id: 6, title: "Literature Analysis", subject: "English", submittedDate: "2023-06-15", grade: "Pending" },
  ]
}

export default function AssignmentsPage() {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleSubmit = (assignmentId) => {
    if (selectedFile) {
      console.log(`Submitting file ${selectedFile.name} for assignment ${assignmentId}`)
      // Here you would typically upload the file to your server
      setSelectedFile(null)
    }
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
                <AvatarImage src="https://github.com/shadcn.png" alt="Student" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-6">Assignments</h1>
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new">New Assignments</TabsTrigger>
                <TabsTrigger value="submitted">Submitted Assignments</TabsTrigger>
              </TabsList>
              <TabsContent value="new">
                <div className="grid gap-6">
                  {assignmentsData.newAssignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>{assignment.subject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center">
                          <Input
                            id={`file-upload-${assignment.id}`}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Label
                            htmlFor={`file-upload-${assignment.id}`}
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </Label>
                          {selectedFile && <span className="ml-2 text-sm">{selectedFile.name}</span>}
                        </div>
                        <Button onClick={() => handleSubmit(assignment.id)} disabled={!selectedFile}>
                          Submit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="submitted">
                <div className="grid gap-6">
                  {assignmentsData.submittedAssignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>{assignment.subject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Submitted: {assignment.submittedDate}</p>
                        <p className="text-sm font-medium mt-2">
                          Grade: {assignment.grade === "Pending" ? (
                            <span className="text-yellow-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> Pending
                            </span>
                          ) : (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" /> {assignment.grade}
                            </span>
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
  )
}