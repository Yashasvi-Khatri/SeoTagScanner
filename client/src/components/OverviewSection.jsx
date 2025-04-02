import { useState, useEffect } from "react";

const OverviewSection = ({ 
  url, 
  score, 
  passedCount, 
  warningCount, 
  errorCount, 
  metaTagsCount,
  socialShareStatus
}) => {
  const [scoreColor, setScoreColor] = useState("bg-success");
  const [socialStatusColor, setSocialStatusColor] = useState("bg-success");
  
  useEffect(() => {
    // Set score color
    if (score < 50) {
      setScoreColor("bg-error");
    } else if (score < 80) {
      setScoreColor("bg-warning");
    } else {
      setScoreColor("bg-success");
    }
    
    // Set social share status color
    if (socialShareStatus === 'Missing') {
      setSocialStatusColor("bg-error");
    } else if (socialShareStatus === 'Partial') {
      setSocialStatusColor("bg-warning");
    } else {
      setSocialStatusColor("bg-success");
    }
  }, [score, socialShareStatus]);

  return (
    <section className="mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">SEO Analysis Results</h2>
            <p className="text-neutral-600 text-sm">
              <i className="fa-solid fa-link mr-1"></i>
              <span>{url}</span>
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
              <i className="fa-solid fa-circle-check mr-1"></i>
              <span>{passedCount} Passed</span>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning/10 text-warning">
              <i className="fa-solid fa-triangle-exclamation mr-1"></i>
              <span>{warningCount} Warnings</span>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error/10 text-error">
              <i className="fa-solid fa-circle-xmark mr-1"></i>
              <span>{errorCount} Issues</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
            <div className="flex items-center mb-2">
              <div className={`h-3 w-3 rounded-full ${scoreColor} mr-2`}></div>
              <h3 className="font-medium">Overall Score</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{score}/100</div>
            <div className="text-sm text-neutral-600">
              {score >= 80 ? "Good SEO implementation" : 
               score >= 50 ? "Average SEO implementation" : 
               "Poor SEO implementation"}
            </div>
          </div>
          
          <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
            <div className="flex items-center mb-2">
              <div className="h-3 w-3 rounded-full bg-success mr-2"></div>
              <h3 className="font-medium">Meta Tags</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{metaTagsCount}</div>
            <div className="text-sm text-neutral-600">SEO tags detected</div>
          </div>
          
          <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
            <div className="flex items-center mb-2">
              <div className={`h-3 w-3 rounded-full ${socialStatusColor} mr-2`}></div>
              <h3 className="font-medium">Social Share</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{socialShareStatus}</div>
            <div className="text-sm text-neutral-600">
              {socialShareStatus === 'Complete' ? 'All tags present' : 
               socialShareStatus === 'Partial' ? 'Some tags missing' : 
               'No social tags found'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
