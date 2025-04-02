import { truncateString } from "@/lib/seoHelpers";

const GooglePreview = ({ title, description, url }) => {
  // Clean up URL for display
  const displayUrl = () => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname === '/' ? '' : urlObj.pathname;
      return `${urlObj.hostname}${path}`;
    } catch (e) {
      return url;
    }
  };

  // Calculate snippet quality based on title and description
  const getSnippetQuality = () => {
    let quality = { status: 'error', message: 'Missing meta data' };
    
    if (title && description) {
      if (title.length > 10 && title.length < 60 && description.length > 120 && description.length < 160) {
        quality = { status: 'optimal', message: 'Optimized for search results' };
      } else {
        quality = { status: 'warning', message: 'Could be improved' };
      }
    } else if (title) {
      quality = { status: 'warning', message: 'Missing description' };
    } else if (description) {
      quality = { status: 'warning', message: 'Missing title' };
    }
    
    return quality;
  };

  const snippetQuality = getSnippetQuality();

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <i className="fa-brands fa-google text-primary mr-2"></i>
            Google Search Preview
          </div>
          <div className={`
            px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center
            ${snippetQuality.status === 'optimal' ? 'bg-success/10 text-success' : 
              snippetQuality.status === 'warning' ? 'bg-warning/10 text-warning' : 
              'bg-error/10 text-error'}
          `}>
            <i className={`
              mr-1
              ${snippetQuality.status === 'optimal' ? 'fa-solid fa-circle-check' : 
                snippetQuality.status === 'warning' ? 'fa-solid fa-triangle-exclamation' : 
                'fa-solid fa-circle-xmark'}
            `}></i>
            {snippetQuality.message}
          </div>
        </h2>
        
        {/* Desktop Search Preview */}
        <div className="mb-6 hidden md:block">
          <div className="bg-white rounded-lg shadow-md border border-neutral-100 p-4">
            <div className="flex items-center mb-4 border-b border-neutral-200 pb-3">
              <div className="w-6 h-6 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="#4285F4" d="M12 11h6.2v2H12zm-6.2 0H12v2H5.8z"/>
                  <path fill="#EA4335" d="M17.9 6c-1.2-1.2-2.8-1.9-4.4-1.9-3.5 0-6.2 2.8-6.2 6.2 0 3.5 3 6.2 6.2 6.2 2.4 0 4.6-1.4 5.6-3.5h-2.3c-.8 1.2-2 1.9-3.3 1.9-2.2 0-4-1.8-4-4 0-2.2 1.8-4 4-4 1.1 0 2.1.5 2.8 1.3L15 9.8h5.8V4l-2.9 2z"/>
                  <path fill="#FBBC05" d="M5.8 17.3h12.3v-2H5.8z"/>
                  <path fill="#34A853" d="M12 11h6.2v2H12z"/>
                </svg>
              </div>
              <div className="flex-grow">
                <div className="w-full bg-neutral-100 h-8 rounded-full flex items-center px-4">
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-none focus:outline-none text-sm"
                    value={displayUrl()}
                    readOnly
                  />
                  <i className="fa-solid fa-magnifying-glass text-neutral-400"></i>
                </div>
              </div>
            </div>
            
            <div className="mb-2 flex text-neutral-600 text-xs">
              <span className="mr-2">{displayUrl()}</span>
              <span>▾</span>
            </div>
            
            <div className="mb-3">
              <div className="text-xl text-blue-600 hover:underline cursor-pointer font-medium truncate max-w-full">
                {title || "No title available"}
              </div>
              <div className="text-green-700 text-sm truncate max-w-full">
                {displayUrl()}
              </div>
              <div className="text-sm text-neutral-700 mt-1 line-clamp-2 max-w-full">
                {description ? truncateString(description, 160) : "No description available"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Preview */}
        <div className="md:hidden">
          <div className="border-2 border-neutral-300 rounded-xl overflow-hidden w-full max-w-[340px] mx-auto">
            <div className="bg-neutral-100 p-2 flex items-center border-b border-neutral-300">
              <div className="w-5 h-5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M12 11h6.2v2H12zm-6.2 0H12v2H5.8z"/>
                  <path fill="#EA4335" d="M17.9 6c-1.2-1.2-2.8-1.9-4.4-1.9-3.5 0-6.2 2.8-6.2 6.2 0 3.5 3 6.2 6.2 6.2 2.4 0 4.6-1.4 5.6-3.5h-2.3c-.8 1.2-2 1.9-3.3 1.9-2.2 0-4-1.8-4-4 0-2.2 1.8-4 4-4 1.1 0 2.1.5 2.8 1.3L15 9.8h5.8V4l-2.9 2z"/>
                  <path fill="#FBBC05" d="M5.8 17.3h12.3v-2H5.8z"/>
                  <path fill="#34A853" d="M12 11h6.2v2H12z"/>
                </svg>
              </div>
              <div className="flex-grow bg-white rounded-full text-xs p-1.5 px-3 text-neutral-500">
                {displayUrl()}
              </div>
            </div>
            
            <div className="p-3 bg-white">
              <div className="text-green-700 text-xs">
                {displayUrl()}
              </div>
              <div className="text-blue-600 text-sm font-medium mb-1 line-clamp-2">
                {title || "No title available"}
              </div>
              <div className="text-neutral-600 text-xs line-clamp-2 mb-2">
                {description ? truncateString(description, 120) : "No description available"}
              </div>
              
              <div className="flex text-xs text-neutral-500 border-t border-neutral-200 pt-2 justify-between">
                <div>Similar pages</div>
                <div>Share</div>
                <div>More results</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">SEO Elements</div>
            <div className="text-xs text-neutral-500">
              <span className={title ? 'text-success' : 'text-error'}>
                <i className={`fa-solid ${title ? 'fa-check' : 'fa-xmark'} mr-1`}></i>
                Title
              </span>
              <span className="mx-2">•</span>
              <span className={description ? 'text-success' : 'text-error'}>
                <i className={`fa-solid ${description ? 'fa-check' : 'fa-xmark'} mr-1`}></i>
                Description
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-neutral-50 p-2 rounded-md border border-neutral-200">
              <div className="text-xs text-neutral-500 mb-1">Title Length</div>
              <div className="flex items-center">
                <div className="w-full bg-neutral-200 rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      !title ? 'w-0 bg-error' :
                      (title.length < 30) ? 'bg-warning' : 
                      (title.length > 60) ? 'bg-error' : 
                      'bg-success'
                    }`} 
                    style={{ width: `${Math.min(100, title ? (title.length / 60) * 100 : 0)}%` }}
                  ></div>
                </div>
                <div className="text-xs whitespace-nowrap">
                  {title ? title.length : 0}/60
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-2 rounded-md border border-neutral-200">
              <div className="text-xs text-neutral-500 mb-1">Description Length</div>
              <div className="flex items-center">
                <div className="w-full bg-neutral-200 rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      !description ? 'w-0 bg-error' :
                      (description.length < 80) ? 'bg-warning' : 
                      (description.length > 160) ? 'bg-error' : 
                      'bg-success'
                    }`} 
                    style={{ width: `${Math.min(100, description ? (description.length / 160) * 100 : 0)}%` }}
                  ></div>
                </div>
                <div className="text-xs whitespace-nowrap">
                  {description ? description.length : 0}/160
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GooglePreview;
