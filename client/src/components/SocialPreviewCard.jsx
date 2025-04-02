import { Card, CardContent } from "@/components/ui/card";

export default function SocialPreviewCard({ url, title, description, image, socialStatus, expanded = false }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "good": return "bg-success";
      case "warning": return "bg-warning";
      case "error": return "bg-error";
      default: return "bg-warning";
    }
  };
  
  const getStatusMessage = (status) => {
    switch (status) {
      case "good": return "All social tags present";
      case "warning": return "Some social tags missing";
      case "error": return "Critical social tags missing";
      default: return "Social tags could be improved";
    }
  };
  
  // Default placeholder image if none provided
  const defaultImage = "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image";
  
  return (
    <Card className={`bg-white rounded-xl shadow-sm border border-slate-200 ${expanded ? 'h-full' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-secondary">Social Media Preview</h3>
          <div className="flex gap-1">
            <div className="bg-slate-100 p-1 rounded text-slate-500">
              <i className="ri-facebook-line"></i>
            </div>
            <div className="bg-slate-100 p-1 rounded text-slate-500">
              <i className="ri-twitter-line"></i>
            </div>
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="h-32 bg-slate-200 flex items-center justify-center">
            {image ? (
              <img 
                src={image} 
                alt={`${title} social preview image`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-slate-200 text-slate-500">
                No image available
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="text-xs text-slate-500 mb-1">{url.replace(/^https?:\/\//, '')}</div>
            <div className="text-sm font-semibold mb-1">{title || "No title found"}</div>
            <div className="text-xs text-slate-600 line-clamp-2">
              {description || "No description available for social sharing."}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(socialStatus)}`}></div>
            <span className="text-xs text-slate-600">{getStatusMessage(socialStatus)}</span>
          </div>
          <button className="text-xs text-primary font-medium hover:text-primary/80">
            See details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
