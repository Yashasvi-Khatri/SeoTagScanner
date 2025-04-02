import { useState } from "react";
import URLInput from "@/components/URLInput";
import AnalysisResults from "@/components/AnalysisResults";

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  return (
    <main className="flex-grow container mx-auto px-4 py-6">
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
  );
}
