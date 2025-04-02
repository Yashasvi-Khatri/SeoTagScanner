import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const URLInput = ({ setAnalysisData, setIsLoading, setError }) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleUrlSubmit = async (event) => {
    event.preventDefault();
    
    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a website URL to analyze",
        variant: "destructive"
      });
      return;
    }
    
    // Basic URL validation
    let formattedUrl = url;
    
    try {
      // Add protocol if missing
      if (!/^https?:\/\//i.test(url)) {
        formattedUrl = `https://${url}`;
      }
      
      // Check if valid URL
      new URL(formattedUrl);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    
    try {
      const res = await apiRequest("POST", "/api/analyze", { url: formattedUrl });
      const data = await res.json();
      setAnalysisData(data);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      setError(error.message || "Failed to analyze URL. Please try again.");
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearInput = () => {
    setUrl("");
  };

  // List of popular websites for examples
  const popularWebsites = [
    "google.com",
    "amazon.com",
    "twitter.com",
    "github.com",
    "wikipedia.org"
  ];

  // Get a random website from the list
  const getRandomWebsite = () => {
    return popularWebsites[Math.floor(Math.random() * popularWebsites.length)];
  };

  return (
    <section className="mb-10">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl shadow-md border border-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            <path d="M2 12h20"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Analyze Website SEO Tags
        </h2>
        <p className="text-indigo-700 mb-6">
          Enter any website URL to get an in-depth analysis of its SEO implementation
        </p>
        
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleUrlSubmit}>
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fa-solid fa-globe text-indigo-500"></i>
            </div>
            <input 
              type="url" 
              id="website-url" 
              placeholder={`https://${getRandomWebsite()}`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full pl-11 pr-12 py-4 bg-white border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow shadow-sm placeholder-gray-400 text-gray-800"
              required
            />
            {url ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors" 
                  title="Clear input"
                  onClick={clearInput}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ) : (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 hidden md:block">
                Try any website URL
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white px-6 py-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center whitespace-nowrap"
          >
            <span>Analyze Now</span>
            <i className="fa-solid fa-search-plus ml-2"></i>
          </button>
        </form>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="text-sm font-medium">Popular examples:</div>
          {popularWebsites.map(site => (
            <button
              key={site}
              type="button"
              onClick={() => setUrl(site)}
              className="px-3 py-1 bg-white/50 hover:bg-white rounded-full text-sm text-indigo-700 hover:text-indigo-800 transition-colors border border-indigo-100 hover:shadow-sm"
            >
              {site}
            </button>
          ))}
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-indigo-100/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
              <i className="fa-solid fa-lightbulb text-indigo-600"></i>
            </div>
            <div className="font-medium text-gray-700">Why analyze SEO tags?</div>
          </div>
          <div className="text-sm text-gray-600">
            Properly implemented SEO meta tags help search engines understand your content and improve your site's visibility.
          </div>
        </div>
      </div>
    </section>
  );
};

export default URLInput;
