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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// API Call functions
const fetchSemesters = async () => {
  const response = await axiosInstance.get('/api/v1/semester/all');
  return response.data.items;
};

const fetchCourses = async () => {
  const response = await axiosInstance.get('/api/v1/course/all'); // Adjust the endpoint
  return response.data.items;
};


const addSemester = async (semester) => {
  const response = await axiosInstance.post('/api/v1/semester/add', semester);
  return response.data;
};

const updateSemester = async (semester) => {
  const response = await axiosInstance.patch(`/api/v1/semester/update`, semester);
  return response.data;
};

const deleteSemester = async (semesterId) => {
  const response = await axiosInstance.delete(`/api/v1/semester/${semesterId}`);
  return response.data;
};

export default function SemesterPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingSemester, setEditingSemester] = useState(null);

  // Fetch semesters data from API
  const { data: semesters, error, isLoading } = useQuery(
    ['allSemesters'],
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

  const {data:courseData, error:courseError, isLoading:courseLoading} = useQuery(
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

  // Mutations for managing semesters
  const addMutation = useMutation(addSemester, {
    onSuccess: (data) => {
      queryClient.refetchQueries(['allSemesters']);
      toast({ title: 'Semester Created', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation(updateSemester, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['allSemesters']);
      toast({ title: 'Semester Updated', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation(deleteSemester, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['allSemesters']);
      toast({ title: 'Semester Deleted', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  // Handlers for creating, editing, and deleting semesters
  const handleCreateSemester = (newSemester) => {
    addMutation.mutate(newSemester);
  };

  const handleEditSemester = (editedSemester) => {
    updateMutation.mutate(editedSemester);
    setEditingSemester(null);
  };

  const handleDeleteSemester = (semesterId) => {
    deleteMutation.mutate(semesterId);
  };

  // Handling loading and error states
  if (isLoading) {
    return <div>Loading semesters...</div>; // You could add a spinner here
  }

  if (error) {
    return <div>Error loading semesters: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster /> {/* Toast notifications */}
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Semester</TabsTrigger>
          <TabsTrigger value="view">View Semesters</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateSemesterForm onSave={handleCreateSemester} courseData = {courseData} />
        </TabsContent>
        <TabsContent value="view">
          <SemesterList 
            semesters={semesters} 
            onEdit={setEditingSemester} 
            onDelete={handleDeleteSemester}
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
            <EditSemesterForm semester={editingSemester} onSave={handleEditSemester} courses={courses}  />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateSemesterForm({ onSave,courseData }) {
  const [semesterName, setSemesterName] = useState('');
  // const [description, setDescription] = useState('');
  const [courseName, setCourseName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ semesterName, description, courseName, startDate, endDate });
    setSemesterName('');
    setDescription('');
    setCourseName('');
    setStartDate('');
    setEndDate('');
  };

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
              value={semesterName} 
              onChange={(e) => setSemesterName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={courseName} onValueChange={setCourseName} required>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courseData.map((course) => (
                  <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="description">Semester Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div> */}
          <Button type="submit" className="w-full">Create Semester</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EditSemesterForm({ semester, onSave, courses }) {
  const [semesterName, setSemesterName] = useState(semester.semesterName);
  // const [description, setDescription] = useState(semester.description);
  const [courseName, setCourseName] = useState(semester.courseName);
  const [startDate, setStartDate] = useState(semester.startDate);
  const [endDate, setEndDate] = useState(semester.endDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: semester.id, semesterName, courseName, startDate, endDate });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Semester</CardTitle>
        <CardDescription>Modify the semester details</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={courseName} onValueChange={setCourseName} required>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courseData.map((course) => (
                  <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="description">Semester Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div> */}
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SemesterList({ semesters, onEdit, onDelete }) {
  if (!semesters || semesters.length === 0) {
    return <div>No semesters available</div>; // Handle no semesters state
  }

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
            {/* <p>{semester.description}</p> */}
            <p>Course Name: {semester.courseName}</p>
            <p>Start Date: {new Date(semester.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(semester.endDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
