'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Upload,
  Bell
} from 'lucide-react'

// Mock data - replace with actual API calls
const fetchCounts = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    students: 150,
    teachers: 20,
    courses: 10,
    batches: 5,
    subjects: 30,
    semesters: 6,
    enrollments: 300,
    assignments: 50,
    materials: 100,
    submissions: 250
  }
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCounts = async () => {
      const data = await fetchCounts()
      setCounts(data)
      setLoading(false)
    }
    loadCounts()
  }, [])

  const countCards = [
    { title: 'Students', count: counts.students, icon: Users, color: 'bg-blue-500' },
    { title: 'Teachers', count: counts.teachers, icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Courses', count: counts.courses, icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Batches', count: counts.batches, icon: Users, color: 'bg-yellow-500' },
    { title: 'Subjects', count: counts.subjects, icon: BookOpen, color: 'bg-red-500' },
    { title: 'Semesters', count: counts.semesters, icon: Calendar, color: 'bg-indigo-500' },
    { title: 'Enrollments', count: counts.enrollments, icon: FileText, color: 'bg-pink-500' },
    { title: 'Assignments', count: counts.assignments, icon: CheckSquare, color: 'bg-teal-500' },
  ]

  const quickLinks = [
    { title: 'View Materials', href: '/admin/materials', icon: FileText, color: 'bg-blue-500' },
    { title: 'View Assignments', href: '/admin/assignments', icon: CheckSquare, color: 'bg-green-500' },
    { title: 'View Submissions', href: '/admin/submissions', icon: Upload, color: 'bg-purple-500' },
  ]

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {countCards.map((card, index) => (
              <Card key={index} className={`bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${card.color}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{card.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className={`bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${link.color}`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <link.icon className="h-5 w-5 mr-2 text-white" />
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    Access and manage {link.title.toLowerCase()}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={link.href} passHref>
                    <Button className="w-full bg-white text-black hover:bg-gray-200">
                      Go to {link.title}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}