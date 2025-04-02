import { useState } from "react";
import NavBar from "../components/NavBar";
import URLForm from "../components/URLForm";
import StatusBar from "../components/StatusBar";
import TabNavigation from "../components/TabNavigation";
import SummaryCard from "../components/SummaryCard";
import GooglePreviewCard from "../components/GooglePreviewCard";
import SocialPreviewCard from "../components/SocialPreviewCard";
import MetaTagsList from "../components/MetaTagsList";
import Recommendations from "../components/Recommendations";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { data: seoData, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`/api/analyze?url=${encodeURIComponent(url)}`],
    enabled: !!url,
  });
  
  const handleSubmit = async (submittedUrl) => {
    setUrl(submittedUrl);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <NavBar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Analyze SEO Meta Tags</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Enter any URL to check how well it's optimized for search engines and social media. 
            Get instant feedback and recommendations.
          </p>
        </div>
        
        <URLForm 
          onSubmit={handleSubmit} 
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
        />
        
        {isLoading && (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-8 w-64 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        )}
        
        {isError && (
          <div className="mt-8 rounded-lg bg-red-50 p-6 border border-red-200">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error analyzing URL</h3>
            <p className="text-sm text-red-700">{error.message || "Failed to analyze the provided URL. Please check the URL and try again."}</p>
          </div>
        )}
        
        {seoData && (
          <div className="results-container">
            <StatusBar 
              domain={seoData.domain}
              score={seoData.score}
              status={seoData.status}
            />
            
            <TabNavigation 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            {activeTab === "overview" && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SummaryCard 
                    essentialTagsCount={seoData.essentialTagsFound}
                    essentialTagsTotal={seoData.essentialTagsTotal}
                    socialTagsCount={seoData.socialTagsFound}
                    socialTagsTotal={seoData.socialTagsTotal}
                    structuredDataCount={seoData.structuredDataFound}
                    structuredDataTotal={seoData.structuredDataTotal}
                    totalTagsFound={seoData.totalTagsFound}
                  />
                  <GooglePreviewCard 
                    url={seoData.url}
                    title={seoData.title}
                    description={seoData.description}
                    titleStatus={seoData.titleStatus}
                  />
                  <SocialPreviewCard 
                    url={seoData.url}
                    title={seoData.title}
                    description={seoData.description}
                    image={seoData.ogImage}
                    socialStatus={seoData.socialStatus}
                  />
                </div>
              </div>
            )}
            
            {activeTab === "meta-tags" && (
              <MetaTagsList 
                essentialTags={seoData.essentialTags}
                socialTags={seoData.socialTags}
              />
            )}
            
            {activeTab === "previews" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary mb-4">Preview Appearances</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GooglePreviewCard 
                    url={seoData.url}
                    title={seoData.title}
                    description={seoData.description}
                    titleStatus={seoData.titleStatus}
                    expanded={true}
                  />
                  <SocialPreviewCard 
                    url={seoData.url}
                    title={seoData.title}
                    description={seoData.description}
                    image={seoData.ogImage}
                    socialStatus={seoData.socialStatus}
                    expanded={true}
                  />
                </div>
              </div>
            )}
            
            {activeTab === "recommendations" && (
              <Recommendations recommendations={seoData.recommendations} />
            )}
            
            {activeTab === "raw-html" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-secondary">Raw HTML Meta Tags</h2>
                  <button 
                    className="text-sm text-primary font-medium hover:text-primary/80"
                    onClick={() => {
                      navigator.clipboard.writeText(seoData.rawHtml);
                    }}
                  >
                    <i className="ri-clipboard-line mr-1"></i>
                    Copy All
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs overflow-x-auto max-h-[400px] overflow-y-auto">
                  <pre>{seoData.rawHtml}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Separator />
      <Footer />
    </div>
  );
}
