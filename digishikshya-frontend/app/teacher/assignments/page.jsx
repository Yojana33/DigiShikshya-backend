'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, Menu, Plus, Search, Filter, Eye, CalendarIcon, Edit, Trash } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for subjects, batches, courses, and semesters - replace with actual data fetching
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]
const batches = ["2021", "2022", "2023"]
const courses = ["Science", "Arts", "Computer"]
const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th"]

// Mock data for assignments - replace with actual data fetching
const assignments = [
  { id: 1, title: "Algebra Basics", description: "Introduction to algebraic concepts", subject: "Mathematics", course: "Science", semester: "1st", batch: "2023", dueDate: "2023-06-20" },
  { id: 2, title: "Newton's Laws", description: "Study of fundamental laws of motion", subject: "Physics", course: "Science", semester: "3rd", batch: "2022", dueDate: "2023-06-22" },
  { id: 3, title: "Periodic Table", description: "Overview of chemical elements", subject: "Chemistry", course: "Science", semester: "1st", batch: "2023", dueDate: "2023-06-25" },
]

function DatePicker({ date, setDate }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default function TeacherAssignmentsPage() {
  const [activeTab, setActiveTab] = useState('create')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filteredAssignments, setFilteredAssignments] = useState(assignments)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingAssignment, setEditingAssignment] = useState(null)
  const router = useRouter()

  const handleSearch = (term) => {
    setSearchTerm(term)
    filterAssignments(term)
  }

  const filterAssignments = (term) => {
    const filtered = assignments.filter(assignment =>
      Object.values(assignment).some(value => 
        value.toString().toLowerCase().includes(term.toLowerCase())
      )
    )
    setFilteredAssignments(filtered)
  }

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
  }

  const handleDelete = (assignmentId) => {
    // Add logic to delete the assignment
    console.log(`Deleting assignment with id: ${assignmentId}`)
    setFilteredAssignments(filteredAssignments.filter(a => a.id !== assignmentId))
  }

  const handleSaveEdit = (editedAssignment) => {
    // Add logic to save the edited assignment
    console.log('Saving edited assignment:', editedAssignment)
    setFilteredAssignments(filteredAssignments.map(a => a.id === editedAssignment.id ? editedAssignment : a))
    setEditingAssignment(null)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
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
          <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="create" className="text-blue-600 hover:text-blue-800">Create Assignment</TabsTrigger>
              <TabsTrigger value="created" className="text-blue-600 hover:text-blue-800">Created Assignments</TabsTrigger>
              <TabsTrigger value="view" className="text-blue-600 hover:text-blue-800">View Assignments</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <CreateAssignmentForm />
            </TabsContent>
            <TabsContent value="created">
              <CreatedAssignmentsList 
                assignments={filteredAssignments} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="view">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative w-full md:w-1/3">
                  <Input
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full md:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              {isFilterOpen && (
                <FilterForm setFilteredAssignments={setFilteredAssignments} />
              )}
              <AssignmentsList assignments={filteredAssignments} router={router} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={editingAssignment !== null} onOpenChange={() => setEditingAssignment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Make changes to your assignment here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingAssignment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingAssignment.title}
                  onChange={(e) => setEditingAssignment({...editingAssignment, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editingAssignment.description}
                  onChange={(e) => setEditingAssignment({...editingAssignment, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Select
                  value={editingAssignment.subject}
                  onValueChange={(value) => setEditingAssignment({...editingAssignment, subject: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editingAssignment.dueDate}
                  onChange={(e) => setEditingAssignment({...editingAssignment, dueDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={() => handleSaveEdit(editingAssignment)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateAssignmentForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [batch, setBatch] = useState('')
  const [course, setCourse] = useState('')
  const [semester, setSemester] = useState('')
  const [dueDate, setDueDate] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add logic to save the assignment
    console.log({ title, description, subject, batch, course, semester, dueDate })
    // Reset form
    setTitle('')
    setDescription('')
    setSubject('')
    setBatch('')
    setCourse('')
    setSemester('')
    setDueDate(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Assignment</CardTitle>
        <CardDescription>Fill in the details to create a new assignment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Select value={batch} onValueChange={setBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Batch" />
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
                  <SelectValue placeholder="Select Course" />
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
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePicker date={dueDate} setDate={setDueDate} />
            </div>
          </div>
          <Button type="submit" className="w-full">Create Assignment</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function FilterForm({ setFilteredAssignments }) {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [dueDate, setDueDate] = useState(null)

  const handleFilter = () => {
    const filtered = assignments.filter(assignment => 
      (!selectedSubject || assignment.subject === selectedSubject) &&
      (!selectedBatch || assignment.batch === selectedBatch) &&
      (!selectedCourse || assignment.course === selectedCourse) &&
      (!selectedSemester || assignment.semester === selectedSemester) &&
      (!dueDate || new Date(assignment.dueDate) <= dueDate)
    )
    setFilteredAssignments(filtered)
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger>
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Before)</Label>
            <DatePicker date={dueDate} setDate={setDueDate} />
          </div>
        </div>
        <Button onClick={handleFilter} className="mt-4 w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}

function AssignmentsList({ assignments, router }) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>{assignment.subject}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Course:</p>
                <p>{assignment.course}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Semester:</p>
                <p>{assignment.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Batch:</p>
                <p>{assignment.batch}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Due Date:</p>
                <p>{assignment.dueDate}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push(`/teacher/assignments/submission?assignmentId=${assignment.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function CreatedAssignmentsList({ assignments, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{assignment.title}</CardTitle>
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
            <CardDescription>{assignment.subject}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{assignment.description}</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Course:</p>
                <p>{assignment.course}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Semester:</p>
                <p>{assignment.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Batch:</p>
                <p>{assignment.batch}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Due Date:</p>
                <p>{assignment.dueDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}