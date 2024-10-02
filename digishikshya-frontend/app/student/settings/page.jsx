'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Menu, Camera, Mail, Phone, User, Calendar, BookOpen, MapPin } from 'lucide-react'

// Mock data - replace with actual data fetching
const initialProfileData = {
  name: "Test",
  email: "test@example.com",
  phone: "9812345678",
  batch: "2023",
  course: "BCA",
  semester: "3rd Semester",
  address: "Biratnagar",
  dateOfBirth: "May 15, 2005",
  avatarUrl: ""
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(initialProfileData)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated profile data to your server
    console.log("Updated profile data:", profileData)
    setIsEditing(false)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Here you would typically upload the file to your server and get a URL back
      // For this example, we'll just use a local object URL
      const newAvatarUrl = URL.createObjectURL(file)
      setProfileData(prevData => ({
        ...prevData,
        avatarUrl: newAvatarUrl
      }))
    }
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
                <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
                <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32"></div>
              <CardContent className="relative pt-16">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <Avatar className="h-32 w-32 ring-4 ring-white">
                    <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
                    <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
                      <Camera className="h-5 w-5 text-gray-600" />
                      <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </Label>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-center mt-4">{profileData.name}</h2>
                <p className="text-gray-500 text-center">{profileData.course} Student</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    {isEditing ? (
                      <Input
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span>{profileData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span>{profileData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span>Batch: {profileData.batch}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{profileData.semester}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span>DOB: {profileData.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{profileData.address}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4 mt-6">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>

  )
}