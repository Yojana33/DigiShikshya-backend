'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TeacherSidebar from './teacher-sidebar'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, Menu, BookOpen, Users, FileText, CheckCircle, ArrowRight } from 'lucide-react'

// Mock data - replace with actual data fetching
const quickStats = [
  { title: "Total Students", value: 150, icon: Users },
  { title: "Active Courses", value: 5, icon: BookOpen },
  { title: "Pending Assignments", value: 25, icon: FileText },
  { title: "Graded Submissions", value: 75, icon: CheckCircle },
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

export default function TeacherDashboard() {
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="hidden md:block">
        <TeacherSidebar />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <TeacherSidebar />
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col overflow-hidden">
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
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
              <Card className="col-span-1">
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
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequently used actions</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button onClick={() => router.push('/teacher/create-assignment')}>
                    Create New Assignment
                  </Button>
                  <Button onClick={() => router.push('/teacher/grade-submissions')}>
                    Grade Submissions
                  </Button>
                  <Button onClick={() => router.push('/teacher/schedule-class')}>
                    Schedule a Class
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Latest updates for teachers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Staff meeting scheduled for Friday, 2 PM</li>
                    <li>New grading system tutorial available</li>
                    <li>Reminder: Submit monthly reports by 30th</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Helpful tools and documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-blue-600 hover:underline">Teacher's Handbook</a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline">Curriculum Guidelines</a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline">Tech Support</a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}