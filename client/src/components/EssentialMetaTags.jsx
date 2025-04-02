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
          <div className="bg-neutral-50 p-3 rounded mt-3">
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

const EssentialMetaTags = ({ title, description, canonical, viewport }) => {
  const tagItems = [
    {
      name: 'Title Tag',
      content: title ? `<title>${title}</title>` : null,
      status: title ? (title.length > 10 && title.length < 60 ? 'Optimal' : 'Needs Improvement') : 'Missing',
      recommendation: title 
        ? (title.length > 10 && title.length < 60 
            ? `Title has optimal length (${title.length} characters).` 
            : `Title length (${title.length} characters) is ${title.length < 10 ? 'too short' : 'too long'}. Aim for 50-60 characters.`)
        : 'Missing title tag. Implementation: <title>Your Page Title</title>'
    },
    {
      name: 'Meta Description',
      content: description ? `<meta name="description" content="${description.content}">` : null,
      status: description 
        ? (description.content.length > 120 && description.content.length < 158 ? 'Optimal' : 'Needs Improvement') 
        : 'Missing',
      recommendation: description 
        ? (description.content.length > 120 && description.content.length < 158 
            ? `Description has optimal length (${description.content.length} characters).` 
            : `Description length (${description.content.length} characters) is ${description.content.length < 120 ? 'too short' : 'too long'}. Aim for 120-158 characters.`)
        : 'Missing meta description. Implementation: <meta name="description" content="Your page description here">'
    },
    {
      name: 'Canonical URL',
      content: canonical ? `<link rel="canonical" href="${canonical.href}">` : null,
      status: canonical ? 'Optimal' : 'Missing',
      recommendation: canonical 
        ? 'Canonical URL is properly implemented.' 
        : 'Missing canonical URL tag. Implementation: <link rel="canonical" href="https://yourdomain.com/page-url">'
    },
    {
      name: 'Viewport',
      content: viewport ? `<meta name="viewport" content="${viewport.content}">` : null,
      status: viewport ? 'Optimal' : 'Missing',
      recommendation: viewport 
        ? 'Viewport meta tag is properly implemented.' 
        : 'Viewport meta tag is missing. This affects mobile optimization. Implementation: <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    }
  ];

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fa-solid fa-tag text-primary mr-2"></i>
          Essential Meta Tags
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

export default EssentialMetaTags;
