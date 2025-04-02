import { useState } from "react";
import { Button } from "@/components/ui/button";
import TagDisplay from "./TagDisplay";

export default function MetaTagsList({ essentialTags, socialTags }) {
  const [socialFilter, setSocialFilter] = useState("all");
  
  const filteredSocialTags = socialFilter === "all" 
    ? socialTags 
    : socialTags.filter(tag => tag.type === socialFilter.toLowerCase());
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-secondary">Essential Meta Tags</h2>
        <Button 
          variant="ghost" 
          className="text-sm text-primary font-medium hover:text-primary/80"
        >
          <i className="ri-code-line mr-1"></i>
          View Raw HTML
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {essentialTags.map((tag, index) => (
          <TagDisplay key={index} tag={tag} />
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-secondary">Social Media Tags</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Show:</span>
          <div className="flex p-1 bg-slate-100 rounded-md">
            <Button 
              onClick={() => setSocialFilter("all")}
              variant={socialFilter === "all" ? "default" : "ghost"}
              size="sm"
              className={`px-2 py-1 text-xs rounded ${socialFilter === "all" ? "bg-white shadow-sm" : ""}`}
            >
              All
            </Button>
            <Button
              onClick={() => setSocialFilter("opengraph")}
              variant={socialFilter === "opengraph" ? "default" : "ghost"}
              size="sm"
              className={`px-2 py-1 text-xs ${socialFilter === "opengraph" ? "bg-white shadow-sm" : ""}`}
            >
              OpenGraph
            </Button>
            <Button
              onClick={() => setSocialFilter("twitter")}
              variant={socialFilter === "twitter" ? "default" : "ghost"}
              size="sm"
              className={`px-2 py-1 text-xs ${socialFilter === "twitter" ? "bg-white shadow-sm" : ""}`}
            >
              Twitter
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSocialTags.map((tag, index) => (
          <TagDisplay key={index} tag={tag} />
        ))}
      </div>
    </div>
  );
}
