import { Card, CardContent } from "@/components/ui/card";

export default function GooglePreviewCard({ url, title, description, titleStatus, expanded = false }) {
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
      case "good": return "Title length is optimal";
      case "warning": return "Title could be more specific";
      case "error": return "Title is too long or missing";
      default: return "Title could be improved";
    }
  };
  
  return (
    <Card className={`bg-white rounded-xl shadow-sm border border-slate-200 ${expanded ? 'h-full' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-secondary">Google Search Preview</h3>
          <div className="bg-slate-100 p-1 rounded text-slate-500">
            <i className="ri-google-line"></i>
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="text-sm text-slate-500 mb-1 truncate">{url}</div>
          <div className="text-xl text-blue-700 font-medium mb-1 hover:underline cursor-pointer">
            {title || "No title found"}
          </div>
          <div className="text-sm text-slate-700 line-clamp-2">
            {description || "No description found. Search engines may display auto-generated content for this result."}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(titleStatus)}`}></div>
            <span className="text-xs text-slate-600">{getStatusMessage(titleStatus)}</span>
          </div>
          <button className="text-xs text-primary font-medium hover:text-primary/80">
            See details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
