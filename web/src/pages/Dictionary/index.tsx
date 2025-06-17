import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Input from '@mui/joy/Input';
import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import { Main } from "@/components/layouts/Main";
import Header from "@/components/SettingHeader";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from 'lucide-react';


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


// 词典卡片组件
const DictionaryCard = ({ title, subtitle, words }: { title: string; subtitle: string; words: number }) => (
  <Card
    orientation="horizontal"
    sx={{
      '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
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
  </Card>
);

const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];
const DictionaryPage = () => {
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState("高中");
  const [activeTag, setActiveTag] = useState("牛津上海版");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const actionRef = useRef<() => void>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  return (
    <Main>
      <div className="container" style={{ padding: "24px 0" }}>
        <Header title={t('词库')} description={t('词库描述')} >
          <ButtonGroup
            ref={anchorRef}
            variant="solid"
            color="success"
            aria-label="split button"
          >
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <IconButton
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onMouseDown={() => {
                // @ts-ignore
                actionRef.current = () => setOpen(!open);
              }}
              onKeyDown={() => {
                // @ts-ignore
                actionRef.current = () => setOpen(!open);
              }}
              onClick={() => {
                actionRef.current?.();
              }}
            >
             <ChevronDown size={16}/>
            </IconButton>
          </ButtonGroup>
          <Menu open={open} onClose={() => setOpen(false)} anchorEl={anchorRef.current}>
            {options.map((option, index) => (
              <MenuItem
                key={option}
                disabled={index === 2}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Header>

        <Divider sx={{ margin: "16px 0" }} />

        {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
        </div> */}

        <div style={{ display: 'flex', gap: 8 }}>
          <Input placeholder="Type in here…" variant="outlined" />
          <Select defaultValue="english" >
            <Option value="english">英语</Option>
            <Option value="cat">Cat</Option>
            <Option value="fish">Fish</Option>
            <Option value="bird">Bird</Option>
          </Select>
        </div>



        {/* 标签筛选 */}
        {/* <div className="buttons my-5">
          {tags.map(tag => (
            <button
              key={tag}
              className={`button is-light ${tag === activeTag ? "is-info" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div> */}

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
