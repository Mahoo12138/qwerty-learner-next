import Header from "@/components/Header";
import type React from "react";
import { Keyboard, Bookmark, PlaneLanding } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="bg-app-background flex flex-col items-center justify-center">
      <div className="container min-h-screen flex flex-col justify-between p-6 w-full">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-[100px]">
          <div className="flex-grow flex flex-col items-center justify-center">
            <button className="w-full max-w-sm bg-app-primary hover:bg-app-secondary transition-all text-white text-xl font-semibold py-5 px-6 rounded-xl element-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-app-secondary focus:ring-opacity-75 flex items-center justify-center space-x-3">
              <Keyboard />
              <span>Start Practice</span>
            </button>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-14 mt-12 p-12 text-white">
            <div className="bg-app-secondary backdrop-blur-sm p-6 rounded-xl element-shadow hover:border hover:border-app-primary transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-white text-shadow group-hover:text-green-100 transition-colors">
                  Dictionary
                </h2>
                <Bookmark />
              </div>
              <p className="text-white/80 text-sm text-shadow">
                View your dictionaries
              </p>
              <div className="mt-4 h-2 bg-white/40 rounded-full overflow-hidden">
                <div className="h-full bg-app-primary w-3/5"></div>
              </div>
            </div>
            <div className="bg-app-secondary backdrop-blur-sm p-6 rounded-xl element-shadow hover:border hover:border-app-primary transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-white text-shadow group-hover:text-green-100 transition-colors">
                  Dashboard
                </h2>
                <PlaneLanding />
              </div>
              <p className="text-white/80 text-sm text-shadow">
                View your progress
              </p>
              <div className="mt-4 h-2 bg-white/40 rounded-full overflow-hidden">
                <div className="h-full bg-app-primary w-4/5"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
