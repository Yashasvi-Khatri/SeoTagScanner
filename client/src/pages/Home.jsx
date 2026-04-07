import { useState, useEffect } from "react";
import URLInput from "@/components/URLInput";
import AnalysisResults from "@/components/AnalysisResults";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/auth";

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { user, logout } = useAuth();

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = getToken();
      const res = await fetch("/api/scan/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setScanHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [analysisData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <header className="bg-gradient-to-r from-primary/90 to-indigo-600/90 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <i className="fa-solid fa-magnifying-glass text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SEO Tag Analyzer</h1>
                <p className="text-sm text-white/80">
                  Analyze and improve your website's SEO meta tags
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs font-bold">
                    KHATRI ENTERPRISES™
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg">
                    <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-user text-xs"></i>
                    </div>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  >
                    <i className="fa-solid fa-right-from-bracket mr-1"></i>
                    <span className="hidden md:inline">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <URLInput
          setAnalysisData={setAnalysisData}
          setIsLoading={setIsLoading}
          setError={setError}
        />

        <AnalysisResults
          analysisData={analysisData}
          isLoading={isLoading}
          error={error}
        />

        {/* Scan History */}
        <section className="mt-10">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-clock-rotate-left text-indigo-500 mr-2"></i>
                Scan History
              </h2>
              <button
                onClick={fetchHistory}
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <i className="fa-solid fa-rotate-right mr-1"></i> Refresh
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {historyLoading ? (
                <div className="py-8 text-center text-gray-400">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading history...
                </div>
              ) : scanHistory.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <i className="fa-solid fa-magnifying-glass mr-2"></i>
                  No scans yet. Analyze a website above to get started.
                </div>
              ) : (
                scanHistory.map((item) => (
                  <div key={item.id} className="flex items-start justify-between px-6 py-4 hover:bg-indigo-50/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm truncate block"
                      >
                        {item.url}
                      </a>
                      {item.title && (
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{item.title}</p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            {scanHistory.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 text-xs text-gray-400 text-right">
                Showing {scanHistory.length} recent scan{scanHistory.length !== 1 ? "s" : ""} · Limit: 20/day
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                SEO Tag Analyzer
              </h2>
              <p className="text-sm text-gray-400">
                Analyze and optimize your website's SEO meta tags for better search visibility
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-solid fa-envelope text-xl"></i>
              </a>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-gray-500 mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
            </div>
            <div className="text-xs">
              <span className="text-purple-400 font-semibold">Powered by KHATRI ENTERPRISES™</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
