'use client';

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash } from 'lucide-react'
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/config/axiosconfig'


export default function CoursePage() {
  const queryClient = useQueryClient();

  // Fetch batches data from API
  const { data: courses, error, isLoading } = useQuery(['courses'], async () => {
    const response = await axiosInstance.get(fetchCourses);
    return response.data.items;  // Correcting the API response to return items directly
  });

  const addCourseMutation = useMutation(addCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
    },
  });

  const updateCourseMutation = useMutation(updateCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
    },
  });

  const deleteCourseMutation = useMutation(deleteCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
    },
  });

  const handleCreateCourse = (newCourse) => {
    addCourseMutation.mutate(newCourse);
  };

  const handleEditCourse = (editedCourse) => {
    updateCourseMutation.mutate(editedCourse);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    deleteCourseMutation.mutate(courseId);
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
          <CreateCourseForm onCreateCourse={handleCreateCourse} />
        </TabsContent>
        <TabsContent value="view">
          <CourseList 
            courses={courses} 
            onEdit={setEditingCourse} 
            onDelete={handleDeleteCourse} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingCourse !== null} onOpenChange={() => setEditingCourse(null)}>
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
  )
}

function CreateCourseForm({ onCreateCourse }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateCourse({ name, description })
    setName('')
    setDescription('')
  }

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
          <Button type="submit" className="w-full">Create Course</Button>
        </form>
      </CardContent>
    </Card>
  )
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
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(course.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
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
  )
}

function EditCourseForm({ course, onSave }) {
  const [name, setName] = useState(course.name)
  const [description, setDescription] = useState(course.description)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...course, name, description })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Course Name</Label>
        <Input 
          id="edit-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-description">Course Description</Label>
        <Textarea 
          id="edit-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}