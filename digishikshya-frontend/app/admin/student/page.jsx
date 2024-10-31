'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/config/axiosconfig';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const fetchStudents = async () => {
  const response = await axiosInstance.get('/api/v1/enrollment/all');
  return response.data.items;
};

const fetchCourses = async () => {
  const response = await axiosInstance.get('/api/v1/course/all');
  return response.data.items;
};

const fetchBatches = async () => {
  const response = await axiosInstance.get('/api/v1/batch/all');
  return response.data.items;
};

const fetchSemesters = async () => {
  const response = await axiosInstance.get('/api/v1/semester/all');
  return response.data.items;
};

const addStudent = async (student) => {
  const response = await axiosInstance.post('/api/v1/enrollment/enroll', student);
  return response.data;
};

const updateStudent = async (student) => {
  const response = await axiosInstance.patch(`/api/v1/enrollment/update`, student);
  return response.data;
};

const deleteStudent = async (studentId) => {
  const response = await axiosInstance.delete(`/api/v1/enrollment/delete`);
  return response.data;
};

export default function EnrollStudentPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch students, courses, batches, and semesters data from API
  const { data: students, error: studentError, isLoading: isLoadingStudents } = useQuery(
    ['students'],
    fetchStudents,
    {
      onSuccess: (data) => {
        console.log('Successfully fetched students:', data);
      },
      onError: (error) => {
        console.error('Error fetching students:', error);
      }
    }
  );

  const { data: courses, error: courseError, isLoading: isLoadingCourses } = useQuery(
    ['courses'],
    fetchCourses,
    {
      onSuccess: (data) => {
        console.log('Successfully fetched courses:', data);
      },
      onError: (error) => {
        console.error('Error fetching courses:', error);
      }
    }
  );

  const { data: batches, error: batchError, isLoading: isLoadingBatches } = useQuery(
    ['batches'],
    fetchBatches,
    {
      onSuccess: (data) => {
        console.log('Successfully fetched batches:', data);
      },
      onError: (error) => {
        console.error('Error fetching batches:', error);
      }
    }
  );

  const { data: semesters, error: semesterError, isLoading: isLoadingSemesters } = useQuery(
    ['semesters'],
    fetchSemesters,
    {
      onSuccess: (data) => {
        console.log('Successfully fetched semesters:', data);
      },
      onError: (error) => {
        console.error('Error fetching semesters:', error);
      }
    }
  );

  // Add, update, delete mutations for students
  const addMutation = useMutation(addStudent, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['students']);
      toast({ title: 'Student Created', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation(updateStudent, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['students']);
      toast({ title: 'Student Updated', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation(deleteStudent, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['students']);
      toast({ title: 'Student Deleted', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const [editingStudent, setEditingStudent] = useState(null);

  const handleCreateStudent = (newStudent) => {
    addMutation.mutate(newStudent);
  };

  const handleEditStudent = (editedStudent) => {
    updateMutation.mutate(editedStudent);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId) => {
    deleteMutation.mutate(studentId);
  };

  // Handling loading and error states
  if (isLoadingStudents || isLoadingCourses || isLoadingBatches || isLoadingSemesters) {
    return <div>Loading...</div>; // You might want to add a spinner here
  }

  if (studentError || courseError || batchError || semesterError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster />
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Enroll Student</TabsTrigger>
          <TabsTrigger value="view">View Students</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateStudentForm 
            courses={courses} 
            batches={batches} 
            semesters={semesters} 
            onCreateStudent={handleCreateStudent} 
          />
        </TabsContent>
        <TabsContent value="view">
          <StudentList 
            students={students} 
            onEdit={setEditingStudent} 
            onDelete={handleDeleteStudent} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingStudent !== null} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Make changes to the student here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <EditStudentForm 
              student={editingStudent} 
              courses={courses} 
              batches={batches} 
              semesters={semesters} 
              onSave={handleEditStudent} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateStudentForm({ courses, batches, semesters, onCreateStudent }) {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateStudent({ name, batch, course, semester });
    setName('');
    setBatch('');
    setCourse('');
    setSemester('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enroll New Student</CardTitle>
        <CardDescription>Enter the details for the new student</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
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
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
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
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Enroll Student</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EditStudentForm({ student, courses, batches, semesters, onSave }) {
  const [name, setName] = useState(student.name);
  const [batch, setBatch] = useState(student.batchId);
  const [course, setCourse] = useState(student.courseId);
  const [semester, setSemester] = useState(student.semesterId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: student.id, name, batch, course, semester });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Student Name</Label>
        <Input 
          id="edit-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
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
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
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
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}

function StudentList({ students, onEdit, onDelete }) {
  return (
    <div>
      {students.map(student => (
        <div key={student.id} className="flex justify-between items-center">
          <div>{student.name}</div>
          <div>
            <Button onClick={() => onEdit(student)}><Edit /></Button>
            <Button onClick={() => onDelete(student.id)}><Trash /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
