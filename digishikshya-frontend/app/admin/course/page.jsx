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

export default function CoursePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingCourse, setEditingCourse] = useState(null);

  const { data: courses, error, refetch,isLoading } = useQuery(['courses'], async () => {
    const response = await axiosInstance.get('/api/v1/course/all');
    return response.data.items;
  });

  const mutationHandler = (mutationFn, successMessage, errorMessage) => {
    return useMutation(mutationFn, {
      onSuccess: () => {
        queryClient.invalidateQueries(['courses']);
        toast({ title: successMessage, description: `The course was successfully ${successMessage.toLowerCase()}.` });
        refetch();
      },
      onError: () => {
        toast({ title: 'Error', description: `Failed to ${errorMessage.toLowerCase()} the course.`, variant: 'destructive' });
      }
    });
  };

  const addCourseMutation = mutationHandler(
    (course) => axiosInstance.post('/api/v1/course/add', course),
    'Course Created', 'create'
  );

  const updateCourseMutation = mutationHandler(
    (course) => axiosInstance.patch(`/api/v1/course/update`, course),
    'Course Updated', 'update'
  );

  const deleteCourseMutation = mutationHandler(
    (id) => axiosInstance.delete(`/api/v1/course/${id}`),
    'Course Deleted', 'delete'
  );

  const handleCreateOrUpdateCourse = (course) => {
    if (course.id) {
      updateCourseMutation.mutate(course);
    } else {
      addCourseMutation.mutate(course);
    }
    setEditingCourse(null);
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
          <TabsTrigger value="create">Create Course</TabsTrigger>
          <TabsTrigger value="view">View Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateOrEditCourseForm onSave={handleCreateOrUpdateCourse} />
        </TabsContent>
        <TabsContent value="view">
          <CourseList 
            courses={courses} 
            onEdit={setEditingCourse} 
            onDelete={(id) => deleteCourseMutation.mutate(id)} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Make changes to the course here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <CreateOrEditCourseForm course={editingCourse} onSave={handleCreateOrUpdateCourse} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateOrEditCourseForm({ course = { name: '', description: '' }, onSave }) {
  const [newName, setNewName] = useState(course.name);
  const [newDescription, setNewDescription] = useState(course.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...course, newName: newName, newDescription: newDescription });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.id ? 'Edit Course' : 'Create New Course'}</CardTitle>
        <CardDescription>{course.id ? 'Modify the course details' : 'Enter the details for a new course'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input 
              id="name" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea 
              id="description" 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full">{course.id ? 'Save Changes' : 'Create Course'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CourseList({ courses, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{course.name}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(course)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(course.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>{course.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
