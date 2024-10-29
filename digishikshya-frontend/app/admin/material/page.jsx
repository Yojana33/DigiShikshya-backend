'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Eye, FileText, Video, Image as ImageIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios' // Assuming axiosInstance is already configured
import { useToast } from "@/components/ui/use-toast" // Your custom toast hook

export default function ViewMaterialsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Fetch materials from the API
  const { data: materialsData, error, isLoading, refetch } = useQuery(['materials'], async () => {
    const response = await axiosInstance.get('/api/v1/material/all'); // Adjust the API endpoint
    return response.data.items; // Adjust according to your API response structure
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Filter materials based on search input
  const filteredMaterials = materialsData?.filter(material =>
    Object.values(material).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Determine the correct file icon based on material type
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      case 'image':
        return <ImageIcon className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // Render preview based on material type
  const renderPreview = (material) => {
    switch (material.type) {
      case 'pdf':
        return (
          <iframe
            src={material.url}
            className="w-full h-[600px]"
            title={material.title}
          />
        )
      case 'video':
        return (
          <video controls className="w-full max-h-[600px]">
            <source src={material.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      case 'image':
        return (
          <img
            src={material.url}
            alt={material.title}
            className="w-full max-h-[600px] object-contain"
          />
        )
      default:
        return <p>Preview not available for this file type.</p>
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">View Materials</h1>
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
              <CardTitle>Materials List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search materials..."
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
                      <TableHead>Type</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials?.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>{material.title}</TableCell>
                        <TableCell>{getFileIcon(material.type)}</TableCell>
                        <TableCell>{material.teacher}</TableCell>
                        <TableCell>{material.batch}</TableCell>
                        <TableCell>{material.course}</TableCell>
                        <TableCell>{material.semester}</TableCell>
                        <TableCell>{material.subject}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedMaterial(material)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{selectedMaterial?.title}</DialogTitle>
                              </DialogHeader>
                              {selectedMaterial && renderPreview(selectedMaterial)}
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
}
