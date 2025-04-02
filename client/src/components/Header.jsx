import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { toast } = useToast();
  
  const handleHelp = () => {
    toast({
      title: "SEO Analyzer Help",
      description: "Enter any website URL to analyze its SEO meta tags and get optimization recommendations.",
    });
  };
  
  const handleSaveReport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The save report feature will be available in a future update.",
    });
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <svg className="w-8 h-8 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
          </svg>
          <h1 className="text-xl font-semibold">SEO Tag Analyzer</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-neutral-600 hover:text-primary transition-colors" onClick={handleHelp}>
            <i className="fa-solid fa-circle-info text-lg"></i>
            <span className="ml-1 hidden md:inline">Help</span>
          </button>
          <button 
            className="bg-primary hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm flex items-center transition-colors"
            onClick={handleSaveReport}
          >
            <i className="fa-solid fa-bookmark mr-2"></i>
            <span>Save Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
