import type React from "react";
import { Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import { Book, AlertCircle, BarChart2, Calendar } from "lucide-react";

const Home: React.FC = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  return (
    <div className="container">
      <Header />
      <div className="has-text-centered" style={{ marginTop: "8rem" }}>
        <h2 className="title is-1 mb-6">
          {getGreeting()}
        </h2>
        <p className="subtitle is-4 mb-6 has-text-grey">
          准备好开始今天的打字练习了吗？
        </p>
        <Link
          to="/"
          className="button is-primary is-large"
        >
          开始练习
        </Link>
      </div>

      <div className="columns is-multiline mt-6">
        <div className="column is-6">
          <div className="card has-background-light">
            <div className="card-content">
              <div className="is-flex is-justify-content-space-between is-align-items-center">
                <div className="card-text">
                  <h3 className="title is-4 mb-3">词库</h3>
                  <p className="has-text-grey">管理你的词库，添加新的单词和短语</p>
                </div>
                <Link to="/dictionary" className="is-block">
                  <Book className="has-text-grey-light" size={48} style={{ transition: "color 0.3s" }} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-6">
          <div className="card has-background-light">
            <div className="card-content">
              <div className="is-flex is-justify-content-space-between is-align-items-center">
                <div className="card-text">
                  <h3 className="title is-4 mb-3">错题本</h3>
                  <p className="has-text-grey">查看和复习你经常出错的单词</p>
                </div>
                <Link to="/mistake" className="is-block">
                  <AlertCircle className="has-text-grey-light" size={48} style={{ transition: "color 0.3s" }} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-6">
          <div className="card has-background-light">
            <div className="card-content">
              <div className="is-flex is-justify-content-space-between is-align-items-center">
                <div className="card-text">
                  <h3 className="title is-4 mb-3">统计</h3>
                  <p className="has-text-grey">查看你的练习数据和进步情况</p>
                </div>
                <Link to="/statistic" className="is-block">
                  <BarChart2 className="has-text-grey-light" size={48} style={{ transition: "color 0.3s" }} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-6">
          <div className="card has-background-light">
            <div className="card-content">
              <div className="is-flex is-justify-content-space-between is-align-items-center">
                <div className="card-text">
                  <h3 className="title is-4 mb-3">练习计划</h3>
                  <p className="has-text-grey">制定和跟踪你的练习计划</p>
                </div>
                <Link to="/plan" className="is-block">
                  <Calendar className="has-text-grey-light" size={48} style={{ transition: "color 0.3s" }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card:hover .has-text-grey-light {
          color: var(--bulma-primary) !important;
        }
        .card-text {
          transition: transform 0.3s;
        }
        .card:hover .card-text {
          transform: translateX(8px);
        }
        .card:hover .card-text .title {
          color: var(--bulma-primary) !important;
        }
        .card:hover .card-text .has-text-grey {
          color: var(--bulma-grey-dark) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
