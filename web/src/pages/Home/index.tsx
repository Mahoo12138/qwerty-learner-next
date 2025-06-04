import Header from "@/components/Header";
import type React from "react";
import { Keyboard, Bookmark, PlaneLanding } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="">
        <Header />
        <main className="">
          <div className="">
            <button>
              <Keyboard />
              <span>Start Practice</span>
            </button>
          </div>
          <div className="grid has-2-cols">
            <div className="cell card">
              <div className="card-content">
              <p>Dictionary</p>
                <button className="card-header-icon" aria-label="more options">
                  <span className="icon">
                    <Bookmark />
                  </span>
                </button>
                <div className="content">View your dictionaries</div>
              </div>
            </div>
            <div className="cell card">
              <div className="">
                <h2 className="">Dashboard</h2>
                <PlaneLanding />
              </div>
              <p className="">View your progress</p>
              <div className="">
                <div className=""></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
