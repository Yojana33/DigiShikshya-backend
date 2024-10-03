"use client";
import LandingPage from "./landing/page";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default function Home() {
  return (
   
    <div>
      {/* <LoginPage /> */}
      <QueryClientProvider client={queryClient}>
      <LandingPage />
      </QueryClientProvider>
      
    </div>
    
  );
}
