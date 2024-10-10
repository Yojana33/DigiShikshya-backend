'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { BookOpen, Loader2, Github, Mail } from 'lucide-react';
import axiosInstance from '@/config/axiosconfig';

export default function LoginPage() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/login', { username, password });
      const { info } = response.data;

      // Store user info in localStorage
      localStorage.setItem('userId', info.id);
      localStorage.setItem('userRoles', JSON.stringify(info.roles));

      // Role-based redirection
      if (info.roles.includes('Admin')) {
        router.push('/admin/dashboard');
      } else if (info.roles.includes('Teacher')) {
        router.push('/teacher/dashboard');
      } else if (info.roles.includes('Student')) {
        router.push('/student/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        // Handle response errors
        setError(error.response.data || 'Login failed. Please check your credentials and try again.');
      } else if (error.request) {
        // Handle no response error
        setError('No response from server. Please try again later.');
      } else {
        // General error
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulating an API call for social login
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock social authentication logic (replace with actual authentication)
      console.log(`Logging in with ${provider}`);
      // For demo purposes, we'll just redirect to the student dashboard
      router.push('/student/dashboard');
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">DigiShikshya</h1>
          <p className="mt-2 text-sm text-gray-600">Log in to your account</p>
        </div>
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform hover:scale-105" 
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out transform hover:scale-105" 
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              Or continue with
            </span>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="Username" className="block text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Provided Username"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105" disabled={isLoading} >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Sign In with Email
                </>
              )}
            </Button>
          </form>
        </div>
        {/* <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p> */}
      </div>
    </div>
  )
}
