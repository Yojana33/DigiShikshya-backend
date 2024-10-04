'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Eye, FileText, Download, File, Image as ImageIcon } from 'lucide-react'

// Mock data for submissions
const submissions = [
  { id: 1, assignmentTitle: 'React Hooks Essay', studentName: 'Alice Johnson', batch: '2023', course: 'Computer Science', semester: '3rd', subject: 'Web Development', submissionDate: '2023-06-14', fileUrl: 'https://example.com/submission1.pdf', fileType: 'pdf' },
  { id: 2, assignmentTitle: 'Data Structures Implementation', studentName: 'Bob Smith', batch: '2022', course: 'Computer Science', semester: '2nd', subject: 'Data Structures', submissionDate: '2023-06-19', fileUrl: 'https://example.com/submission2.txt', fileType: 'txt' },
  { id: 3, assignmentTitle: 'Chemistry Lab Report', studentName: 'Charlie Brown', batch: '2023', course: 'Chemistry', semester: '1st', subject: 'General Chemistry', submissionDate: '2023-06-17', fileUrl: 'https://example.com/submission3.jpg', fileType: 'image' },
  // Add more mock data as needed
]

export default function ViewSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const filteredSubmissions = submissions.filter(submission =>
    Object.values(submission).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5" />
      case 'image':
        return <ImageIcon className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const renderFilePreview = (submission) => {
    switch (submission.fileType) {
      case 'pdf':
        return (
          <iframe
            src={submission.fileUrl}
            className="w-full h-[600px]"
            title={`${submission.assignmentTitle} - ${submission.studentName}`}
          />
        )
      case 'image':
        return (
          <img
            src={submission.fileUrl}
            alt={`${submission.assignmentTitle} - ${submission.studentName}`}
            className="max-w-full h-auto"
          />
        )
      case 'txt':
        return (
          <iframe
            src={submission.fileUrl}
            className="w-full h-[600px]"
            title={`${submission.assignmentTitle} - ${submission.studentName}`}
          />
        )
      default:
        return <p>Preview not available for this file type. Please download to view.</p>
    }
  }

  const renderPreview = (submission) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Assignment:</strong> {submission.assignmentTitle}</p>
            <p><strong>Student:</strong> {submission.studentName}</p>
            <p><strong>Submission Date:</strong> {submission.submissionDate}</p>
            <p><strong>Batch:</strong> {submission.batch}</p>
            <p><strong>Course:</strong> {submission.course}</p>
            <p><strong>Semester:</strong> {submission.semester}</p>
            <p><strong>Subject:</strong> {submission.subject}</p>
          </div>
          <div className="flex flex-col items-end">
            <Button onClick={() => window.open(submission.fileUrl, '_blank')}>
              <Download className="h-4 w-4 mr-2" />
              Download Submission
            </Button>
          </div>
        </div>
        <div className="mt-4 border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">File Preview</h3>
          {renderFilePreview(submission)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">View Submissions</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Submissions List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>File Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.assignmentTitle}</TableCell>
                        <TableCell>{submission.studentName}</TableCell>
                        <TableCell>{submission.batch}</TableCell>
                        <TableCell>{submission.course}</TableCell>
                        <TableCell>{submission.semester}</TableCell>
                        <TableCell>{submission.subject}</TableCell>
                        <TableCell>{submission.submissionDate}</TableCell>
                        <TableCell>{getFileIcon(submission.fileType)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{selectedSubmission?.assignmentTitle} - Submission</DialogTitle>
                              </DialogHeader>
                              {selectedSubmission && renderPreview(selectedSubmission)}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}