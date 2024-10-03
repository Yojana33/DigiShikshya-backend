'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Menu, BookOpen, Upload, Plus, Search, Filter, Eye, Edit, Trash, Download, Play } from 'lucide-react'

// Mock data for subjects - replace with actual data fetching
const subjects = [
  { id: 1, name: "Mathematics", batch: "2023", course: "Science", semester: "1st" },
  { id: 2, name: "Physics", batch: "2023", course: "Science", semester: "1st" },
  { id: 3, name: "Chemistry", batch: "2022", course: "Science", semester: "3rd" },
  { id: 4, name: "Biology", batch: "2022", course: "Science", semester: "3rd" },
  { id: 5, name: "Computer Science", batch: "2023", course: "Computer", semester: "1st" },
  { id: 6, name: "English", batch: "2021", course: "Arts", semester: "5th" },
]

// Mock data for uploaded notes - replace with actual data fetching
const uploadedNotes = [
  { id: 1, subjectId: 1, title: "Algebra Basics", description: "Introduction to algebraic concepts", fileUrl: "#", fileType: "pdf" },
  { id: 2, subjectId: 2, title: "Newton's Laws", description: "Fundamental laws of motion", fileUrl: "#", fileType: "video" },
  { id: 3, subjectId: 3, title: "Periodic Table", description: "Overview of chemical elements", fileUrl: "#", fileType: "pdf" },
]

export default function TeacherSubjectsPage() {
  const [activeTab, setActiveTab] = useState('subjects')
  const [filteredSubjects, setFilteredSubjects] = useState(subjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (term) => {
    setSearchTerm(term)
    filterSubjects(term, selectedBatch, selectedCourse, selectedSemester)
  }

  const handleBatchChange = (value) => {
    setSelectedBatch(value)
    filterSubjects(searchTerm, value, selectedCourse, selectedSemester)
  }

  const handleCourseChange = (value) => {
    setSelectedCourse(value)
    filterSubjects(searchTerm, selectedBatch, value, selectedSemester)
  }

  const handleSemesterChange = (value) => {
    setSelectedSemester(value)
    filterSubjects(searchTerm, selectedBatch, selectedCourse, value)
  }

  const filterSubjects = (term, batch, course, semester) => {
    let filtered = subjects
    if (term) {
      filtered = filtered.filter(subject => subject.name.toLowerCase().includes(term.toLowerCase()))
    }
    if (batch) {
      filtered = filtered.filter(subject => subject.batch === batch)
    }
    if (course) {
      filtered = filtered.filter(subject => subject.course === course)
    }
    if (semester) {
      filtered = filtered.filter(subject => subject.semester === semester)
    }
    setFilteredSubjects(filtered)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="@teacher" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="subjects" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="subjects" className="text-blue-600 hover:text-blue-800">Subjects</TabsTrigger>
              <TabsTrigger value="upload-notes" className="text-blue-600 hover:text-blue-800">Upload Notes</TabsTrigger>
              <TabsTrigger value="view-notes" className="text-blue-600 hover:text-blue-800">View Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="subjects" className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative w-full md:w-1/3">
                  <Input
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full md:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Select onValueChange={handleBatchChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={handleCourseChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Computer">Computer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={handleSemesterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Semester</SelectItem>
                      <SelectItem value="3rd">3rd Semester</SelectItem>
                      <SelectItem value="5th">5th Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} router={router} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="upload-notes">
              <UploadNotesForm subjects={subjects} />
            </TabsContent>
            <TabsContent value="view-notes">
              <ViewNotes notes={uploadedNotes} subjects={subjects} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function SubjectCard({ subject, router }) {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">{subject.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Batch: {subject.batch} | Course: {subject.course} | Semester: {subject.semester}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => router.push(`/teacher/subject-details?id=${subject.id}`)}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <UploadNotesDialog subjectId={subject.id} subjectName={subject.name} />
      </CardFooter>
    </Card>
  )
}

function UploadNotesDialog({ subjectId, subjectName }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = () => {
    // Add logic to upload the file
    console.log(`Uploading file for subject ${subjectId}:`, { file, title, description })
    setFile(null)
    setTitle('')
    setDescription('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Notes for {subjectName}</DialogTitle>
          <DialogDescription>
            Select the file you want to upload as notes for this subject.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notesFile" className="text-right">
              File
            </Label>
            <Input
              id="notesFile"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload} disabled={!file || !title}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function UploadNotesForm({ subjects }) {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = () => {
    // Add logic to upload the file
    console.log(`Uploading file for subject ${selectedSubject}:`, { file, title, description })
    setSelectedSubject('')
    setTitle('')
    setDescription('')
    setFile(null)
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Upload Notes</CardTitle>
        <CardDescription>Select a subject and upload notes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="file"
          onChange={handleFileChange}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!selectedSubject || !title || !file}>
          Upload Notes
        </Button>
      </CardFooter>
    </Card>
  )
}

function ViewNotes({ notes, subjects }) {
  const [editingNote, setEditingNote] = useState(null)

  const handlePreview = (note) => {
    if (note.fileType === 'video') {
      // Open video player dialog
      console.log('Open video player for', note.fileUrl)
    } else {
      // Open file preview dialog
      window.open(note.fileUrl, '_blank')
    }
  }

  const handleEdit = (note) => {
    setEditingNote(note)
  }

  const handleDelete = (noteId) => {
    console.log('Delete note', noteId)
    // Implement delete functionality here
  }

  const handleDownload = (note) => {
    const link = document.createElement('a')
    link.href = note.fileUrl
    link.download = note.title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSaveEdit = (editedNote) => {
    console.log('Save edited note', editedNote)
    // Implement save functionality here
    setEditingNote(null)
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const subject = subjects.find(s => s.id === note.subjectId)
        return (
          <Card key={note.id} className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
              <CardDescription>{subject ? subject.name : 'Unknown Subject'}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{note.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handlePreview(note)}>
                {note.fileType === 'video' ? <Play className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{note.fileType === 'video' ? 'Play' : 'Preview'}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(note)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(note.id)}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload(note)}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </CardFooter>
          </Card>
        )
      })}

      <Dialog open={editingNote !== null} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingNote && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editingNote.description}
                  onChange={(e) => setEditingNote({...editingNote, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={() => handleSaveEdit(editingNote)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}