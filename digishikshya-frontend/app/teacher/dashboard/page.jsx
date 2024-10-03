'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, BookOpen, FileText, CheckCircle, ArrowRight, PenTool, Book } from 'lucide-react'

// Mock data - replace with actual data fetching
const quickStats = [
  { title: "Active Courses", value: 5, icon: BookOpen },
  { title: "Pending Assignments", value: 25, icon: FileText },
  { title: "Submitted Assignments", value: 75, icon: CheckCircle },
  { title: "Provided Notes", value: 30, icon: Book },
]

const upcomingAssignments = [
  { id: 1, title: "Math Quiz", dueDate: "2023-06-25", course: "Mathematics" },
  { id: 2, title: "Physics Lab Report", dueDate: "2023-06-28", course: "Physics" },
  { id: 3, title: "Literature Essay", dueDate: "2023-06-30", course: "English Literature" },
]

const recentSubmissions = [
  { id: 1, studentName: "John Doe", assignment: "Chemistry Lab Report", submittedDate: "2023-06-20" },
  { id: 2, studentName: "Jane Smith", assignment: "History Essay", submittedDate: "2023-06-21" },
  { id: 3, studentName: "Alice Johnson", assignment: "Programming Project", submittedDate: "2023-06-22" },
]

const mcqQuestions = [
  { id: 1, question: "What is the capital of France?", subject: "Geography" },
  { id: 2, question: "Who wrote 'Romeo and Juliet'?", subject: "Literature" },
  { id: 3, question: "What is the chemical symbol for water?", subject: "Chemistry" },
]

export default function TeacherDashboard() {
  const router = useRouter()

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
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
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="col-span-1 bg-white">
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Assignments due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => router.push('/teacher/assignments')}>
                  View All Assignments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1 bg-white">
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.studentName}</TableCell>
                        <TableCell>{submission.assignment}</TableCell>
                        <TableCell>{submission.submittedDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => router.push('/teacher/submissions')}>
                  View All Submissions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button onClick={() => router.push('/teacher/create-assignment')}>
                  Create New Assignment
                </Button>
                <Button onClick={() => router.push('/teacher/view-submissions')}>
                  View Submissions
                </Button>
                <Button onClick={() => router.push('/teacher/provide-materials')}>
                  Provide Materials
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>MCQ Questions</CardTitle>
                <CardDescription>Recently added multiple choice questions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mcqQuestions.map((mcq) => (
                    <li key={mcq.id} className="flex justify-between items-center">
                      <span className="text-sm truncate">{mcq.question}</span>
                      <span className="text-xs text-gray-500">{mcq.subject}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => router.push('/teacher/mcq-questions')}>
                  Manage MCQ Questions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}