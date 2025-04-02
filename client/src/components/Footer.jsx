const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6 px-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
              </svg>
              <span className="font-medium">SEO Tag Analyzer</span>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Analyze and optimize your website's SEO meta tags
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-600 hover:text-primary transition-colors">About</a>
            <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-neutral-600 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
        <div className="text-center mt-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
