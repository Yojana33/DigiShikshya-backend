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

// Mock data for batches - replace with actual data fetching
const initialBatches = [
  { id: 1, name: "Batch 2023", startDate: "2023-01-01", endDate: "2023-12-31", status: "running" },
  { id: 2, name: "Batch 2022", startDate: "2022-01-01", endDate: "2022-12-31", status: "passout" },
]

export default function BatchPage() {
  const [batches, setBatches] = useState(initialBatches)
  const [editingBatch, setEditingBatch] = useState(null)

  const handleCreateBatch = (newBatch) => {
    setBatches([...batches, { ...newBatch, id: batches.length + 1 }])
  }

  const handleEditBatch = (editedBatch) => {
    setBatches(batches.map(batch => batch.id === editedBatch.id ? editedBatch : batch))
    setEditingBatch(null)
  }

  const handleDeleteBatch = (batchId) => {
    setBatches(batches.filter(batch => batch.id !== batchId))
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
            batches={batches} 
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
  )
}

function CreateBatchForm({ onCreateBatch }) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('running')

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateBatch({ name, startDate, endDate, status })
    setName('')
    setStartDate('')
    setEndDate('')
    setStatus('running')
  }

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
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="passout">Passout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Create Batch</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function BatchList({ batches, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {batches.map((batch) => (
        <Card key={batch.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{batch.name}</CardTitle>
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
                <p>{batch.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">End Date:</p>
                <p>{batch.endDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <p className="capitalize">{batch.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EditBatchForm({ batch, onSave }) {
  const [name, setName] = useState(batch.name)
  const [startDate, setStartDate] = useState(batch.startDate)
  const [endDate, setEndDate] = useState(batch.endDate)
  const [status, setStatus] = useState(batch.status)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...batch, name, startDate, endDate, status })
  }

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
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="passout">Passout</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}