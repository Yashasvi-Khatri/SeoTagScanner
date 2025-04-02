import { SearchEyeIcon } from "./ui/icons";

export default function Footer() {
  return (
    <footer className="py-6 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <SearchEyeIcon className="text-primary text-xl" />
            <span className="font-semibold text-secondary">MetaScope</span>
            <span className="text-sm text-slate-500">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-600 hover:text-primary">About</a>
            <a href="#" className="text-slate-600 hover:text-primary">Privacy</a>
            <a href="#" className="text-slate-600 hover:text-primary">Terms</a>
            <a href="#" className="text-slate-600 hover:text-primary">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
