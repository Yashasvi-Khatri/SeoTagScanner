import { useState } from "react";
import { ClipboardCopy, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TagDisplay({ tag }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case "good": return "bg-success";
      case "warning": return "bg-warning";
      case "error": return "bg-error";
      default: return "bg-warning";
    }
  };
  
  const getStatusTextColor = (status) => {
    switch (status) {
      case "good": return "text-success";
      case "warning": return "text-warning";
      case "error": return "text-error";
      default: return "text-warning";
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(tag.code);
    toast({
      title: "Copied!",
      description: `${tag.name} code copied to clipboard`,
    });
  };
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(tag.status)}`}></div>
          <h4 className="font-medium text-secondary">{tag.name}</h4>
        </div>
        <div className="flex gap-1">
          <button 
            className="text-slate-400 hover:text-slate-600 p-1" 
            title="Copy code"
            onClick={handleCopyCode}
          >
            <ClipboardCopy className="h-4 w-4" />
          </button>
          <button 
            className="text-slate-400 hover:text-slate-600 p-1" 
            title="Edit recommendation"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="bg-slate-50 p-2 rounded border border-slate-200 font-mono text-xs overflow-x-auto">
          {tag.code}
        </div>
        <div className="text-xs text-slate-600">
          <span className={`${getStatusTextColor(tag.status)} font-medium`}>
            {tag.status === "good" ? "Good:" : tag.status === "warning" ? "Needs improvement:" : "Missing:"}
          </span> 
          {" "}{tag.message}
        </div>
      </div>
    </div>
  );
}
