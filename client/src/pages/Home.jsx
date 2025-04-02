import { useState } from "react";
import URLInput from "@/components/URLInput";
import AnalysisResults from "@/components/AnalysisResults";

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <header className="bg-gradient-to-r from-primary/90 to-indigo-600/90 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <i className="fa-solid fa-magnifying-glass text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SEO Tag Analyzer</h1>
                <p className="text-sm text-white/80">Analyze and improve your website's SEO meta tags</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-1">
              <div className="px-3 py-1 bg-white/10 rounded-md text-sm hover:bg-white/20 transition-colors cursor-pointer">
                <i className="fa-solid fa-info-circle mr-1"></i> About
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-md text-sm hover:bg-white/20 transition-colors cursor-pointer">
                <i className="fa-solid fa-book mr-1"></i> Docs
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-md text-sm hover:bg-white/20 transition-colors cursor-pointer">
                <i className="fa-solid fa-code mr-1"></i> API
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <URLInput 
          setAnalysisData={setAnalysisData} 
          setIsLoading={setIsLoading} 
          setError={setError} 
        />
        
        <AnalysisResults 
          analysisData={analysisData} 
          isLoading={isLoading} 
          error={error} 
        />
      </main>
      
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                SEO Tag Analyzer
              </h2>
              <p className="text-sm text-gray-400">
                Analyze and optimize your website's SEO meta tags for better search visibility
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-solid fa-envelope text-xl"></i>
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
