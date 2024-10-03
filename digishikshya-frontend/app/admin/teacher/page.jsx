'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash, Search } from 'lucide-react'

// Mock data for teachers and related entities - replace with actual data fetching
const initialAssignments = [
  { id: 1, teacher: "John Doe", batch: "2023", course: "Computer Science", semester: "Fall 2023", subject: "Introduction to Programming" },
  { id: 2, teacher: "Jane Smith", batch: "2023", course: "Mathematics", semester: "Fall 2023", subject: "Calculus I" },
]

const teachers = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams"]
const batches = ["2022", "2023", "2024"]
const courses = ["Computer Science", "Mathematics", "Physics", "Biology"]
const semesters = ["Fall 2023", "Spring 2024", "Fall 2024"]
const subjects = ["Introduction to Programming", "Calculus I", "Physics I", "Biology 101"]

export default function TeacherAssignPage() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAssignments, setFilteredAssignments] = useState(assignments)

  useEffect(() => {
    const results = assignments.filter(assignment =>
      Object.values(assignment).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredAssignments(results)
  }, [assignments, searchTerm])

  const handleCreateAssignment = (newAssignment) => {
    setAssignments([...assignments, { ...newAssignment, id: assignments.length + 1 }])
  }

  const handleEditAssignment = (editedAssignment) => {
    setAssignments(assignments.map(assignment => assignment.id === editedAssignment.id ? editedAssignment : assignment))
    setEditingAssignment(null)
  }

  const handleDeleteAssignment = (assignmentId) => {
    setAssignments(assignments.filter(assignment => assignment.id !== assignmentId))
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Assign Teacher</TabsTrigger>
          <TabsTrigger value="view">View Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateAssignmentForm onCreateAssignment={handleCreateAssignment} />
        </TabsContent>
        <TabsContent value="view">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <AssignmentList 
            assignments={filteredAssignments} 
            onEdit={setEditingAssignment} 
            onDelete={handleDeleteAssignment} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingAssignment !== null} onOpenChange={() => setEditingAssignment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Make changes to the teacher assignment here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingAssignment && (
            <EditAssignmentForm assignment={editingAssignment} onSave={handleEditAssignment} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateAssignmentForm({ onCreateAssignment }) {
  const [teacher, setTeacher] = useState('')
  const [batch, setBatch] = useState('')
  const [course, setCourse] = useState('')
  const [semester, setSemester] = useState('')
  const [subject, setSubject] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateAssignment({ teacher, batch, course, semester, subject })
    setTeacher('')
    setBatch('')
    setCourse('')
    setSemester('')
    setSubject('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Teacher</CardTitle>
        <CardDescription>Select a teacher and assign them to a batch, course, semester, and subject</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch">Batch</Label>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Assign Teacher</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function AssignmentList({ assignments, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{assignment.teacher}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(assignment)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(assignment.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Batch:</p>
                <p>{assignment.batch}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Course:</p>
                <p>{assignment.course}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Semester:</p>
                <p>{assignment.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Subject:</p>
                <p>{assignment.subject}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EditAssignmentForm({ assignment, onSave }) {
  const [teacher, setTeacher] = useState(assignment.teacher)
  const [batch, setBatch] = useState(assignment.batch)
  const [course, setCourse] = useState(assignment.course)
  const [semester, setSemester] = useState(assignment.semester)
  const [subject, setSubject] = useState(assignment.subject)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...assignment, teacher, batch, course, semester, subject })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-teacher">Teacher</Label>
        <Select value={teacher} onValueChange={setTeacher}>
          <SelectTrigger>
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-batch">Batch</Label>
        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger>
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-course">Course</Label>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-semester">Semester</Label>
        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-subject">Subject</Label>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}