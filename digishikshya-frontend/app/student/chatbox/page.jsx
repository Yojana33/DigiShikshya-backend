"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';

// Mock data for teachers
const teachers = [
  { id: 1, name: "Ms. Sarita", subject: "Mathematics", avatar: "https://i.pravatar.cc/150?img=1", status: "online" },
  { id: 2, name: "Mr. Nirmal", subject: "Science", avatar: "https://i.pravatar.cc/150?img=2", status: "offline" },
  { id: 3, name: "Mrs. Rita", subject: "English", avatar: "https://i.pravatar.cc/150?img=3", status: "online" },
  { id: 4, name: "Mr. Anish", subject: "Social", avatar: "https://i.pravatar.cc/150?img=4", status: "offline" },
  { id: 5, name: "Ms. Sunita", subject: "Computer", avatar: "https://i.pravatar.cc/150?img=5", status: "online" },
  { id: 6, name: "Mr. Ramesh", subject: "Nepali", avatar: "https://i.pravatar.cc/150?img=6", status: "offline" },
  { id: 7, name: "Ms. Sita", subject: "Mathematics", avatar: "https://i.pravatar.cc/150?img=7", status: "online" },
];

// Mock data for initial messages
const initialMessages = [
  { id: 1, senderId: 'teacher', content: "Hello! How can I help you with Mathematics today?", timestamp: "2023-06-15T10:30:00Z" },
  { id: 2, senderId: 'student', content: "Hi Ms. Johnson, I'm having trouble with quadratic equations.", timestamp: "2023-06-15T10:31:00Z" },
  { id: 3, senderId: 'teacher', content: "I see. Let's start by reviewing the basic formula. Can you tell me what you remember about it?", timestamp: "2023-06-15T10:32:00Z" },
  { id: 4, senderId: 'student', content: "I remember that the formula is ax^2 + bx + c = 0.", timestamp: "2023-06-15T10:33:00Z" },
];

const Chatbox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherId = searchParams.get('teacherId');
  const selectedTeacher = teachers.find(teacher => teacher.id === parseInt(teacherId)) || teachers[0];
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    const messageList = document.getElementById('message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: 'student',
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="relative flex flex-col h-screen">
      {/* Mobile and Tablet: Top Avatar Row */}
            <div className="w-full flex justify-center mt-8 bg-gray-100 rounded-full p-2 md:hidden absolute top-0 z-10">
        <div className="flex overflow-x-auto">
          <div className="flex flex-row items-center space-x-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`flex flex-col items-center cursor-pointer ${teacher.id === selectedTeacher.id ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500'}`}
                onClick={() => router.push(`/student/chatbox?teacherId=${teacher.id}`)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                  </Avatar>
                  {teacher.status === "online" ? (
                    <span className="absolute bottom-0 right-0 block h-2 w-2  rounded-full bg-green-500 ring-2 ring-white"></span>
                  ) : (
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add padding to the chat container to account for the avatar row */}
      <div className="flex flex-1 mt-20 relative"> {/* mt-16 to push the chat down */}
        {/* Desktop: Sidebar */}
        <div className="hidden md:flex md:flex-col md:w-1/5 bg-gray-100 p-4">
          <h2 className="text-xl font-bold mb-4">Teachers</h2>
          <ScrollArea className="flex flex-col space-y-2 overflow-y-auto">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${teacher.id === selectedTeacher.id ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => router.push(`/student/chatbox?teacherId=${teacher.id}`)}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                  </Avatar>
                  {teacher.status === "online" ? (
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                  ) : (
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </div>
                <div>
                  <div>{teacher.name}</div>
                  <div className="text-sm text-gray-500">{teacher.subject}</div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 ml-3 mt-6 h-auto flex flex-col md:w-4/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                <AvatarFallback>{selectedTeacher.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedTeacher.name}</div>
                <div className="text-sm text-gray-500">{selectedTeacher.subject}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4" id="message-list">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.senderId === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.senderId === 'teacher' && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                      <AvatarFallback>{selectedTeacher.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${message.senderId === 'student'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="mt-4 flex  items-center">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 mr-2 "
                
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbox;
