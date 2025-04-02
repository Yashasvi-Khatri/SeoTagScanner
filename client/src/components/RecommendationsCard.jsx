const RecommendationItem = ({ type, title, description }) => {
  const bgColors = {
    'success': 'bg-success/10 border-success/20',
    'warning': 'bg-warning/10 border-warning/20',
    'error': 'bg-error/10 border-error/20'
  };
  
  const textColors = {
    'success': 'text-success',
    'warning': 'text-warning',
    'error': 'text-error'
  };

  return (
    <div className={`p-3 ${bgColors[type]} border rounded-md`}>
      <div className={`font-medium ${textColors[type]}`}>{title}</div>
      <p className="text-sm text-neutral-700 mt-1">
        {description}
      </p>
    </div>
  );
};

const RecommendationsCard = ({ recommendations }) => {
  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
          SEO Recommendations
        </h2>
        
        <div className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <RecommendationItem 
                key={index}
                type={rec.type}
                title={rec.title}
                description={rec.description}
              />
            ))
          ) : (
            <div className="text-center p-6 bg-neutral-50 rounded-md border border-neutral-200">
              <i className="fa-solid fa-check-circle text-success text-xl mb-2"></i>
              <p className="text-neutral-600">No recommendations needed - great job!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendationsCard;
