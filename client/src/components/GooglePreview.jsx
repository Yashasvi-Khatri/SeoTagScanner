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

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fa-brands fa-google text-primary mr-2"></i>
          Google Search Preview
        </h2>
        
        <div className="border border-neutral-200 rounded-md p-4">
          <div className="mb-3">
            <div className="text-xl text-blue-600 hover:underline cursor-pointer font-medium truncate">
              {title || "No title available"}
            </div>
            <div className="text-green-700 text-sm truncate">
              {displayUrl()}
            </div>
            <div className="text-sm text-neutral-700 mt-1 line-clamp-2">
              {description ? truncateString(description, 160) : "No description available"}
            </div>
          </div>
          
          <div className="text-xs text-neutral-500">
            <i className="fa-solid fa-circle-info mr-1"></i>
            This is how your page may appear in Google search results
          </div>
        </div>
      </div>
    </section>
  );
};

export default GooglePreview;
