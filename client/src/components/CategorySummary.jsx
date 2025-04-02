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
  // Determine gradient colors based on status
  const getStatusStyles = (status) => {
    switch (status) {
      case 'optimal':
        return {
          bg: 'bg-success',
          text: 'text-success',
          gradient: 'from-green-400 to-green-600',
          bgGradient: 'from-green-50 to-emerald-50',
          border: 'border-green-100',
          iconBg: 'from-green-400/20 to-emerald-400/20'
        };
      case 'warning':
        return {
          bg: 'bg-warning',
          text: 'text-warning',
          gradient: 'from-amber-400 to-amber-600',
          bgGradient: 'from-amber-50 to-yellow-50',
          border: 'border-amber-100',
          iconBg: 'from-amber-400/20 to-yellow-400/20'
        };
      case 'error':
        return {
          bg: 'bg-error',
          text: 'text-error',
          gradient: 'from-red-400 to-red-600',
          bgGradient: 'from-red-50 to-rose-50',
          border: 'border-red-100',
          iconBg: 'from-red-400/20 to-rose-400/20'
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-500',
          gradient: 'from-blue-400 to-indigo-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          border: 'border-blue-100',
          iconBg: 'from-blue-400/20 to-indigo-400/20'
        };
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

  const styles = getStatusStyles(status);

  // Get a category-specific color based on title
  const getCategoryColor = (title) => {
    if (title.includes('Essential')) {
      return {
        iconGradient: 'from-violet-500 to-indigo-500',
        cardGradient: 'from-violet-50 to-indigo-50',
        iconBgGradient: 'from-violet-400/20 to-indigo-400/20',
        border: 'border-indigo-100'
      };
    } else if (title.includes('Social')) {
      return {
        iconGradient: 'from-pink-500 to-rose-500',
        cardGradient: 'from-pink-50 to-rose-50',
        iconBgGradient: 'from-pink-400/20 to-rose-400/20',
        border: 'border-pink-100'
      };
    } else if (title.includes('Technical')) {
      return {
        iconGradient: 'from-cyan-500 to-blue-500',
        cardGradient: 'from-cyan-50 to-blue-50',
        iconBgGradient: 'from-cyan-400/20 to-blue-400/20',
        border: 'border-cyan-100'
      };
    } else {
      return {
        iconGradient: 'from-primary to-indigo-500',
        cardGradient: 'from-indigo-50 to-blue-50',
        iconBgGradient: 'from-indigo-400/20 to-blue-400/20',
        border: 'border-indigo-100'
      };
    }
  };

  const categoryColor = getCategoryColor(title);

  return (
    <div className={`p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg bg-white border ${categoryColor.border} relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColor.cardGradient} opacity-50`}></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`mr-3 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${categoryColor.iconBgGradient} shadow-sm`}>
              <i className={`${icon} text-lg bg-clip-text text-transparent bg-gradient-to-r ${categoryColor.iconGradient}`}></i>
            </div>
            <h3 className="font-bold text-lg text-gray-800">
              {title}
            </h3>
          </div>
          {tooltip && (
            <div className="relative group">
              <div className="cursor-help text-indigo-400 hover:text-indigo-600">
                <i className="fa-solid fa-circle-info"></i>
              </div>
              <div className="absolute right-0 w-64 p-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            {score !== undefined && (
              <div className="flex items-end">
                <div className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${styles.gradient}`}>
                  {score}
                </div>
                <div className="text-lg text-gray-400 mb-1">/100</div>
              </div>
            )}
            {count !== undefined && (
              <div className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${categoryColor.iconGradient}`}>
                {count}
              </div>
            )}
            <div className="flex items-center mt-2">
              <div className={`h-3 w-3 rounded-full ${styles.bg} mr-2`}></div>
              <span className={`text-sm font-medium ${styles.text}`}>
                <i className={`${getStatusIcon(status)} mr-1`}></i>
                {statusText}
              </span>
            </div>
          </div>
          
          {score !== undefined && (
            <div className="w-20 h-20 relative">
              <div className="w-full h-full rounded-full bg-gray-100"></div>
              <svg className="w-20 h-20 absolute inset-0" viewBox="0 0 36 36">
                <path
                  className="stroke-current text-gray-200"
                  fill="none"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`stroke-current ${styles.text}`}
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base font-semibold text-gray-600">
                {score}%
              </div>
            </div>
          )}
          
          {count !== undefined && (
            <div className="opacity-10 text-7xl">
              <i className={icon}></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySummary;