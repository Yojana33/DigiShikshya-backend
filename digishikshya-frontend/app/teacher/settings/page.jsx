'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Camera, Mail, Phone, MapPin } from 'lucide-react'

// Mock data - replace with actual data fetching
const initialTeacherData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  address: "Kathmandu, Nepal",
  avatarUrl: ""
}

export default function TeacherSettingsPage() {
  const [teacherData, setTeacherData] = useState(initialTeacherData)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTeacherData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated teacher data to your server
    console.log("Updated teacher data:", teacherData)
    setIsEditing(false)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Here you would typically upload the file to your server and get a URL back
      // For this example, we'll just use a local object URL
      const newAvatarUrl = URL.createObjectURL(file)
      setTeacherData(prevData => ({
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
              <AvatarImage src={teacherData.avatarUrl} alt={teacherData.name} />
              <AvatarFallback>{teacherData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-32"></div>
            <CardContent className="relative pt-16">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <Avatar className="h-32 w-32 ring-4 ring-white">
                  <AvatarImage src={teacherData.avatarUrl} alt={teacherData.name} />
                  <AvatarFallback>{teacherData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </Label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-center mt-4">{teacherData.name}</h2>
              <p className="text-gray-500 text-center">Teacher</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <Label htmlFor="email" className="sr-only">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={teacherData.email}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                  ) : (
                    <span>{teacherData.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <Label htmlFor="phone" className="sr-only">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={teacherData.phone}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                  ) : (
                    <span>{teacherData.phone}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <Label htmlFor="address" className="sr-only">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={teacherData.address}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                  ) : (
                    <span>{teacherData.address}</span>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 mt-6">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}