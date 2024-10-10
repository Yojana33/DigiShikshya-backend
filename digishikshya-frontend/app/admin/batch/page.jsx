'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash } from 'lucide-react'
import { fetchBatches, addBatch, updateBatch, deleteBatch } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/config/axiosconfig'

export default function BatchPage() {
  const queryClient = useQueryClient();

  // Fetch batches data from API
  const { data: batches, error, isLoading } = useQuery(['batches'], async () => {
    const response = await axiosInstance.get(fetchBatches);
    return response.data.items;  // Correcting the API response to return items directly
  });

  // Add, update, delete mutations for batches
  const addMutation = useMutation(addBatch, {
    onSuccess: () => queryClient.invalidateQueries(['batches']),
  });
  const updateMutation = useMutation(updateBatch, {
    onSuccess: () => queryClient.invalidateQueries(['batches']),
  });
  const deleteMutation = useMutation(deleteBatch, {
    onSuccess: () => queryClient.invalidateQueries(['batches']),
  });

  const [editingBatch, setEditingBatch] = useState(null);

  const handleCreateBatch = (newBatch) => {
    addMutation.mutate(newBatch);
  };

  const handleEditBatch = (editedBatch) => {
    updateMutation.mutate(editedBatch);
    setEditingBatch(null);
  };

  const handleDeleteBatch = (batchId) => {
    deleteMutation.mutate(batchId);
  };

  // Handling loading and error states
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
          <TabsTrigger value="create">Create Batch</TabsTrigger>
          <TabsTrigger value="view">View Batches</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateBatchForm onCreateBatch={handleCreateBatch} />
        </TabsContent>
        <TabsContent value="view">
          <BatchList 
            batches={batches} // Correct batches passed directly from useQuery result
            onEdit={setEditingBatch} 
            onDelete={handleDeleteBatch} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editingBatch !== null} onOpenChange={() => setEditingBatch(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Make changes to the batch here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingBatch && (
            <EditBatchForm batch={editingBatch} onSave={handleEditBatch} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateBatchForm({ onCreateBatch }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('0');  // Default status to "0" (Running)

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBatch({ batchName: name, startDate, endDate, status: parseInt(status) });
    setName('');
    setStartDate('');
    setEndDate('');
    setStatus('0');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Batch</CardTitle>
        <CardDescription>Enter the details for a new batch</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Batch Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input 
              id="startDate" 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input 
              id="endDate" 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Running</SelectItem>
                <SelectItem value="1">Passout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Create Batch</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function BatchList({ batches, onEdit, onDelete }) {
  const statusMapping = {
    0: "Running",
    1: "Passout"
  };

  if (!batches || batches.length === 0) {
    return <div>No batches available</div>;
  }

  return (
    <div className="space-y-4">
      {batches.map((batch) => (
        <Card key={batch.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle> Batch{batch.batchName}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(batch)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(batch.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Start Date:</p>
                <p>{new Date(batch.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">End Date:</p>
                <p>{new Date(batch.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <p className="capitalize">{statusMapping[batch.status]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EditBatchForm({ batch, onSave }) {
  const [name, setName] = useState(batch.batchName);
  const [startDate, setStartDate] = useState(batch.startDate);
  const [endDate, setEndDate] = useState(batch.endDate);
  const [status, setStatus] = useState(batch.status.toString());  // Convert to string for Select component

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      ...batch, 
      batchName: name, 
      startDate, 
      endDate, 
      status: parseInt(status)  // Convert back to integer
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Batch Name</Label>
        <Input 
          id="edit-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-startDate">Start Date</Label>
        <Input 
          id="edit-startDate" 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-endDate">End Date</Label>
        <Input 
          id="edit-endDate" 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Running</SelectItem>
            <SelectItem value="1">Passout</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  );
}
