import { Main } from "@/components/layouts/Main";
import { useState } from "react";

// 示例数据
const categories = ["我的", "大学", "高中", "初中", "小学", "词组", "留学", "其他", "旧版词书"];
const tags = [
  "全部", "考纲核心", "人教版", "外研社版", "北师大版", "牛津译林版", "牛津上海版"
];
const dictionaries = [
  {
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
  },
  {
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
  },
  {
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
  },
  {
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
  },
  {
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
  },
  {
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
  },
];

// 回退按钮组件
const BackButton = () => (
  <button
    className="button is-white"
    style={{ boxShadow: "none" }}
    onClick={() => window.history.back()}
  >
    <span className="icon">
      {/* 简单左箭头 SVG */}
      <svg width="20" height="20" viewBox="0 0 20 20">
        <polyline points="12 5 7 10 12 15" fill="none" stroke="#333" strokeWidth="2" />
      </svg>
    </span>
  </button>
);

// 词典卡片组件
const DictionaryCard = ({ title, subtitle, words }: { title: string; subtitle: string; words: number }) => (
  <div
    className="box"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      minHeight: 120,
    }}
  >
    <div style={{ textAlign: "left" }}>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{title}</div>
      <div style={{ color: "#444", margin: "8px 0" }}>{subtitle}</div>
      <div style={{ fontWeight: 700, fontSize: 18, color: "#363636" }}>
        {words} <span style={{ fontWeight: 400, fontSize: 16 }}>词</span>
      </div>
    </div>
    {/* 右侧插画（SVG 占位） */}
    <div style={{ width: 60, height: 60 }}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <rect x="5" y="20" width="10" height="35" fill="#bfcfff" rx="2" />
        <rect x="18" y="10" width="12" height="45" fill="#e6e6e6" rx="2" />
        <rect x="33" y="15" width="8" height="40" fill="#e3f6d5" rx="2" />
        <rect x="44" y="5" width="8" height="50" fill="#d6cfff" rx="2" />
      </svg>
    </div>
  </div>
);

const DictionaryPage = () => {
  const [activeCategory, setActiveCategory] = useState("高中");
  const [activeTag, setActiveTag] = useState("牛津上海版");
  const [search, setSearch] = useState("");

  return (
    <Main>
      {/* 页面整体加边距 */}
      <div className="container" style={{ padding: "24px 0" }}>
        {/* 顶部导航 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <BackButton />
          <h2 style={{ fontSize: 22, fontWeight: 600, marginLeft: 8 }}>词库</h2>
        </div>

        {/* Tab + 搜索框同行 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tabs is-medium" style={{ marginBottom: 0 }}>
              <ul>
                {categories.map(cat => (
                  <li key={cat} className={cat === activeCategory ? "is-active" : ""}>
                    <a onClick={() => setActiveCategory(cat)}>{cat}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ml-4" style={{ flexShrink: 0, width: 300 }}>
            <input
              className="input is-medium"
              type="text"
              placeholder="输入词书名称搜索"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 标签筛选 */}
        <div className="buttons my-5">
          {tags.map(tag => (
            <button
              key={tag}
              className={`button is-light ${tag === activeTag ? "is-info" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 词典列表，响应式多列 */}
        <div className="columns is-multiline">
          {dictionaries.map((dict, idx) => (
            <div className="column is-12-mobile is-6-tablet is-4-desktop" key={idx}>
              <DictionaryCard
                title={dict.title}
                subtitle={dict.subtitle}
                words={dict.words}
              />
            </div>
          ))}
        </div>
      </div>
    </Main>
  );
};

export default DictionaryPage;
