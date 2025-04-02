import React from "react";

const CategorySummary = ({ 
  title, 
  icon, 
  score, 
  status, 
  statusText, 
  count,
  tooltip 
}) => {
  // Determine background color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-neutral-400';
    }
  };

  // Determine text color based on status
  const getTextColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-neutral-700';
    }
  };

  // Determine status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimal':
        return 'fa-solid fa-circle-check';
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      case 'error':
        return 'fa-solid fa-circle-xmark';
      default:
        return 'fa-solid fa-circle-info';
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ${getTextColor(status)}`}>
            <i className={icon}></i>
          </div>
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        {tooltip && (
          <div className="relative group">
            <div className="cursor-help text-neutral-400 hover:text-neutral-600">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <div className="absolute right-0 w-64 p-3 bg-neutral-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          {score !== undefined && (
            <div className="text-3xl font-bold mb-1">{score}<span className="text-lg text-neutral-400">/100</span></div>
          )}
          {count !== undefined && (
            <div className="text-3xl font-bold mb-1">{count}</div>
          )}
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${getStatusColor(status)} mr-2`}></div>
            <span className={`text-sm ${getTextColor(status)}`}>
              <i className={`${getStatusIcon(status)} mr-1`}></i>
              {statusText}
            </span>
          </div>
        </div>
        
        {score !== undefined && (
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16" viewBox="0 0 36 36">
              <path
                className="stroke-current text-neutral-200"
                fill="none"
                strokeWidth="3"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`stroke-current ${getTextColor(status)}`}
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
              {score}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySummary;