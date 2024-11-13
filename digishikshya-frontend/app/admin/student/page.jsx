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
  const response = await axiosInstance.delete(`/api/v1/enrollment/delete`, {
    data: { id: studentId },
  });
  return response.data;
};

export default function EnrollStudentPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch students, batches, and semesters data from API
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
  if (isLoadingStudents || isLoadingBatches || isLoadingSemesters) {
    return <div>Loading...</div>; // You might want to add a spinner here
  }

  if (studentError || batchError || semesterError) {
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

function CreateStudentForm({ batches, semesters, onCreateStudent }) {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [enrolledDate, setEnrolledDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateStudent({ name, batch, semester, enrolledDate });
    setName('');
    setBatch('');
    setSemester('');
    setEnrolledDate('');
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
                  <SelectItem key={b.id} value={b.id}>{b.batchStartDate}</SelectItem>
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
                  <SelectItem key={s.id} value={s.id}>{s.semesterName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="enrolledDate">Enrolled Date</Label>
            <Input 
              id="enrolledDate" 
              type="date" 
              value={enrolledDate} 
              onChange={(e) => setEnrolledDate(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full">Enroll Student</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EditStudentForm({ student, batches, semesters, onSave }) {
  const [name, setName] = useState(student.name);
  const [batch, setBatch] = useState(student.batchId);
  const [semester, setSemester] = useState(student.semesterId);
  const [enrolledDate, setEnrolledDate] = useState(student.enrolledDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: student.id, name, batch, semester, enrolledDate });
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
              <SelectItem key={b.id} value={b.id}>{b.batchStartDate}</SelectItem>
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
              <SelectItem key={s.id} value={s.id}>{s.semesterName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-enrolledDate">Enrolled Date</Label>
        <Input 
          id="edit-enrolledDate" 
          type="date" 
          value={enrolledDate} 
          onChange={(e) => setEnrolledDate(e.target.value)} 
          required 
        />
      </div>
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}

function StudentList({ students, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {students.length === 0 ? (
        <div>No students available.</div>
      ) : (
        students.map((student) => (
          <Card key={student.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
            <CardTitle>
              <p className="text-lg font-medium">Student Name: {student.studentName}</p>
              <p className="text-lg text-black-500">
                Course Name: {student.courseName}
              </p>
              <p className="text-lg text-black-500">
                Batch Name: {student.batchStartDate}
              </p>
              <p className="text-lg text-black-500">
                Semester Name: {student.semesterName}
              </p>
              <p className="text-lg text-black-500">
                Enrolled Date: {new Date(student.enrolledDate).toLocaleDateString()}
              </p>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(student)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => onDelete(student.id)}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}