'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/config/axiosconfig';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SemesterPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSemester, setEditingSemester] = useState(null);

  const { data: semesters, error, refetch, isLoading } = useQuery(['semesters'], async () => {
    const response = await axiosInstance.get('/api/v1/semester/all');
    return response.data.items;
  });

  const { data: courses, courseError, courseRefetch, courseIsLoading } = useQuery(['courses'], async () => {
    const response = await axiosInstance.get('/api/v1/course/all');
    return response.data.items;
  });

  const mutationHandler = (mutationFn) => {
    return useMutation(mutationFn, {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['semesters']);
        toast({ title: successMessage, description: data.message, variant: 'success' });
        refetch();
      },
      onError: () => {
        toast({ title: 'Error', description: `Failed to ${errorMessage.toLowerCase()} the semester.`, variant: 'destructive' });
      }
    });
  };

  const addSemesterMutation = mutationHandler(
    (semester) => axiosInstance.post('/api/v1/semester/add', semester)
  );

  const updateSemesterMutation = mutationHandler(
    (semester) => axiosInstance.patch(`/api/v1/semester/update`, semester),
  );

  const deleteSemesterMutation = mutationHandler(
    (id) => axiosInstance.delete(`/api/v1/semester/${id}`)
  );

  const handleCreateOrUpdateSemester = (semester) => {
    if (semester.id) {
      updateSemesterMutation.mutate(semester);
    } else {
      addSemesterMutation.mutate(semester);
    }
    setEditingSemester(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Semester</TabsTrigger>
          <TabsTrigger value="view">View Semesters</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateOrEditSemesterForm onSave={handleCreateOrUpdateSemester} courses={courses} />
        </TabsContent>
        <TabsContent value="view">
          <SemesterList 
            semesters={semesters} 
            onEdit={setEditingSemester} 
            onDelete={(id) => deleteSemesterMutation.mutate(id)} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingSemester} onOpenChange={() => setEditingSemester(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Semester</DialogTitle>
            <DialogDescription>
              Make changes to the semester here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingSemester && (
            <CreateOrEditSemesterForm semester={editingSemester} onSave={handleCreateOrUpdateSemester} courses={courses}/>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateOrEditSemesterForm({ semester = { name: '', description: '' }, onSave, courses }) {
  const [semesterName, setSemesterName] = useState(semester.semesterName);
  const [newDescription, setNewDescription] = useState(semester.description);
  const [selectedCourse, setSelectedCourse] = useState(semester.courseId);
  const [newStartDate, setNewStartDate] = useState(semester.startDate);
  const [newEndDate, setNewEndDate] = useState(semester.endDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...semester, semesterName: semesterName, description: newDescription, courseId: selectedCourse, startDate: newStartDate, endDate: newEndDate });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{semester.id ? 'Edit Semester' : 'Create New Semester'}</CardTitle>
        <CardDescription>{semester.id ? 'Modify the semester details' : 'Enter the details for a new semester'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Semester Name</Label>
            <Input 
              id="name" 
              value={semesterName} 
              onChange={(e) => setSemesterName(e.target.value)} 
              required 
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor="course">Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            <div className='space-y-2'>
              <Label htmlFor="startDate">Start Date</Label>
              <Input type="date" id="startDate" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor="endDate">End Date</Label>
              <Input type="date" id="endDate" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} required />
            </div>
          <div className="space-y-2">
            <Label htmlFor="description">Semester Description</Label>
            <Textarea 
              id="description" 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full">{semester.id ? 'Save Changes' : 'Create Semester'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SemesterList({ semesters, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
    {semesters.length === 0 && (
      <div className="text-center">No semesters found. Create a new one to get started.</div>
    )}
      {semesters.map((semester) => (
        <Card key={semester.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{semester.semesterName}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(semester)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(semester.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>{semester.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
