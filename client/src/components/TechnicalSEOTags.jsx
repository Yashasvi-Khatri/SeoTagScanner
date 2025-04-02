import { useToast } from "@/hooks/use-toast";

const TagItem = ({ status, name, content, recommendation }) => {
  const { toast } = useToast();
  
  const statusColors = {
    'Optimal': {
      dotColor: 'bg-success',
      badgeColor: 'bg-success/10 text-success',
      icon: 'fa-solid fa-circle-check text-success'
    },
    'Needs Improvement': {
      dotColor: 'bg-warning',
      badgeColor: 'bg-warning/10 text-warning',
      icon: 'fa-solid fa-triangle-exclamation text-warning'
    },
    'Missing': {
      dotColor: 'bg-error',
      badgeColor: 'bg-error/10 text-error',
      icon: 'fa-solid fa-circle-xmark text-error'
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
            title="Copy tag to clipboard"
          >
            <i className="fa-solid fa-copy"></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        {content && (
          <pre className="bg-neutral-50 p-3 rounded font-mono text-sm overflow-x-auto whitespace-pre-wrap mb-3">
            <code>{content}</code>
          </pre>
        )}
        
        {recommendation && (
          <div className="text-sm text-neutral-600">
            <i className={statusColors[status].icon + " mr-1"}></i>
            {recommendation}
          </div>
        )}
        
        {status === 'Missing' && (
          <div className="bg-neutral-50 p-3 rounded">
            <div className="text-sm font-medium mb-2">Recommended Implementation:</div>
            <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              <code>{recommendation.includes('Implementation') ? recommendation.split('Implementation:')[1].trim() : recommendation}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const TechnicalSEOTags = ({ robots, hreflang }) => {
  // Create technical SEO tag items
  const tagItems = [
    {
      name: 'robots',
      content: robots ? `<meta name="robots" content="${robots.content}">` : null,
      status: robots ? 'Optimal' : 'Missing',
      recommendation: robots 
        ? `Robots meta tag is properly implemented.`
        : `Missing robots meta tag. Implementation: <meta name="robots" content="index, follow">`
    },
    {
      name: 'hreflang',
      content: hreflang && hreflang.length > 0 
        ? hreflang.map(tag => `<link rel="alternate" hreflang="${tag.hreflang}" href="${tag.href}">`).join('\n')
        : null,
      status: hreflang && hreflang.length > 0 ? 'Optimal' : 'Missing',
      recommendation: hreflang && hreflang.length > 0
        ? `Hreflang tags are properly implemented.`
        : `Missing hreflang tags. These are important if your site has multilingual content. Implementation: <link rel="alternate" hreflang="en" href="https://example.com/">`
    }
  ];

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fa-solid fa-gears text-primary mr-2"></i>
          Technical SEO Tags
        </h2>
        
        <div className="space-y-4">
          {tagItems.map((tag, index) => (
            <TagItem 
              key={index}
              name={tag.name}
              content={tag.content}
              status={tag.status}
              recommendation={tag.recommendation}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSEOTags;
