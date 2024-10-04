'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Eye, FileText, Calendar } from 'lucide-react'
import { fetchAssignments, addAssignment, updateAssignment, deleteAssignment } from '@/lib/api';

export default function ViewAssignmentsPage() {
  const queryClient = useQueryClient();
  const { data: assignments, error, isLoading } = useQuery(['assignments'], fetchAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const filteredAssignments = assignments?.filter(assignment =>
    Object.values(assignment).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderPreview = (assignment) => {
    return (
      <div className="space-y-4">
        <p><strong>Description:</strong> {assignment.description}</p>
        <p><strong>Due Date:</strong> {assignment.dueDate}</p>
        <p><strong>Teacher:</strong> {assignment.teacher}</p>
        <p><strong>Course:</strong> {assignment.course}</p>
        <p><strong>Semester:</strong> {assignment.semester}</p>
        <p><strong>Subject:</strong> {assignment.subject}</p>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
    return (
      <div className="space-y-4">
        <p><strong>Description:</strong> {assignment.description}</p>
        <p><strong>Due Date:</strong> {assignment.dueDate}</p>
        <p><strong>Teacher:</strong> {assignment.teacher}</p>
        <p><strong>Course:</strong> {assignment.course}</p>
        <p><strong>Semester:</strong> {assignment.semester}</p>
        <p><strong>Subject:</strong> {assignment.subject}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">View Assignments</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assignments List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{assignment.teacher}</TableCell>
                        <TableCell>{assignment.batch}</TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell>{assignment.semester}</TableCell>
                        <TableCell>{assignment.subject}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAssignment(assignment)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{selectedAssignment?.title}</DialogTitle>
                              </DialogHeader>
                              {selectedAssignment && renderPreview(selectedAssignment)}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
