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
  const [scoreColor, setScoreColor] = useState({
    bg: "bg-success",
    text: "text-success",
    gradient: "from-green-400 to-green-600"
  });
  const [socialStatusColor, setSocialStatusColor] = useState({
    bg: "bg-success",
    text: "text-success",
    gradient: "from-green-400 to-green-600"
  });
  
  useEffect(() => {
    // Set score color
    if (score < 50) {
      setScoreColor({
        bg: "bg-error",
        text: "text-error",
        gradient: "from-red-400 to-red-600"
      });
    } else if (score < 80) {
      setScoreColor({
        bg: "bg-warning",
        text: "text-warning",
        gradient: "from-amber-400 to-amber-600"
      });
    } else {
      setScoreColor({
        bg: "bg-success",
        text: "text-success",
        gradient: "from-green-400 to-green-600"
      });
    }
    
    // Set social share status color
    if (socialShareStatus === 'Missing') {
      setSocialStatusColor({
        bg: "bg-error",
        text: "text-error",
        gradient: "from-red-400 to-red-600"
      });
    } else if (socialShareStatus === 'Partial') {
      setSocialStatusColor({
        bg: "bg-warning",
        text: "text-warning",
        gradient: "from-amber-400 to-amber-600"
      });
    } else {
      setSocialStatusColor({
        bg: "bg-success",
        text: "text-success",
        gradient: "from-green-400 to-green-600"
      });
    }
  }, [score, socialShareStatus]);

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-md border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
              SEO Analysis Results
            </h2>
            <p className="text-indigo-600 text-sm flex items-center">
              <i className="fa-solid fa-link mr-2 bg-indigo-100 p-1 rounded-full"></i>
              <span>{url}</span>
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-700 shadow-sm">
              <i className="fa-solid fa-circle-check mr-1.5 text-green-600"></i>
              <span>{passedCount} Passed</span>
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-700 shadow-sm">
              <i className="fa-solid fa-triangle-exclamation mr-1.5 text-amber-600"></i>
              <span>{warningCount} Warnings</span>
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-red-400/20 to-red-500/20 text-red-700 shadow-sm">
              <i className="fa-solid fa-circle-xmark mr-1.5 text-red-600"></i>
              <span>{errorCount} Issues</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 from-primary to-indigo-400"></div>
            <div className="flex items-center mb-3">
              <div className={`h-4 w-4 rounded-full ${scoreColor.bg} mr-2`}></div>
              <h3 className="font-semibold text-gray-800">Overall Score</h3>
            </div>
            <div className="flex items-end">
              <div className={`text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${scoreColor.gradient}`}>
                {score}
              </div>
              <div className="text-lg text-gray-400 mb-1">/100</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-3">
              <div 
                className={`h-2.5 rounded-full bg-gradient-to-r ${scoreColor.gradient}`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <div className={`text-sm ${scoreColor.text}`}>
              {score >= 80 ? "Good SEO implementation" : 
               score >= 50 ? "Average SEO implementation" : 
               "Poor SEO implementation"}
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 from-blue-400 to-cyan-400"></div>
            <div className="flex items-center mb-3">
              <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
              <h3 className="font-semibold text-gray-800">Meta Tags</h3>
            </div>
            <div className="text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
              {metaTagsCount}
            </div>
            <div className="mt-3 text-sm text-blue-600">
              <i className="fa-solid fa-tag mr-1"></i> SEO tags detected
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <i className="fa-solid fa-tags text-7xl text-blue-300"></i>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-purple-100 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 from-purple-400 to-pink-400"></div>
            <div className="flex items-center mb-3">
              <div className={`h-4 w-4 rounded-full ${socialStatusColor.bg} mr-2`}></div>
              <h3 className="font-semibold text-gray-800">Social Share</h3>
            </div>
            <div className={`text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${socialStatusColor.gradient}`}>
              {socialShareStatus}
            </div>
            <div className="mt-3 text-sm text-purple-600">
              <i className="fa-solid fa-share-nodes mr-1"></i>
              {socialShareStatus === 'Complete' ? 'All tags present' : 
               socialShareStatus === 'Partial' ? 'Some tags missing' : 
               'No social tags found'}
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <i className="fa-solid fa-share-from-square text-7xl text-purple-300"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
