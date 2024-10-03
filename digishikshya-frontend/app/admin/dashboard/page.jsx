'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Upload
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
    { title: 'Students', count: counts.students, icon: Users },
    { title: 'Teachers', count: counts.teachers, icon: GraduationCap },
    { title: 'Courses', count: counts.courses, icon: BookOpen },
    { title: 'Batches', count: counts.batches, icon: Users },
    { title: 'Subjects', count: counts.subjects, icon: BookOpen },
    { title: 'Semesters', count: counts.semesters, icon: Calendar },
    { title: 'Enrollments', count: counts.enrollments, icon: FileText },
    { title: 'Assignments', count: counts.assignments, icon: CheckSquare },
  ]

  const quickLinks = [
    { title: 'View Materials', href: '/admin/materials', icon: FileText },
    { title: 'View Assignments', href: '/admin/assignments', icon: CheckSquare },
    { title: 'View Submissions', href: '/admin/submissions', icon: Upload },
  ]

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {countCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <link.icon className="h-8 w-8 text-primary mb-2" />
              <CardDescription>
                Access and manage {link.title.toLowerCase()}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={link.href} passHref>
                <Button className="w-full">
                  Go to {link.title}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}