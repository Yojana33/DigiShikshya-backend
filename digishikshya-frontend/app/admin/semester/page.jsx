'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash } from 'lucide-react'
import { fetchSemesters, addSemester, updateSemester, deleteSemester, fetchCourses } from '@/lib/api';

export default function SemesterPage() {
  const queryClient = useQueryClient();
  const { data: semesters, error: semestersError, isLoading: isLoadingSemesters } = useQuery(['semesters'], fetchSemesters);
  const { data: courses, error: coursesError, isLoading: isLoadingCourses } = useQuery(['courses'], fetchCourses);
  const [editingSemester, setEditingSemester] = useState(null);

  const addSemesterMutation = useMutation(addSemester, {
    onSuccess: () => {
      queryClient.invalidateQueries(['semesters']);
    },
  });

  const updateSemesterMutation = useMutation(updateSemester, {
    onSuccess: () => {
      queryClient.invalidateQueries(['semesters']);
    },
  });

  const deleteSemesterMutation = useMutation(deleteSemester, {
    onSuccess: () => {
      queryClient.invalidateQueries(['semesters']);
    },
  });

  const handleCreateSemester = (newSemester) => {
    addSemesterMutation.mutate(newSemester);
  };

  const handleEditSemester = (editedSemester) => {
    updateSemesterMutation.mutate(editedSemester);
    setEditingSemester(null);
  };

  const handleDeleteSemester = (semesterId) => {
    deleteSemesterMutation.mutate(semesterId);
  };

  if (isLoadingSemesters || isLoadingCourses) {
    return <div>Loading...</div>;
  }

  if (semestersError || coursesError) {
    return <div>Error: {semestersError?.message || coursesError?.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Semester</TabsTrigger>
          <TabsTrigger value="view">View Semesters</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateSemesterForm onCreateSemester={handleCreateSemester} />
        </TabsContent>
        <TabsContent value="view">
          <SemesterList 
            semesters={semesters} 
            onEdit={setEditingSemester} 
            onDelete={handleDeleteSemester} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingSemester !== null} onOpenChange={() => setEditingSemester(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Semester</DialogTitle>
            <DialogDescription>
              Make changes to the semester here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingSemester && (
            <EditSemesterForm semester={editingSemester} onSave={handleEditSemester} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateSemesterForm({ onCreateSemester }) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [course, setCourse] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateSemester({ name, startDate, endDate, course })
    setName('')
    setStartDate('')
    setEndDate('')
    setCourse('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Semester</CardTitle>
        <CardDescription>Enter the details for a new semester</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Semester Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input 
              id="startDate" 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input 
              id="endDate" 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              required 
            />
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
          <Button type="submit" className="w-full">Create Semester</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function SemesterList({ semesters, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {semesters.map((semester) => (
        <Card key={semester.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{semester.name}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(semester)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(semester.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Start Date:</p>
                <p>{semester.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">End Date:</p>
                <p>{semester.endDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Course:</p>
                <p>{semester.course}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EditSemesterForm({ semester, onSave }) {
  const [name, setName] = useState(semester.name)
  const [startDate, setStartDate] = useState(semester.startDate)
  const [endDate, setEndDate] = useState(semester.endDate)
  const [course, setCourse] = useState(semester.course)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...semester, name, startDate, endDate, course })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Semester Name</Label>
        <Input 
          id="edit-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-startDate">Start Date</Label>
        <Input 
          id="edit-startDate" 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-endDate">End Date</Label>
        <Input 
          id="edit-endDate" 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          required 
        />
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
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}