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

  return (
    <section className="mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4">Enter Website URL</h2>
        <form className="flex flex-col md:flex-row gap-3" onSubmit={handleUrlSubmit}>
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-globe text-neutral-400"></i>
            </div>
            <input 
              type="url" 
              id="website-url" 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow"
              required
            />
            {url && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                  type="button" 
                  className="text-neutral-400 hover:text-neutral-600" 
                  title="Clear input"
                  onClick={clearInput}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
          >
            <span>Analyze SEO Tags</span>
            <i className="fa-solid fa-magnifying-glass ml-2"></i>
          </button>
        </form>
        <div className="mt-3 text-sm text-neutral-500">
          <i className="fa-solid fa-circle-info mr-1"></i>
          Enter any website URL to analyze its SEO meta tags and implementation
        </div>
      </div>
    </section>
  );
};

export default URLInput;
