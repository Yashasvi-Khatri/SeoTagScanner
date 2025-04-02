import { useEffect, useState } from "react";
import OverviewSection from "@/components/OverviewSection";
import EssentialMetaTags from "@/components/EssentialMetaTags";
import SocialMediaTags from "@/components/SocialMediaTags";
import TechnicalSEOTags from "@/components/TechnicalSEOTags";
import GooglePreview from "@/components/GooglePreview";
import SocialMediaPreviews from "@/components/SocialMediaPreviews";
import RecommendationsCard from "@/components/RecommendationsCard";
import CategorySummary from "@/components/CategorySummary";
import { analyzeSeoScore, getRecommendations } from "@/lib/seoAnalyzer";

const AnalysisResults = ({ analysisData, isLoading, error }) => {
  const [score, setScore] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [categoriesScores, setCategoriesScores] = useState({
    essential: { score: 0, status: 'error', statusText: 'Missing essential tags' },
    social: { status: 'error', statusText: 'No social tags detected' },
    technical: { status: 'error', statusText: 'Missing technical tags' }
  });
  
  useEffect(() => {
    if (analysisData) {
      const { score, passed, warnings, errors } = analyzeSeoScore(analysisData);
      setScore(score);
      setPassedCount(passed);
      setWarningCount(warnings);
      setErrorCount(errors);
      setRecommendations(getRecommendations(analysisData));
      
      // Calculate scores and status for each category
      calculateCategoryScores(analysisData);
    }
  }, [analysisData]);

  const calculateCategoryScores = (data) => {
    // Calculate Essential Meta Tags score
    let essentialScore = 0;
    let essentialStatus = 'error';
    let essentialStatusText = 'Missing essential tags';
    
    const essentialTags = ['title', 'description', 'canonical', 'viewport'];
    const presentEssentialTags = [
      data.title ? 1 : 0,
      data.metaTags.description ? 1 : 0,
      data.metaTags.canonical ? 1 : 0,
      data.metaTags.viewport ? 1 : 0
    ];
    
    const essentialTagsPresent = presentEssentialTags.reduce((a, b) => a + b, 0);
    essentialScore = Math.round((essentialTagsPresent / essentialTags.length) * 100);
    
    if (essentialScore >= 80) {
      essentialStatus = 'optimal';
      essentialStatusText = 'Well optimized';
    } else if (essentialScore >= 50) {
      essentialStatus = 'warning';
      essentialStatusText = 'Needs improvement';
    }
    
    // Calculate Social Media Tags status
    const ogTags = data.socialTags.openGraph.length;
    const twitterTags = data.socialTags.twitter.length;
    let socialStatus = 'error';
    let socialStatusText = 'No social tags detected';
    
    if (ogTags > 0 && twitterTags > 0) {
      socialStatus = 'optimal';
      socialStatusText = 'Complete';
    } else if (ogTags > 0 || twitterTags > 0) {
      socialStatus = 'warning';
      socialStatusText = 'Partial implementation';
    }
    
    // Calculate Technical SEO Tags status
    let technicalStatus = 'error';
    let technicalStatusText = 'Missing technical tags';
    
    if (data.metaTags.robots && data.linkTags.hreflang && data.linkTags.hreflang.length > 0) {
      technicalStatus = 'optimal';
      technicalStatusText = 'Well implemented';
    } else if (data.metaTags.robots || (data.linkTags.hreflang && data.linkTags.hreflang.length > 0)) {
      technicalStatus = 'warning';
      technicalStatusText = 'Partial implementation';
    }
    
    setCategoriesScores({
      essential: { 
        score: essentialScore, 
        status: essentialStatus, 
        statusText: essentialStatusText 
      },
      social: { 
        status: socialStatus, 
        statusText: socialStatusText,
        count: ogTags + twitterTags
      },
      technical: { 
        status: technicalStatus, 
        statusText: technicalStatusText,
        count: (data.metaTags.robots ? 1 : 0) + (data.linkTags.hreflang ? data.linkTags.hreflang.length : 0)
      }
    });
  };

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
      
      {/* Category Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CategorySummary
          title="Essential Meta Tags"
          icon="fa-solid fa-tag"
          score={categoriesScores.essential.score}
          status={categoriesScores.essential.status}
          statusText={categoriesScores.essential.statusText}
          tooltip="These are the fundamental meta tags that every website should have. They include the title, description, canonical, and viewport tags."
        />
        
        <CategorySummary
          title="Social Media Tags"
          icon="fa-solid fa-share-nodes"
          status={categoriesScores.social.status}
          statusText={categoriesScores.social.statusText}
          count={categoriesScores.social.count}
          tooltip="These tags determine how your content appears when shared on social media platforms like Facebook, Twitter, and LinkedIn."
        />
        
        <CategorySummary
          title="Technical SEO Tags"
          icon="fa-solid fa-gears"
          status={categoriesScores.technical.status}
          statusText={categoriesScores.technical.statusText}
          count={categoriesScores.technical.count}
          tooltip="These tags provide additional technical information to search engines, such as indexing directives and language variants."
        />
      </div>

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
