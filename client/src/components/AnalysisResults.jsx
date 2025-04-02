import { useEffect, useState } from "react";
import OverviewSection from "@/components/OverviewSection";
import EssentialMetaTags from "@/components/EssentialMetaTags";
import SocialMediaTags from "@/components/SocialMediaTags";
import TechnicalSEOTags from "@/components/TechnicalSEOTags";
import GooglePreview from "@/components/GooglePreview";
import SocialMediaPreviews from "@/components/SocialMediaPreviews";
import RecommendationsCard from "@/components/RecommendationsCard";
import { analyzeSeoScore, getRecommendations } from "@/lib/seoAnalyzer";

const AnalysisResults = ({ analysisData, isLoading, error }) => {
  const [score, setScore] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    if (analysisData) {
      const { score, passed, warnings, errors } = analyzeSeoScore(analysisData);
      setScore(score);
      setPassedCount(passed);
      setWarningCount(warnings);
      setErrorCount(errors);
      setRecommendations(getRecommendations(analysisData));
    }
  }, [analysisData]);

  if (isLoading) {
    return (
      <div>
        <div className="bg-white p-10 rounded-lg shadow-sm border border-neutral-200 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-neutral-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-medium text-neutral-700">Analyzing website meta tags...</h2>
          <p className="text-neutral-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-error/20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-error/10 text-error mb-4">
            <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h2 className="text-lg font-medium text-neutral-800">Unable to fetch website data</h2>
          <p className="text-neutral-600 mt-2 mb-4 text-center">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!analysisData) return null;

  return (
    <div>
      <OverviewSection 
        url={analysisData.url}
        score={score}
        passedCount={passedCount}
        warningCount={warningCount}
        errorCount={errorCount}
        metaTagsCount={analysisData.allMetaTags.length}
        socialShareStatus={
          analysisData.socialTags.openGraph.length > 0 && 
          analysisData.socialTags.twitter.length > 0 ? 
          'Complete' : (analysisData.socialTags.openGraph.length > 0 || 
                       analysisData.socialTags.twitter.length > 0 ? 
                       'Partial' : 'Missing')
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EssentialMetaTags 
            title={analysisData.title}
            description={analysisData.metaTags.description}
            canonical={analysisData.metaTags.canonical}
            viewport={analysisData.metaTags.viewport}
          />
          
          <SocialMediaTags 
            openGraphTags={analysisData.socialTags.openGraph}
            twitterTags={analysisData.socialTags.twitter}
          />
          
          <TechnicalSEOTags 
            robots={analysisData.metaTags.robots}
            hreflang={analysisData.linkTags.hreflang}
          />
        </div>

        <div className="space-y-6">
          <GooglePreview 
            title={analysisData.title}
            description={analysisData.metaTags.description?.content}
            url={analysisData.url}
          />
          
          <SocialMediaPreviews 
            url={analysisData.url}
            title={analysisData.title}
            description={analysisData.metaTags.description?.content}
            image={analysisData.socialTags.openGraph.find(tag => tag.property === 'og:image')?.content}
          />
          
          <RecommendationsCard recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
