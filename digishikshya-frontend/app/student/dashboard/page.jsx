'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, BookOpen, FileText, Calendar, ArrowRight, BarChart2, CheckCircle2 } from 'lucide-react'

// Mock data - replace with actual data fetching
const studentData = {
  name: "John Doe",
  stats: {
    completedAssignments: 15,
    upcomingAssignments: 5,
    averageScore: 85,
    totalSubjects: 6
  },
  recentActivities: [
    { id: 1, type: "Completed Assignment", subject: "Mathematics", date: "2023-06-15" },
    { id: 2, type: "Took MCQ Test", subject: "Science", date: "2023-06-14" },
    { id: 3, type: "Viewed Notes", subject: "English", date: "2023-06-13" },
  ],
  upcomingAssignments: [
    { id: 1, title: "Algebra Homework", subject: "Mathematics", dueDate: "2023-06-20" },
    { id: 2, title: "Science Project", subject: "Science", dueDate: "2023-06-25" },
    { id: 3, title: "Essay Submission", subject: "English", dueDate: "2023-06-22" },
  ]
}

export default function StudentDashboard() {

  return (
   
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt={studentData.name} />
                <AvatarFallback>{studentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <h2 className="text-2xl font-bold mb-6">Welcome back, {studentData.name}!</h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Assignments</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentData.stats.completedAssignments}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentData.stats.upcomingAssignments}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentData.stats.averageScore}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentData.stats.totalSubjects}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {studentData.recentActivities.map((activity) => (
                        <li key={activity.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.type} - {activity.subject}
                            </p>
                            <p className="text-sm text-gray-500">{activity.date}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Upcoming Assignments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {studentData.upcomingAssignments.map((assignment) => (
                        <li key={assignment.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {assignment.title}
                            </p>
                            <p className="text-sm text-gray-500">{assignment.subject} - Due: {assignment.dueDate}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="w-full justify-between" variant="outline">
                      View All Subjects <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button className="w-full justify-between" variant="outline">
                      Practice MCQs <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button className="w-full justify-between" variant="outline">
                      View Performance <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    // </div>
  )
}