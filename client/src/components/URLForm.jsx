import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function URLForm({ onSubmit, showAdvanced, setShowAdvanced }) {
  const [urlInput, setUrlInput] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!urlInput) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }
    
    // Add protocol if missing
    let processedUrl = urlInput;
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }
    
    // Validate URL format
    try {
      new URL(processedUrl);
    } catch (err) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(processedUrl);
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-3xl mx-auto">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-global-line text-slate-400"></i>
              </div>
              <Input
                type="text"
                placeholder="Enter a website URL (e.g., https://example.com)"
                className="w-full pl-10 pr-4 py-3 rounded-lg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 transition flex items-center justify-center gap-2"
            >
              <i className="ri-search-line"></i>
              Analyze
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Checkbox 
                id="advanced" 
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
              <Label htmlFor="advanced" className="text-sm text-slate-600">Advanced options</Label>
            </div>
            <Button variant="link" className="text-sm text-primary hover:text-primary/80 font-medium p-0">
              <i className="ri-history-line mr-1"></i>
              Recent analyses
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
