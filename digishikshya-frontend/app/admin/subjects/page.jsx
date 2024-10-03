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

// Mock data for subjects and related entities - replace with actual data fetching
const initialSubjects = [
  { id: 1, name: "Introduction to Programming", code: "CS101", description: "Basic programming concepts", creditHours: 3, batch: "2023", course: "Computer Science", semester: "Fall 2023" },
  { id: 2, name: "Calculus I", code: "MATH201", description: "Fundamental calculus concepts", creditHours: 4, batch: "2023", course: "Mathematics", semester: "Fall 2023" },
]

const batches = ["2022", "2023", "2024"]
const courses = ["Computer Science", "Mathematics", "Physics", "Biology"]
const semesters = ["Fall 2023", "Spring 2024", "Fall 2024"]

export default function SubjectPage() {
  const [subjects, setSubjects] = useState(initialSubjects)
  const [editingSubject, setEditingSubject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSubjects, setFilteredSubjects] = useState(subjects)

  useEffect(() => {
    const results = subjects.filter(subject =>
      Object.values(subject).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredSubjects(results)
  }, [subjects, searchTerm])

  const handleCreateSubject = (newSubject) => {
    setSubjects([...subjects, { ...newSubject, id: subjects.length + 1 }])
  }

  const handleEditSubject = (editedSubject) => {
    setSubjects(subjects.map(subject => subject.id === editedSubject.id ? editedSubject : subject))
    setEditingSubject(null)
  }

  const handleDeleteSubject = (subjectId) => {
    setSubjects(subjects.filter(subject => subject.id !== subjectId))
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Subject</TabsTrigger>
          <TabsTrigger value="view">View Subjects</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateSubjectForm onCreateSubject={handleCreateSubject} />
        </TabsContent>
        <TabsContent value="view">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <SubjectList 
            subjects={filteredSubjects} 
            onEdit={setEditingSubject} 
            onDelete={handleDeleteSubject} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingSubject !== null} onOpenChange={() => setEditingSubject(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Make changes to the subject here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingSubject && (
            <EditSubjectForm subject={editingSubject} onSave={handleEditSubject} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateSubjectForm({ onCreateSubject }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [creditHours, setCreditHours] = useState('')
  const [batch, setBatch] = useState('')
  const [course, setCourse] = useState('')
  const [semester, setSemester] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateSubject({ name, code, description, creditHours: parseInt(creditHours), batch, course, semester })
    setName('')
    setCode('')
    setDescription('')
    setCreditHours('')
    setBatch('')
    setCourse('')
    setSemester('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Subject</CardTitle>
        <CardDescription>Enter the details for a new subject</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Subject Code</Label>
            <Input 
              id="code" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creditHours">Credit Hours</Label>
            <Input 
              id="creditHours" 
              type="number" 
              value={creditHours} 
              onChange={(e) => setCreditHours(e.target.value)} 
              required 
            />
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
          <Button type="submit" className="w-full">Create Subject</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function SubjectList({ subjects, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <Card key={subject.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{subject.name}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(subject)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(subject.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <CardDescription>{subject.code}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Description:</p>
                <p>{subject.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Credit Hours:</p>
                <p>{subject.creditHours}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Batch:</p>
                <p>{subject.batch}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Course:</p>
                <p>{subject.course}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Semester:</p>
                <p>{subject.semester}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EditSubjectForm({ subject, onSave }) {
  const [name, setName] = useState(subject.name)
  const [code, setCode] = useState(subject.code)
  const [description, setDescription] = useState(subject.description)
  const [creditHours, setCreditHours] = useState(subject.creditHours)
  const [batch, setBatch] = useState(subject.batch)
  const [course, setCourse] = useState(subject.course)
  const [semester, setSemester] = useState(subject.semester)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...subject, name, code, description, creditHours: parseInt(creditHours), batch, course, semester })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Subject Name</Label>
        <Input 
          id="edit-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-code">Subject Code</Label>
        <Input 
          id="edit-code" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Input 
          id="edit-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-creditHours">Credit Hours</Label>
        <Input 
          id="edit-creditHours" 
          type="number" 
          value={creditHours} 
          onChange={(e) => setCreditHours(e.target.value)} 
          required 
        />
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
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}