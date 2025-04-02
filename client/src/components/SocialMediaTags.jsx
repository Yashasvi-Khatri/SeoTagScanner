import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const TagItem = ({ name, content, status }) => {
  const { toast } = useToast();
  
  const statusColors = {
    'Optimal': {
      dotColor: 'bg-success',
      badgeColor: 'bg-success/10 text-success'
    },
    'Needs Improvement': {
      dotColor: 'bg-warning',
      badgeColor: 'bg-warning/10 text-warning'
    },
    'Missing': {
      dotColor: 'bg-error',
      badgeColor: 'bg-error/10 text-error'
    }
  };
  
  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: `${name} tag has been copied to your clipboard.`,
      });
    }
  };

  return (
    <div className="border border-neutral-200 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full ${statusColors[status].dotColor} mr-2`}></div>
          <h3 className="font-medium">{name}</h3>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status].badgeColor}`}>
            {status}
          </span>
          <button 
            className="ml-2 text-neutral-400 hover:text-neutral-600"
            onClick={handleCopy}
          >
            <i className="fa-solid fa-copy"></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        <pre className="bg-neutral-50 p-3 rounded font-mono text-sm overflow-x-auto whitespace-pre-wrap mb-3">
          <code>{content}</code>
        </pre>
        
        {/* Show image preview if it's an image tag */}
        {name.includes('image') && content.includes('content="http') && (
          <div className="mt-2">
            <img 
              src={content.match(/content="([^"]+)"/)[1]} 
              alt="Preview" 
              className="w-full max-w-sm rounded-md border border-neutral-200" 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x210?text=Image+Not+Available';
                e.target.alt = 'Image not available';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const SocialMediaTags = ({ openGraphTags, twitterTags }) => {
  const [activeTab, setActiveTab] = useState('openGraph');
  
  // Process Open Graph tags
  const ogTagItems = openGraphTags.map(tag => {
    const name = tag.property;
    const content = `<meta property="${tag.property}" content="${tag.content}">`;
    let status = 'Optimal';
    
    if (tag.property === 'og:description' && tag.content.length < 60) {
      status = 'Needs Improvement';
    }
    
    return { name, content, status };
  });
  
  // Process Twitter tags
  const twitterTagItems = twitterTags.map(tag => {
    const name = tag.name;
    const content = `<meta name="${tag.name}" content="${tag.content}">`;
    let status = 'Optimal';
    
    if (tag.name === 'twitter:description' && tag.content.length < 60) {
      status = 'Needs Improvement';
    }
    
    return { name, content, status };
  });

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fa-solid fa-share-nodes text-primary mr-2"></i>
          Social Media Tags
        </h2>
        
        <div className="mb-6">
          <div className="flex border-b border-neutral-200">
            <button 
              className={`px-4 py-2 ${activeTab === 'openGraph' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600 hover:text-neutral-800'}`}
              onClick={() => setActiveTab('openGraph')}
            >
              Open Graph (Facebook)
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'twitter' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600 hover:text-neutral-800'}`}
              onClick={() => setActiveTab('twitter')}
            >
              Twitter Card
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'openGraph' ? (
            ogTagItems.length > 0 ? (
              ogTagItems.map((tag, index) => (
                <TagItem 
                  key={index}
                  name={tag.name}
                  content={tag.content}
                  status={tag.status}
                />
              ))
            ) : (
              <div className="text-center p-6 bg-neutral-50 rounded-md border border-neutral-200">
                <i className="fa-solid fa-circle-xmark text-error text-xl mb-2"></i>
                <p className="text-neutral-600">No Open Graph tags detected on this page</p>
              </div>
            )
          ) : (
            twitterTagItems.length > 0 ? (
              twitterTagItems.map((tag, index) => (
                <TagItem 
                  key={index}
                  name={tag.name}
                  content={tag.content}
                  status={tag.status}
                />
              ))
            ) : (
              <div className="text-center p-6 bg-neutral-50 rounded-md border border-neutral-200">
                <i className="fa-solid fa-circle-xmark text-error text-xl mb-2"></i>
                <p className="text-neutral-600">No Twitter Card tags detected on this page</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaTags;
