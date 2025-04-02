import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

export default function StatusBar({ domain, score, status }) {
  // Status can be "good", "warning", or "error"
  const statusConfig = {
    good: {
      icon: CheckCircle,
      color: "border-success",
      bgColor: "bg-success/20",
      textColor: "text-success",
      message: "Excellent SEO implementation"
    },
    warning: {
      icon: AlertTriangle,
      color: "border-warning",
      bgColor: "bg-warning/20",
      textColor: "text-warning",
      message: "Some improvements needed for optimal SEO performance"
    },
    error: {
      icon: AlertCircle,
      color: "border-error",
      bgColor: "bg-error/20",
      textColor: "text-error",
      message: "Critical SEO issues detected"
    }
  };
  
  const config = statusConfig[status] || statusConfig.warning;
  const Icon = config.icon;
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 ${config.color}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${config.bgColor} p-2 rounded-full`}>
            <Icon className={`${config.textColor}`} />
          </div>
          <div>
            <h3 className="font-medium text-secondary">{domain} Analysis</h3>
            <p className="text-sm text-slate-600">{config.message}</p>
          </div>
        </div>
        <div className="text-sm bg-slate-100 px-3 py-1 rounded-full">
          Score: <span className="font-semibold">{score}/100</span>
        </div>
      </div>
    </div>
  );
}
