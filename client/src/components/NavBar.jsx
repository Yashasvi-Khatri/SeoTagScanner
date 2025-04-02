import { Button } from "@/components/ui/button";
import { SearchEyeIcon } from "./ui/icons";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SearchEyeIcon className="text-primary text-2xl" />
          <span className="font-bold text-xl text-secondary">MetaScope</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-sm px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors">
            <i className="ri-moon-line mr-1"></i>
            <span className="hidden sm:inline">Dark Mode</span>
          </Button>
          <a href="#" className="text-primary text-sm font-medium hover:text-primary/80">Docs</a>
          <a href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900">About</a>
        </div>
      </div>
    </nav>
  );
}
