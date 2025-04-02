import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, FileDown, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Recommendations({ recommendations }) {
  const { toast } = useToast();
  const [expandedItems, setExpandedItems] = useState([0]); // First item expanded by default
  
  const toggleItem = (index) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };
  
  const exportReport = () => {
    let report = "# SEO Recommendation Report\n\n";
    
    recommendations.forEach((rec, index) => {
      report += `## ${index + 1}. ${rec.title}\n`;
      report += `Priority: ${rec.priority}\n\n`;
      report += `${rec.description}\n\n`;
      report += "```html\n";
      report += `${rec.code}\n`;
      report += "```\n\n";
    });
    
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-recommendations.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Exported",
      description: "SEO recommendations have been downloaded",
    });
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-secondary">Recommendations</h2>
        <Button 
          className="text-sm bg-primary text-white px-3 py-1.5 rounded hover:bg-primary/90 flex items-center"
          onClick={exportReport}
        >
          <FileDown className="h-4 w-4 mr-1" />
          Export Report
        </Button>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              onClick={() => toggleItem(index)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${
                  rec.priority === "high" 
                    ? "bg-error/20" 
                    : rec.priority === "medium" 
                      ? "bg-warning/20" 
                      : "bg-success/20"
                } flex items-center justify-center`}>
                  <i className={`ri-error-warning-line ${
                    rec.priority === "high" 
                      ? "text-error" 
                      : rec.priority === "medium" 
                        ? "text-warning" 
                        : "text-success"
                  }`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-secondary">{rec.title}</h4>
                  <p className="text-sm text-slate-600">{rec.subtitle}</p>
                </div>
              </div>
              {expandedItems.includes(index) ? (
                <ChevronUp className="text-lg text-slate-400" />
              ) : (
                <ChevronDown className="text-lg text-slate-400" />
              )}
            </div>
            
            {expandedItems.includes(index) && (
              <div className="px-4 pb-4 border-t border-slate-100">
                <div className="pt-3 text-sm text-slate-700">
                  <p className="mb-3">{rec.description}</p>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs mb-3">
                    {rec.code}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="text-xs px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90"
                      onClick={() => copyCode(rec.code)}
                    >
                      <Clipboard className="h-3 w-3 mr-1" />
                      Copy Code
                    </Button>
                    {rec.learnMoreUrl && (
                      <Button 
                        size="sm"
                        variant="secondary"
                        className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                        onClick={() => window.open(rec.learnMoreUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Learn More
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
