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

const fetchTeachers = async () => {
  const response = await axiosInstance.get('/api/v1/teacher-assign/all');
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

const addTeacher = async (teacher) => {
  const response = await axiosInstance.post('/api/v1/teacher-assign/assign', teacher);
  return response.data;
};

const updateTeacher = async (teacher) => {
  const response = await axiosInstance.patch(`/api/v1/teacher-assign/update`, teacher);
  return response.data;
};

const deleteTeacher = async (teacherId) => {
  const response = await axiosInstance.delete(`/api/v1/teacher-assign/delete`);
  return response.data;
};

export default function TeacherPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: teachers, error: teacherError, isLoading: isLoadingTeachers } = useQuery(
    ['teachers'],
    fetchTeachers,
  );

  const { data: courses, error: courseError, isLoading: isLoadingCourses } = useQuery(
    ['courses'],
    fetchCourses,
  );

  const { data: batches, error: batchError, isLoading: isLoadingBatches } = useQuery(
    ['batches'],
    fetchBatches,
  );

  const addMutation = useMutation(addTeacher, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teachers']);
      toast({ title: 'Teacher Created', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation(updateTeacher, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teachers']);
      toast({ title: 'Teacher Updated', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation(deleteTeacher, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teachers']);
      toast({ title: 'Teacher Deleted', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const [editingTeacher, setEditingTeacher] = useState(null);

  const handleCreateTeacher = (newTeacher) => {
    addMutation.mutate(newTeacher);
  };

  const handleEditTeacher = (editedTeacher) => {
    updateMutation.mutate(editedTeacher);
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (teacherId) => {
    deleteMutation.mutate(teacherId);
  };

  // Handling loading and error states
  if (isLoadingTeachers || isLoadingCourses || isLoadingBatches) {
    return <div>Loading...</div>; // You might want to add a spinner here
  }

  if (teacherError || courseError || batchError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster />
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Add Teacher</TabsTrigger>
          <TabsTrigger value="view">View Teachers</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateTeacherForm 
            courses={courses} 
            batches={batches} 
            onCreateTeacher={handleCreateTeacher} 
          />
        </TabsContent>
        <TabsContent value="view">
          <TeacherList 
            teachers={teachers} 
            onEdit={setEditingTeacher} 
            onDelete={handleDeleteTeacher} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingTeacher !== null} onOpenChange={() => setEditingTeacher(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Make changes to the teacher here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingTeacher && (
            <EditTeacherForm 
              teacher={editingTeacher} 
              courses={courses} 
              batches={batches} 
              onSave={handleEditTeacher} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateTeacherForm({ courses, batches, onCreateTeacher }) {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [course, setCourse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTeacher({ name, batch, course });
    setName('');
    setBatch('');
    setCourse('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Teacher</CardTitle>
        <CardDescription>Enter the details for the new teacher</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Teacher Name</Label>
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
          <Button type="submit" className="w-full">Add Teacher</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EditTeacherForm({ teacher, courses, batches, onSave }) {
  const [name, setName] = useState(teacher.name);
  const [batch, setBatch] = useState(teacher.batchId);
  const [course, setCourse] = useState(teacher.courseId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: teacher.id, name, batch, course });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Teacher Name</Label>
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
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}

function TeacherList({ teachers, onEdit, onDelete }) {
  return (
    <div>
      {teachers.map(teacher => (
        <div key={teacher.id} className="flex justify-between items-center">
          <div>{teacher.name}</div>
          <div>
            <Button onClick={() => onEdit(teacher)}><Edit /></Button>
            <Button onClick={() => onDelete(teacher.id)}><Trash /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
