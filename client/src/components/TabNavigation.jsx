export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "meta-tags", label: "Meta Tags" },
    { id: "previews", label: "Previews" },
    { id: "recommendations", label: "Recommendations" },
    { id: "raw-html", label: "Raw HTML" }
  ];
  
  return (
    <div className="mb-6 border-b border-slate-200">
      <div className="flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id 
                ? "text-primary border-b-2 border-primary" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
