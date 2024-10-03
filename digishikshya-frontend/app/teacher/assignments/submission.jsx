'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
//import TeacherSidebar from './teacher-sidebar'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, Menu, Search, FileText, AlertTriangle } from 'lucide-react'

// Mock data for submissions - replace with actual data fetching
const submissions = [
  { id: 1, studentName: "John Doe", fileName: "assignment1.pdf", submissionDate: "2023-06-15" },
  { id: 2, studentName: "Jane Smith", fileName: "jane_assignment.docx", submissionDate: "2023-06-16" },
  { id: 3, studentName: "Alice Johnson", fileName: "alice_submission.pdf", submissionDate: "2023-06-17" },
  { id: 4, studentName: "Bob Brown", fileName: "bob_homework.pdf", submissionDate: "2023-06-18" },
  { id: 5, studentName: "Eva Williams", fileName: "eva_assignment1.docx", submissionDate: "2023-06-19" },
]

export default function TeacherSubmissionPage() {
  const [filteredSubmissions, setFilteredSubmissions] = useState(submissions)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = submissions.filter(submission =>
      submission.studentName.toLowerCase().includes(term.toLowerCase()) ||
      submission.fileName.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredSubmissions(filtered)
  }

  const handleCheckPlagiarism = () => {
    // Implement plagiarism checking logic here
    console.log("Checking plagiarism for all submissions")
    // You would typically send a request to your backend here
    alert("Plagiarism check initiated. Results will be available soon.")
  }

  return (
    // <div className="flex h-screen bg-gradient-to-b from-blue-100 to-white">
    //   <div className="hidden md:block">
    //     <TeacherSidebar />
    //   </div>
    //   <Sheet>
    //     <SheetTrigger asChild>
    //       <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
    //         <Menu className="h-5 w-5" />
    //       </Button>
    //     </SheetTrigger>
    //     <SheetContent side="left" className="p-0">
    //       <TeacherSidebar />
    //     </SheetContent>
    //   </Sheet>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Assignment Submissions</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="@teacher" />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                  <Button 
                    onClick={handleCheckPlagiarism}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Check Plagiarism
                  </Button>
                  <div className="relative w-full md:w-1/3">
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Submitted Assignments</CardTitle>
                <CardDescription>Review and manage student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.studentName}</TableCell>
                        <TableCell>{submission.fileName}</TableCell>
                        <TableCell>{submission.submissionDate}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => console.log(`Viewing submission ${submission.id}`)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
   // </div>
  )
}