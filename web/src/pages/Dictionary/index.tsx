import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
import Grid from '@mui/joy/Grid';
import Drawer from '@mui/joy/Drawer';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Textarea from '@mui/joy/Textarea';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

import { ChevronDown, Ellipsis, Plus, Trash2, Edit2 } from 'lucide-react';

import { Main } from "@/components/layouts/Main";
import Header from "@/components/SettingHeader";



// 示例数据
const categories = ["我的", "大学", "高中", "初中", "小学", "词组", "留学", "其他", "旧版词书"];
const tags = [
  "全部", "考纲核心", "人教版", "外研社版", "北师大版", "牛津译林版", "牛津上海版"
];

// 分类数据
const initialCategories = [
  { id: 1, name: "我的", description: "个人创建的词库" },
  { id: 2, name: "大学", description: "大学英语词库" },
  { id: 3, name: "高中", description: "高中英语词库" },
  { id: 4, name: "初中", description: "初中英语词库" },
  { id: 5, name: "小学", description: "小学英语词库" },
];

const dictionaries = [
  {
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
];


// 词典卡片组件
const DictionaryCard = ({
  title,
  subtitle,
  words,
  onEdit
}: {
  title: string;
  subtitle: string;
  words: number;
  onEdit: () => void;
}) => (
  <Card
    orientation="horizontal"
    onClick={onEdit}
    sx={{
      '&:hover': {
        boxShadow: 'md',
        borderColor: 'neutral.outlinedHoverBorder',
        cursor: 'pointer'
      },
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'space-between',
      position: 'relative',
    }}
  >
    <div style={{ textAlign: "left" }}>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{title}</div>
      <div style={{ color: "#444", margin: "8px 0" }}>{subtitle}</div>
      <div style={{ fontWeight: 700, fontSize: 18, color: "#363636" }}>
        {words} <span style={{ fontWeight: 400, fontSize: 16 }}>词</span>
      </div>
    </div>
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

const options = ['添加分类'];
const DictionaryPage = () => {
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState("高中");
  const [activeTag, setActiveTag] = useState("牛津上海版");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const actionRef = useRef<() => void>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedDictionary, setSelectedDictionary] = useState<typeof dictionaries[0] | null>(null);
  const [wordList, setWordList] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  const [wordModalOpen, setWordModalOpen] = useState(false);
  const [newWordData, setNewWordData] = useState({
    word: '',
    meaning: '',
    example: '',
    notes: ''
  });
  const [dictionariesList, setDictionariesList] = useState(dictionaries);
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: ''
  });

  const handleClick = () => {
    setIsCreateMode(true);
    setSelectedDictionary({
      title: '',
      subtitle: '',
      words: 0,
      color: 'is-link',
      categoryId: parseInt(selectedCategory) || 1,
    });
    setWordList([]);
    setOpen(true);
  };

  // const handleMenuItemClick = (
  //   event: React.MouseEvent<HTMLElement, MouseEvent>,
  //   index: number,
  // ) => {
  //   setSelectedIndex(index);
  //   setOpen(false);
  // };

  const handleEditDictionary = (dict: typeof dictionaries[0]) => {
    setIsCreateMode(false);
    setSelectedDictionary(dict);
    setWordList([]); // 这里可以加载实际的单词列表
    setOpen(true);
  };

  const handleSaveDictionary = () => {
    if (isCreateMode && selectedDictionary) {
      // 创建新词库
      const newDictionary = {
        ...selectedDictionary,
        words: wordList.length,
      };
      setDictionariesList([...dictionariesList, newDictionary]);
    } else if (selectedDictionary) {
      // 更新现有词库
      const updatedDictionaries = dictionariesList.map(dict =>
        dict === selectedDictionary
          ? { ...selectedDictionary, words: wordList.length }
          : dict
      );
      setDictionariesList(updatedDictionaries);
    }
    setOpen(false);
    setSelectedDictionary(null);
    setIsCreateMode(false);
  };

  const handleAddWord = () => {
    if (newWordData.word.trim()) {
      setWordList([...wordList, newWordData.word.trim()]);
      setNewWordData({
        word: '',
        meaning: '',
        example: '',
        notes: ''
      });
      setWordModalOpen(false);
    }
  };

  const handleDeleteWord = (index: number) => {
    setWordList(wordList.filter((_, i) => i !== index));
  };

  const handleAddCategory = () => {
    if (newCategoryData.name.trim()) {
      const newCategory = {
        id: Math.max(...categoriesList.map(c => c.id)) + 1,
        name: newCategoryData.name.trim(),
        description: newCategoryData.description.trim(),
      };
      setCategoriesList([...categoriesList, newCategory]);
      setNewCategoryData({ name: '', description: '' });
      setCategoryModalOpen(false);
    }
  };

  const filteredDictionaries = selectedCategory === 'all' 
    ? dictionariesList 
    : dictionariesList.filter(dict => dict.categoryId === parseInt(selectedCategory));

  return (
    <Main>
      <div className="container" style={{ padding: "24px 0" }}>
        <Header title={t('词库')} description={t('词库描述')} >
          <ButtonGroup
            spacing="0.5rem"
            color="primary"
          >
            <Button onClick={handleClick} variant="solid">添加新词库</Button>
            <Button 
              variant="outlined" 
              onClick={() => setCategoryModalOpen(true)}
            >
              添加分类
            </Button>

            {/* <IconButton
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onMouseDown={() => {
                actionRef.current = () => setOpen(!open);
              }}
              onKeyDown={() => {
                actionRef.current = () => setOpen(!open);
              }}
              onClick={() => {
                actionRef.current?.();
              }}
            >
              <ChevronDown size={16} />
            </IconButton> */}
          </ButtonGroup>
          {/* <Menu open={open} onClose={() => setOpen(false)} anchorEl={anchorRef.current}>
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
          </Menu> */}
        </Header>


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

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Input placeholder="搜索词库..." variant="outlined" />
          <Select 
            value={selectedCategory} 
            onChange={(_, value) => setSelectedCategory(value || 'all')}
            sx={{ minWidth: 120 }}
          >
            <Option value="all">全部分类</Option>
            {categoriesList.map(category => (
              <Option key={category.id} value={category.id.toString()}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>


        <Divider sx={{ margin: "16px 0" }} />




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
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, md: 3 }}
          sx={{ flexGrow: 1 }}
        >
          {filteredDictionaries.map((dict, idx) => (
            <Grid xs={1} key={idx}>
              <DictionaryCard
                title={dict.title}
                subtitle={dict.subtitle}
                words={dict.words}
                onEdit={() => handleEditDictionary(dict)}
              />
            </Grid>
          ))}
        </Grid>

        <Drawer
          size="md"
          variant="plain"
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedDictionary(null);
            setIsCreateMode(false);
          }}
          slotProps={{
            content: {
              sx: {
                bgcolor: 'transparent',
                p: { md: 3, sm: 2, xs: 1 },
                boxShadow: 'none',
              },
            },
          }}
        >
          <Sheet
            sx={{
              borderRadius: 'md',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
              overflow: 'auto',
            }}
          >
            <Typography level="title-lg" component="h2">
              {isCreateMode ? '新建词库' : '编辑词库'}
            </Typography>

            <FormControl>
              <FormLabel>词库名称</FormLabel>
              <Input
                value={selectedDictionary?.title}
                onChange={(e) => setSelectedDictionary(prev => prev ? { ...prev, title: e.target.value } : null)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>词库介绍</FormLabel>
              <Textarea
                minRows={2}
                value={selectedDictionary?.subtitle}
                onChange={(e) => setSelectedDictionary(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
              />
            </FormControl>

            <Divider />

            <Typography level="title-md">单词列表</Typography>
            <Button
              startDecorator={<Plus size={16} />}
              onClick={() => setWordModalOpen(true)}
            >
              添加单词
            </Button>

            <List>
              {wordList.map((word, index) => (
                <ListItem key={index}>
                  <ListItemContent>{word}</ListItemContent>
                  <IconButton
                    variant="plain"
                    color="neutral"
                    onClick={() => handleDeleteWord(index)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </ListItem>
              ))}
            </List>

            <div style={{ marginTop: 'auto', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button onClick={handleSaveDictionary}>
                {isCreateMode ? '创建' : '保存'}
              </Button>
            </div>
          </Sheet>
        </Drawer>

        <Modal open={wordModalOpen} onClose={() => setWordModalOpen(false)}>
          <ModalDialog
            aria-labelledby="add-word-modal"
            sx={{
              maxWidth: 500,
              width: '100%',
              p: 3,
              boxShadow: 'lg',
            }}
          >
            <ModalClose />
            <Typography level="title-lg" component="h2" id="add-word-modal">
              添加单词
            </Typography>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleAddWord();
              }}
            >
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>单词</FormLabel>
                <Input
                  value={newWordData.word}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, word: e.target.value }))}
                  required
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>释义</FormLabel>
                <Textarea
                  minRows={2}
                  value={newWordData.meaning}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, meaning: e.target.value }))}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>例句</FormLabel>
                <Textarea
                  minRows={2}
                  value={newWordData.example}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, example: e.target.value }))}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>备注</FormLabel>
                <Textarea
                  minRows={2}
                  value={newWordData.notes}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </FormControl>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => setWordModalOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  添加
                </Button>
              </div>
            </form>
          </ModalDialog>
        </Modal>

        {/* 添加分类的 Modal */}
        <Modal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
          <ModalDialog
            aria-labelledby="add-category-modal"
            sx={{
              maxWidth: 500,
              width: '100%',
              p: 3,
              boxShadow: 'lg',
            }}
          >
            <ModalClose />
            <Typography level="title-lg" component="h2" id="add-category-modal">
              添加分类
            </Typography>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleAddCategory();
              }}
            >
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>分类名称</FormLabel>
                <Input
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>分类描述</FormLabel>
                <Textarea
                  minRows={2}
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                />
              </FormControl>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => setCategoryModalOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  添加
                </Button>
              </div>
            </form>
          </ModalDialog>
        </Modal>
      </div>
    </Main>
  );
};

export default DictionaryPage;
