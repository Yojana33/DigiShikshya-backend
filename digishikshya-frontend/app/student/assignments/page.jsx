"use client";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Upload, CheckCircle, XCircle } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/config/axiosconfig'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

// API calls
const fetchNewAssignments = async () => {
  const response = await axiosInstance.get('/api/v1/assignment/all?Page=1&PageSize=10');
  return response.data.items;
}

const fetchSubmittedAssignments = async () => {
  const response = await axiosInstance.get('/api/v1/submission/all');
  return response.data.items;
}

const submitAssignment = async ({ assignmentId, file }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('assignmentId', assignmentId);

  const response = await axiosInstance.post('/api/v1/submission/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export default function AssignmentsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch assignments using React Query
  const { data: newAssignments, isLoading: isLoadingNewAssignments } = useQuery(
    ['newAssignments'],
    fetchNewAssignments
  );

  const { data: submittedAssignments, isLoading: isLoadingSubmittedAssignments } = useQuery(
    ['submittedAssignments'],
    fetchSubmittedAssignments
  );

  const submitMutation = useMutation(submitAssignment, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['newAssignments']);
      queryClient.invalidateQueries(['submittedAssignments']);
      toast({ title: 'Assignment Submitted', description: data.message });
    },
    onError: (data) => {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  });

  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileChange = (assignmentId, event) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [assignmentId]: event.target.files[0],
    }));
  };

  const handleSubmit = (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (file) {
      submitMutation.mutate({ assignmentId, file });
      setSelectedFiles((prev) => ({
        ...prev,
        [assignmentId]: null,
      }));
    }
  };

  // Handle loading and error states
  if (isLoadingNewAssignments || isLoadingSubmittedAssignments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="Student" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Assignments</h1>
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="new" className="text-blue-600 hover:text-blue-800">New Assignments</TabsTrigger>
              <TabsTrigger value="submitted" className="text-blue-600 hover:text-blue-800">Submitted Assignments</TabsTrigger>
            </TabsList>
            <TabsContent value="new">
              <div className="grid gap-6">
                {newAssignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-600">{assignment.title}</CardTitle>
                      <CardDescription className="text-gray-600">{assignment.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center">
                        <Input
                          id={`file-upload-${assignment.id}`}
                          type="file"
                          className="hidden"
                          onChange={(event) => handleFileChange(assignment.id, event)}
                        />
                        <Label
                          htmlFor={`file-upload-${assignment.id}`}
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Label>
                        {selectedFiles[assignment.id] && <span className="ml-2 text-sm">{selectedFiles[assignment.id].name}</span>}
                      </div>
                      <Button 
                        onClick={() => handleSubmit(assignment.id)} 
                        disabled={!selectedFiles[assignment.id]}
                        className="bg-green-600 text-white hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Submit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="submitted">
              <div className="grid gap-6">
                {submittedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                    <CardHeader className={assignment.status === "Submitted" ? "bg-green-50" : "bg-red-50"}>
                      <CardTitle className={assignment.status === "Submitted" ? "text-green-600" : "text-red-600"}>
                        {assignment.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">{assignment.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {assignment.status === "Submitted" ? (
                        <p className="text-sm text-gray-500">Submitted: {assignment.submittedDate}</p>
                      ) : (
                        <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                      )}
                      <p className="text-sm font-medium mt-2 flex items-center">
                        Status: 
                        {assignment.status === "Submitted" ? (
                          <span className="text-green-500 flex items-center ml-2">
                            <CheckCircle className="h-4 w-4 mr-1" /> Submitted
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center ml-2">
                            <XCircle className="h-4 w-4 mr-1" /> Not Submitted
                          </span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  )
}