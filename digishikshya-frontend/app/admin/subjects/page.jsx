'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/config/axiosconfig';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Edit, Trash } from 'lucide-react';

// Fetching subjects, batches, courses, and semesters from API
const fetchSubjects = async () => {
  const response = await axiosInstance.get('/api/v1/subject/all');
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

// Adding a new subject
const addSubject = async (subject) => {
  const response = await axiosInstance.post('/api/v1/subject/add', subject);
  return response.data;
};

// Updating an existing subject
const updateSubject = async (subject) => {
  const response = await axiosInstance.patch(`/api/v1/subject/update`, subject);
  return response.data;
};

// Deleting a subject
const deleteSubject = async (subjectId) => {
  const response = await axiosInstance.delete(`/api/v1/subject/delete`, {
    data: { id: subjectId }
  });
  return response.data;
};

export default function SubjectsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch subjects, batches, courses, and semesters
  const { data: subjects, error: subjectsError, isLoading: isLoadingSubjects } = useQuery(
    ['subjects'],
    fetchSubjects,
    {
      onError: (error) => {
        console.error('Error fetching subjects:', error);
      }
    }
  );

  const { data: batches } = useQuery(['batches'], fetchBatches);
  const { data: semesters } = useQuery(['semesters'], fetchSemesters);

  // Mutations for adding, updating, and deleting subjects
  const addMutation = useMutation(addSubject, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['subjects']);
      toast({ title: 'Subject Created', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation(updateSubject, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['subjects']);
      toast({ title: 'Subject Updated', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation(deleteSubject, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['subjects']);
      toast({ title: 'Subject Deleted', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const [editingSubject, setEditingSubject] = useState(null);

  const handleCreateSubject = (newSubject) => {
    addMutation.mutate(newSubject);
  };

  const handleEditSubject = (editedSubject) => {
    updateMutation.mutate(editedSubject);
    setEditingSubject(null);
  };

  const handleDeleteSubject = (subjectId) => {
    deleteMutation.mutate(subjectId);
  };

  // Handling loading and error states
  if (isLoadingSubjects) {
    return <div>Loading...</div>;
  }

  if (subjectsError) {
    return <div>Error loading subjects</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster />
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Add Subject</TabsTrigger>
          <TabsTrigger value="view">View Subjects</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateSubjectForm 
            onCreateSubject={handleCreateSubject} 
            batches={batches} 
            semesters={semesters} 
          />
        </TabsContent>
        <TabsContent value="view">
          <SubjectList 
            subjects={subjects} 
            semesters={semesters}
            onEdit={setEditingSubject} 
            onDelete={handleDeleteSubject} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingSubject !== null} onOpenChange={() => setEditingSubject(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Make changes to the subject here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingSubject && (
            <EditSubjectForm 
              subject={editingSubject} 
              onSave={handleEditSubject} 
              batches={batches} 
              semesters={semesters} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateSubjectForm({ onCreateSubject, batches, semesters }) {
  const [subjectName, setName] = useState('');
  const [subjectCode, setSubjectcode] = useState('');
  const [subjectDescription, setDescription] = useState('');
  const [creditHour, setCredithour] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateSubject({ subjectName, batchId: selectedBatch, semesterId: selectedSemester, subjectCode, subjectDescription, creditHour });
    setName('');
    setSelectedBatch('');
    setSelectedSemester('');
    setSubjectcode('');
    setDescription('');
    setCredithour('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Subject</CardTitle>
        <CardDescription>Enter the details for the new subject</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label> 
            <Input 
              id="name" 
              value={subjectName} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subjectcode">Subject Code</Label>
            <Input
              id="subjectcode"
              value={subjectCode}
              onChange={(e) => setSubjectcode(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2"> 
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={subjectDescription}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credithour">Credit Hour</Label>
            <Input
              id="credithour"
              value={creditHour}
              onChange={(e) => setCredithour(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch">Select Batch</Label>
            <select
              id="batch"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              required
            >
              <option value="">Select Batch</option>
              {batches?.map((batch) => (
                <option key={batch.id} value={batch.id}>{batch.batchName}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Select Semester</Label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              {semesters && semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>{semester.semesterName}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full">Add Subject</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EditSubjectForm({ subject, onSave, batches, semesters }) {
  const [name, setName] = useState(subject.subjectName);
  const [selectedBatch, setSelectedBatch] = useState(subject.batchId);
  const [subjectCode, setSubjectcode] = useState(subject.subjectCode);
  const [description, setDescription] = useState(subject.subjectDescription);
  const [creditHour, setCredithour] = useState(subject.creditHour);
  const [selectedSemester, setSelectedSemester] = useState(subject.semesterId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: subject.id, subjectName: name, batchId: selectedBatch, semesterId: selectedSemester, subjectCode, subjectDescription, creditHour });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Subject Name</Label>
        <Input 
          id="edit-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-subjectcode">Subject Code</Label>
        <Input
          id="edit-subjectcode"
          value={subjectCode}
          onChange={(e) => setSubjectcode(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Input
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-credithour">Credit Hour</Label>
        <Input
          id="edit-credithour"
          value={creditHour}
          onChange={(e) => setCredithour(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-batch">Select Batch</Label>
        <select
          id="edit-batch"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          required
        >
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>{batch.batchName}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-semester">Select Semester</Label>
        <select
          id="edit-semester"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          required
        >
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>{semester.semesterName}</option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}

function SubjectList({ subjects, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {subjects.length === 0 ? (
        <div>No subjects available.</div>
      ) : (
        subjects.map((subject) => (
          <Card key={subject.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
            <CardTitle>
              <p className="text-lg font-medium">{subject.subjectName}</p>
              <p className="text-lg text-black-500">
                Subject Code: {subject.subjectCode}
              </p>
              <p className="text-lg text-black-500">
                Description: {subject.subjectDescription}
              </p>
              <p className="text-lg text-black-500">
                Credit Hour: {subject.creditHour}
              </p>
            </CardTitle>
            <CardContent>
              <p className="text-md text-gray-500">
                Semester: {subject.semesterName}
              </p>
            </CardContent>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(subject)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => onDelete(subject.id)}>
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