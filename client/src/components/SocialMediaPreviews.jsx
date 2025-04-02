import { useState } from "react";
import { truncateString } from "@/lib/seoHelpers";

const SocialMediaPreviews = ({ url, title, description, image }) => {
  const [activePreview, setActivePreview] = useState('facebook');
  
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

  // Determine overall sharing status
  const getSharingStatus = () => {
    if (!title && !description && !image) {
      return { status: 'error', message: 'Missing all sharing tags' };
    } else if (!image) {
      return { status: 'warning', message: 'Missing image for sharing' };
    } else if (!description) {
      return { status: 'warning', message: 'Missing description for sharing' };
    } else if (!title) {
      return { status: 'warning', message: 'Missing title for sharing' };
    } else {
      return { status: 'optimal', message: 'Complete social share setup' };
    }
  };

  const sharingStatus = getSharingStatus();

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <i className="fa-solid fa-share-nodes text-primary mr-2"></i>
            Social Media Previews
          </div>
          <div className={`
            px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center
            ${sharingStatus.status === 'optimal' ? 'bg-success/10 text-success' : 
              sharingStatus.status === 'warning' ? 'bg-warning/10 text-warning' : 
              'bg-error/10 text-error'}
          `}>
            <i className={`
              mr-1
              ${sharingStatus.status === 'optimal' ? 'fa-solid fa-circle-check' : 
                sharingStatus.status === 'warning' ? 'fa-solid fa-triangle-exclamation' : 
                'fa-solid fa-circle-xmark'}
            `}></i>
            {sharingStatus.message}
          </div>
        </h2>
        
        {/* Preview Type Selector */}
        <div className="flex border-b border-neutral-200 mb-4">
          <button 
            className={`px-4 py-2 flex items-center ${activePreview === 'facebook' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600 hover:text-neutral-800'}`}
            onClick={() => setActivePreview('facebook')}
          >
            <i className="fa-brands fa-facebook text-[#1877F2] mr-2"></i>
            Facebook
          </button>
          <button 
            className={`px-4 py-2 flex items-center ${activePreview === 'twitter' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600 hover:text-neutral-800'}`}
            onClick={() => setActivePreview('twitter')}
          >
            <i className="fa-brands fa-x-twitter text-neutral-800 mr-2"></i>
            Twitter
          </button>
          <button 
            className={`px-4 py-2 flex items-center ${activePreview === 'linkedin' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600 hover:text-neutral-800'}`}
            onClick={() => setActivePreview('linkedin')}
          >
            <i className="fa-brands fa-linkedin-in text-[#0077B5] mr-2"></i>
            LinkedIn
          </button>
        </div>
        
        {/* Mobile Device Frame */}
        <div className="relative mx-auto w-full max-w-[320px] border-8 border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
          {/* Status Bar */}
          <div className="bg-neutral-800 text-white text-xs p-1 flex items-center justify-between">
            <div>{activePreview === 'facebook' ? 'Facebook' : activePreview === 'twitter' ? 'Twitter' : 'LinkedIn'}</div>
            <div className="flex items-center">
              <i className="fa-solid fa-signal mr-1"></i>
              <i className="fa-solid fa-wifi mr-1"></i>
              <i className="fa-solid fa-battery-full"></i>
            </div>
          </div>
          
          {/* App Interface */}
          <div className="bg-neutral-100 h-[460px] overflow-y-auto">
            {/* Facebook Preview */}
            {activePreview === 'facebook' && (
              <div className="bg-white">
                <div className="p-2 border-b border-neutral-200 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-300 mr-2"></div>
                  <div>
                    <div className="text-sm font-medium">User Name</div>
                    <div className="text-xs text-neutral-500">Just now · <i className="fa-solid fa-earth-americas"></i></div>
                  </div>
                </div>
                <div className="p-2 text-sm">Check out this interesting website!</div>
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
                <div className="flex items-center justify-around p-2 border-t border-neutral-200 text-neutral-600">
                  <div className="flex items-center text-xs"><i className="fa-regular fa-thumbs-up mr-1"></i> Like</div>
                  <div className="flex items-center text-xs"><i className="fa-regular fa-comment mr-1"></i> Comment</div>
                  <div className="flex items-center text-xs"><i className="fa-solid fa-share mr-1"></i> Share</div>
                </div>
              </div>
            )}
            
            {/* Twitter Preview */}
            {activePreview === 'twitter' && (
              <div className="bg-white">
                <div className="p-2 border-b border-neutral-200 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-300 mr-2"></div>
                  <div>
                    <div className="text-sm font-medium">User Name <span className="text-neutral-500">@username · 1m</span></div>
                  </div>
                </div>
                <div className="p-2 text-sm">Check out this website I just found 🔍</div>
                <div className="border border-neutral-200 rounded-md overflow-hidden m-2">
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
                <div className="flex items-center justify-around p-2 border-t border-neutral-200 text-neutral-600">
                  <div className="flex items-center text-xs"><i className="fa-regular fa-comment mr-1"></i> 2</div>
                  <div className="flex items-center text-xs"><i className="fa-solid fa-retweet mr-1"></i> 5</div>
                  <div className="flex items-center text-xs"><i className="fa-regular fa-heart mr-1"></i> 10</div>
                  <div className="flex items-center text-xs"><i className="fa-solid fa-share mr-1"></i></div>
                </div>
              </div>
            )}
            
            {/* LinkedIn Preview */}
            {activePreview === 'linkedin' && (
              <div className="bg-white">
                <div className="p-2 border-b border-neutral-200 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-300 mr-2"></div>
                  <div>
                    <div className="text-sm font-medium">User Name</div>
                    <div className="text-xs text-neutral-500">Content Creator · 1h · <i className="fa-solid fa-earth-americas"></i></div>
                  </div>
                </div>
                <div className="p-2 text-sm">I wanted to share this interesting website with my network. #content #digital</div>
                <div className="border border-neutral-200 overflow-hidden">
                  <div className="w-full aspect-[1.91/1] bg-neutral-100">
                    <img 
                      src={imageSrc} 
                      alt="LinkedIn preview" 
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
                      {description ? truncateString(description, 100) : "No description available"}
                    </div>
                    <div className="text-neutral-500 text-xs mt-2">{getDomain()}</div>
                  </div>
                </div>
                <div className="flex items-center justify-around p-2 border-t border-neutral-200 text-neutral-600">
                  <div className="flex items-center text-xs"><i className="fa-regular fa-thumbs-up mr-1"></i> 15</div>
                  <div className="flex items-center text-xs"><i className="fa-regular fa-comment mr-1"></i> 3</div>
                  <div className="flex items-center text-xs"><i className="fa-solid fa-share mr-1"></i> 2</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Home Button */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-neutral-700 rounded-full"></div>
        </div>
        
        <div className="mt-4 text-center text-sm text-neutral-500">
          <i className="fa-solid fa-circle-info mr-1"></i>
          Preview how your website will appear when shared on social media
        </div>
      </div>
    </section>
  );
};

export default SocialMediaPreviews;
