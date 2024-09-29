import { useState } from 'react'
import StudentSidebar from './student-sidebar'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Bell, Menu, ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data for MCQ questions - replace with actual data fetching
const mcqQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1
  },
  // Add more questions as needed
]

export default function MCQQuestionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerSelect = (value) => {
    setSelectedAnswer(parseInt(value))
    setShowResult(true)
    if (parseInt(value) === mcqQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < mcqQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const progress = ((currentQuestion + 1) / mcqQuestions.length) * 100

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:block">
        <StudentSidebar />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <StudentSidebar />
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="Student" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Question {currentQuestion + 1} of {mcqQuestions.length}</CardTitle>
                <Progress value={progress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium mb-4">{mcqQuestions[currentQuestion].question}</p>
                <RadioGroup 
                  onValueChange={handleAnswerSelect} 
                  value={selectedAnswer?.toString()}
                  className="space-y-2"
                >
                  {mcqQuestions[currentQuestion].options.map((option, index) => (
                    <div key={index} className={`flex items-center space-x-2 p-2 rounded-md ${
                      showResult
                        ? index === mcqQuestions[currentQuestion].correctAnswer
                          ? 'bg-green-100'
                          : selectedAnswer === index
                            ? 'bg-red-100'
                            : ''
                        : ''
                    }`}>
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showResult} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {showResult && (
                  <p className="mt-4 font-medium">
                    {selectedAnswer === mcqQuestions[currentQuestion].correctAnswer
                      ? 'Correct!'
                      : 'Incorrect. The correct answer is: ' + mcqQuestions[currentQuestion].options[mcqQuestions[currentQuestion].correctAnswer]
                    }
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Score: {score} / {currentQuestion + 1}
                </div>
                {currentQuestion === mcqQuestions.length - 1 ? (
                  <Button onClick={() => alert(`Quiz completed! Your score: ${score}/${mcqQuestions.length}`)}>
                    Finish
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} disabled={!showResult}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
