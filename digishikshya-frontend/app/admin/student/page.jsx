'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash, Search } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { fetchEnrollments, addEnrollment, updateEnrollment, deleteEnrollment, fetchStudents, fetchBatches, fetchCourses, fetchSemesters } from '@/lib/api';

export default function EnrollStudentPage() {
  const queryClient = useQueryClient();
  const { data: enrollments, error: enrollmentsError, isLoading: isLoadingEnrollments } = useQuery(['enrollments'], fetchEnrollments);
  const { data: students, error: studentsError, isLoading: isLoadingStudents } = useQuery(['students'], fetchStudents);
  const { data: batches, error: batchesError, isLoading: isLoadingBatches } = useQuery(['batches'], fetchBatches);
  const { data: courses, error: coursesError, isLoading: isLoadingCourses } = useQuery(['courses'], fetchCourses);
  const { data: semesters, error: semestersError, isLoading: isLoadingSemesters } = useQuery(['semesters'], fetchSemesters);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);

  useEffect(() => {
    if (enrollments) {
      const results = enrollments.filter(enrollment =>
        Object.values(enrollment).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredEnrollments(results);
    }
  }, [enrollments, searchTerm]);

  const addEnrollmentMutation = useMutation(addEnrollment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
    },
  });

  const updateEnrollmentMutation = useMutation(updateEnrollment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
    },
  });

  const deleteEnrollmentMutation = useMutation(deleteEnrollment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
    },
  });

  const handleCreateEnrollment = (newEnrollment) => {
    addEnrollmentMutation.mutate(newEnrollment);
  };

  const handleEditEnrollment = (editedEnrollment) => {
    updateEnrollmentMutation.mutate(editedEnrollment);
    setEditingEnrollment(null);
  };

  const handleDeleteEnrollment = (enrollmentId) => {
    deleteEnrollmentMutation.mutate(enrollmentId);
  };

  if (isLoadingEnrollments || isLoadingStudents || isLoadingBatches || isLoadingCourses || isLoadingSemesters) {
    return <div>Loading...</div>;
  }

  if (enrollmentsError || studentsError || batchesError || coursesError || semestersError) {
    return <div>Error: {enrollmentsError?.message || studentsError?.message || batchesError?.message || coursesError?.message || semestersError?.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Enroll Student</TabsTrigger>
          <TabsTrigger value="view">View Enrollments</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateEnrollmentForm onCreateEnrollment={handleCreateEnrollment} />
        </TabsContent>
        <TabsContent value="view">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search enrollments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <EnrollmentList 
            enrollments={filteredEnrollments} 
            onEdit={setEditingEnrollment} 
            onDelete={handleDeleteEnrollment} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingEnrollment !== null} onOpenChange={() => setEditingEnrollment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Enrollment</DialogTitle>
            <DialogDescription>
              Make changes to the student enrollment here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingEnrollment && (
            <EditEnrollmentForm enrollment={editingEnrollment} onSave={handleEditEnrollment} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateEnrollmentForm({ onCreateEnrollment }) {
  const [student, setStudent] = useState('')
  const [batch, setBatch] = useState('')
  const [course, setCourse] = useState('')
  const [semester, setSemester] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateEnrollment({ student, batch, course, semester })
    setStudent('')
    setBatch('')
    setCourse('')
    setSemester('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enroll Student</CardTitle>
        <CardDescription>Enter the details to enroll a student</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {student ? student : "Select student..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search student..." />
                  <CommandEmpty>No student found.</CommandEmpty>
                  <CommandGroup>
                    {students.map((s) => (
                      <CommandItem
                        key={s}
                        onSelect={(currentValue) => {
                          setStudent(currentValue === student ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        {s}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
          <Button type="submit" className="w-full">Enroll Student</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function EnrollmentList({ enrollments, onEdit, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollments.map((enrollment) => (
          <TableRow key={enrollment.id}>
            <TableCell>{enrollment.student}</TableCell>
            <TableCell>{enrollment.batch}</TableCell>
            <TableCell>{enrollment.course}</TableCell>
            <TableCell>{enrollment.semester}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(enrollment)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(enrollment.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function EditEnrollmentForm({ enrollment, onSave }) {
  const [student, setStudent] = useState(enrollment.student)
  const [batch, setBatch] = useState(enrollment.batch)
  const [course, setCourse] = useState(enrollment.course)
  const [semester, setSemester] = useState(enrollment.semester)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...enrollment, student, batch, course, semester })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-student">Student</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {student ? student : "Select student..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search student..." />
              <CommandEmpty>No student found.</CommandEmpty>
              <CommandGroup>
                {students.map((s) => (
                  <CommandItem
                    key={s}
                    onSelect={(currentValue) => {
                      setStudent(currentValue === student ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {s}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
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