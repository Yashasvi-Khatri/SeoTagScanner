import { truncateString } from "@/lib/seoHelpers";

const SocialMediaPreviews = ({ url, title, description, image }) => {
  // Placeholder image if none provided
  const imageSrc = image || 'https://via.placeholder.com/800x420?text=No+Image+Available';
  
  // Format the domain for display
  const getDomain = () => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fa-solid fa-share-nodes text-primary mr-2"></i>
          Social Media Previews
        </h2>
        
        {/* Facebook Preview */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <i className="fa-brands fa-facebook text-[#1877F2] mr-2"></i>
            <h3 className="font-medium">Facebook Preview</h3>
          </div>
          
          <div className="border border-neutral-200 rounded-md overflow-hidden">
            <div className="w-full aspect-[1.91/1] bg-neutral-100">
              <img 
                src={imageSrc} 
                alt="Facebook preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x420?text=Image+Not+Available';
                  e.target.alt = 'Image not available';
                }}
              />
            </div>
            <div className="p-3 bg-white">
              <div className="text-neutral-500 text-xs mb-1">{getDomain()}</div>
              <div className="font-bold text-sm">{title || "No title available"}</div>
              <div className="text-xs text-neutral-600 mt-1 line-clamp-1">
                {description ? truncateString(description, 100) : "No description available"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Twitter Preview */}
        <div>
          <div className="flex items-center mb-3">
            <i className="fa-brands fa-x-twitter text-neutral-800 mr-2"></i>
            <h3 className="font-medium">Twitter Preview</h3>
          </div>
          
          <div className="border border-neutral-200 rounded-md overflow-hidden">
            <div className="w-full aspect-[2/1] bg-neutral-100">
              <img 
                src={imageSrc} 
                alt="Twitter preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x420?text=Image+Not+Available';
                  e.target.alt = 'Image not available';
                }}
              />
            </div>
            <div className="p-3 bg-white">
              <div className="font-bold text-sm">{title || "No title available"}</div>
              <div className="text-xs text-neutral-600 mt-1 line-clamp-2">
                {description ? truncateString(description, 140) : "No description available"}
              </div>
              <div className="text-neutral-500 text-xs mt-2">{getDomain()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaPreviews;
