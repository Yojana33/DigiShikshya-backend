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

const fetchSubjects = async () => {
  const response = await axiosInstance.get('/api/v1/subject/all');
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
  const response = await axiosInstance.delete(`/api/v1/teacher-assign/delete`, {
    data: { id: teacherId },
  });
  return response.data;
};

export default function TeacherPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: teachers, error: teacherError, isLoading: isLoadingTeachers } = useQuery(
    ['teachers'],
    fetchTeachers,
  );

  const { data: subjects, error: subjectError, isLoading: isLoadingSubjects } = useQuery(
    ['subjects'],
    fetchSubjects,
  );

  const addMutation = useMutation(addTeacher, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teachers']);
      toast({ title: 'Teacher Assigned', description: 'Teacher has been successfully assigned.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.response.data.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation(updateTeacher, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teachers']);
      toast({ title: 'Teacher Updated', description: 'Teacher assignment has been successfully updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.response.data.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation(deleteTeacher, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teachers']);
      toast({ title: 'Teacher Deleted', description: 'Teacher assignment has been successfully deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.response.data.message, variant: 'destructive' });
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
  if (isLoadingTeachers || isLoadingSubjects) {
    return <div>Loading...</div>; // You might want to add a spinner here
  }

  if (teacherError || subjectError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster />
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Assign Teacher</TabsTrigger>
          <TabsTrigger value="view">View Teachers</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateTeacherForm 
            subjects={subjects} 
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
              Make changes to the teacher assignment here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingTeacher && (
            <EditTeacherForm 
              teacher={editingTeacher} 
              subjects={subjects} 
              onSave={handleEditTeacher} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateTeacherForm({ subjects, onCreateTeacher }) {
  const [teacherName, setTeacherName] = useState('');
  const [subjectName, setSubjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSubject = subjects.find(subject => subject.subjectName === subjectName);
    const newTeacher = {
      teacherName,
      subjectId: selectedSubject.id,
    };
    onCreateTeacher(newTeacher);
    setTeacherName('');
    setSubjectName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Teacher</CardTitle>
        <CardDescription>Enter the details to assign teacher</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacherName">Teacher Name</Label>
            <Input 
              id="teacherName" 
              value={teacherName} 
              onChange={(e) => setTeacherName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject</Label>
            <Select value={subjectName} onValueChange={setSubjectName}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.subjectName}>{subject.subjectName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Assign Teacher</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EditTeacherForm({ teacher, subjects, onSave }) {
  const [teacherName, setTeacherName] = useState(teacher.teacherName);
  const [subjectName, setSubjectName] = useState(teacher.subjectName);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSubject = subjects.find(subject => subject.subjectName === subjectName);
    const updatedTeacher = {
      id: teacher.id,
      teacherName,
      subjectId: selectedSubject.id,
    };
    onSave(updatedTeacher);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-teacherName">Teacher Name</Label>
        <Input 
          id="edit-teacherName" 
          value={teacherName} 
          onChange={(e) => setTeacherName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-subjectName">Subject</Label>
        <Select value={subjectName} onValueChange={setSubjectName}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.subjectName}>{subject.subjectName}</SelectItem>
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
    <div className="space-y-4">
      {teachers.length === 0 ? (
        <div>No teachers available.</div>
      ) : (
        teachers.map((teacher) => (
          <Card key={teacher.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
            <CardTitle>
              <p className="text-lg font-medium">Teacher Name: {teacher.teacherName}</p>
              <p className="text-lg text-black-500">
                Subject Name: {teacher.subjectName}
              </p>
              <p className="text-lg text-black-500">
                Course Name: {teacher.courseName}
              </p>
              <p className="text-lg text-black-500">
                Semester Name: {teacher.semesterName}
              </p>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(teacher)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => onDelete(teacher.id)}>
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