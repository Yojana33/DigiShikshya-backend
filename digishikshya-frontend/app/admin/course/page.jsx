'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/config/axiosconfig';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const fetchCourses = async () => {
  const response = await axiosInstance.get('/api/v1/course/all'); // Adjust the endpoint
  return response.data.items;
};

const addCourse = async (course) => {
  const response = await axiosInstance.post('/api/v1/course/add', course);
  return response.data;
};

const updateCourse = async (course) => {
  const response = await axiosInstance.patch(`/api/v1/course/update`, course);
  return response.data;
};

const deleteCourse = async (courseId) => {
  const response = await axiosInstance.delete(`/api/v1/course/${courseId}`);
  return response.data;
};

export default function CoursePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch courses data from API
  const { data: courses, error, isLoading } = useQuery(
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

  // Add, update, delete mutations for courses
  const addMutation = useMutation(addCourse, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['courses']);
      toast({ title: 'Course Created', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation(updateCourse, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['courses']);
      toast({ title: 'Course Updated', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation(deleteCourse, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['courses']);
      toast({ title: 'Course Deleted', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const [editingCourse, setEditingCourse] = useState(null);

  const handleCreateCourse = (newCourse) => {
    addMutation.mutate(newCourse);
  };

  const handleEditCourse = (editedCourse) => {
    updateMutation.mutate(editedCourse);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    console.log('Deleting course with ID:', courseId);
    deleteMutation.mutate(courseId);
  };

  // Handling loading and error states
  if (isLoading) {
    return <div>Loading courses...</div>; // Spinner could be added here
  }

  if (error) {
    return <div>Error loading courses: {error.message}</div>; // Error handling improved
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster /> {/* Toast notifications */}
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Course</TabsTrigger>
          <TabsTrigger value="view">View Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateCourseForm onSave={handleCreateCourse} />
        </TabsContent>
        <TabsContent value="view">
          <CourseList 
            courses={courses} 
            onEdit={setEditingCourse} 
            onDelete={handleDeleteCourse}
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
            <EditCourseForm course={editingCourse} onSave={handleEditCourse} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateCourseForm({ onSave }) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: newName, description: newDescription }); // Create course with name and description
    setNewName('');
    setNewDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>Enter the details for a new course</CardDescription>
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
          <Button type="submit" className="w-full">Create Course</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EditCourseForm({ course, onSave }) {
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: course.id, name, description }); // Edit course with id, name, and description
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Course</CardTitle>
        <CardDescription>Modify the course details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CourseList({ courses, onEdit, onDelete }) {
  if (!courses || courses.length === 0) {
    return <div>No courses available</div>; // Handle no courses state
  }

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
