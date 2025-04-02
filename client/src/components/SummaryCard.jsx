import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function SummaryCard({ 
  essentialTagsCount, 
  essentialTagsTotal,
  socialTagsCount,
  socialTagsTotal,
  structuredDataCount,
  structuredDataTotal,
  totalTagsFound
}) {
  const getStatusColor = (count, total) => {
    const percentage = (count / total) * 100;
    if (percentage === 100) return "bg-success";
    if (percentage >= 70) return "bg-warning";
    return "bg-error";
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-secondary">Meta Tag Summary</h3>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
            {totalTagsFound} tags found
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Essential tags</span>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{essentialTagsCount}/{essentialTagsTotal}</span>
              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStatusColor(essentialTagsCount, essentialTagsTotal)} rounded-full`} 
                  style={{width: `${(essentialTagsCount / essentialTagsTotal) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Social media tags</span>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{socialTagsCount}/{socialTagsTotal}</span>
              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStatusColor(socialTagsCount, socialTagsTotal)} rounded-full`} 
                  style={{width: `${(socialTagsCount / socialTagsTotal) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Structured data</span>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{structuredDataCount}/{structuredDataTotal}</span>
              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStatusColor(structuredDataCount, structuredDataTotal)} rounded-full`} 
                  style={{width: `${(structuredDataCount / structuredDataTotal) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <Button variant="link" className="text-xs text-primary font-medium hover:text-primary/80 p-0">
            View all tags
          </Button>
          <Button variant="link" className="text-xs text-slate-600 hover:text-slate-900 p-0">
            <i className="ri-download-line mr-1"></i>
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
