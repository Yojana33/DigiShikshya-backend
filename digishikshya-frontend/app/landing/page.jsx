"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Users, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {

  const router = useRouter();

  const handleLoginButtonClick = () => {
    router.push("/auth/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <GraduationCap className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">DigiShikshya</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button asChild variant="outline" onClick = {handleLoginButtonClick}>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                  Welcome to DigiShikshya
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Your school&apos;s digital learning platform. Access courses, assignments, and resources anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Platform Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Digital Courses</h3>
                <p className="text-gray-600">Access a wide range of courses tailored to your curriculum.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
                <p className="text-gray-600">Engage with teachers and peers through discussion forums and live sessions.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Calendar className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Assignment Management</h3>
                <p className="text-gray-600">Submit assignments and track your progress with ease.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Learning?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Login to your DigiShikshya account and access your personalized learning dashboard.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" asChild onClick ={handleLoginButtonClick}>
                  <Link href="/auth/login">Login to Your Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 DigiShikshya. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}