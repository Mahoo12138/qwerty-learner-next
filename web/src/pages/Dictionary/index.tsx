import { useRef, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from '@tanstack/react-query';

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
import CircularProgress from '@mui/joy/CircularProgress';

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
    id: 1,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 2,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 3,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 4,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 5,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 6,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 7,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 8,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 9,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 10,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 11,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 12,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 13,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 14,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 15,
    title: "CET-6",
    subtitle: "大学英语六级词库",
    words: 2345,
    color: "is-link",
    categoryId: 2,
  },
  {
    id: 16,
    title: "牛津上海版高一上",
    subtitle: "牛津上海版高中英语教材词汇",
    words: 163,
    color: "is-link",
    categoryId: 3,
  },
  {
    id: 17,
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


// Mock API function
const fetchDictionaries = async ({ pageParam = 0, categoryId = 'all' }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pageSize = 12;
  const startIndex = pageParam * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Filter by category
  const filteredData = dictionaries;
  
  const pageData = filteredData.slice(startIndex, endIndex);
  const hasNextPage = endIndex < filteredData.length;
  
  return {
    data: pageData,
    nextPage: hasNextPage ? pageParam + 1 : undefined,
    total: filteredData.length,
  };
};

// Mock API functions for future backend integration
const api = {
  // 获取词典列表
  getDictionaries: async (params: { 
    page: number; 
    pageSize: number; 
    categoryId?: string;
    search?: string;
  }) => {
    // TODO: Replace with actual API call
    // return fetch('/api/dictionaries', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(params)
    // }).then(res => res.json());
    
    return fetchDictionaries({ 
      pageParam: params.page, 
      categoryId: params.categoryId || 'all' 
    });
  },

  // 创建词典
  createDictionary: async (data: {
    title: string;
    subtitle: string;
    categoryId: number;
    words?: string[];
  }) => {
    // TODO: Replace with actual API call
    // return fetch('/api/dictionaries', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(res => res.json());
    
    // Mock response
    const newDictionary = {
      id: Date.now(),
      title: data.title,
      subtitle: data.subtitle,
      categoryId: data.categoryId,
      words: data.words?.length || 0,
      color: 'is-link',
    };
    
    // Add to local data for now
    dictionaries.push(newDictionary);
    
    return { success: true, data: newDictionary };
  },

  // 更新词典
  updateDictionary: async (id: number, data: {
    title?: string;
    subtitle?: string;
    categoryId?: number;
    words?: string[];
  }) => {
    // TODO: Replace with actual API call
    // return fetch(`/api/dictionaries/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(res => res.json());
    
    // Mock response
    const index = dictionaries.findIndex(dict => dict.id === id);
    if (index !== -1) {
      const updatedDict = { ...dictionaries[index] };
      if (data.title) updatedDict.title = data.title;
      if (data.subtitle) updatedDict.subtitle = data.subtitle;
      if (data.categoryId) updatedDict.categoryId = data.categoryId;
      if (data.words) updatedDict.words = data.words.length;
      
      dictionaries[index] = updatedDict;
    }
    
    return { success: true, data: dictionaries[index] };
  },

  // 删除词典
  deleteDictionary: async (id: number) => {
    // TODO: Replace with actual API call
    // return fetch(`/api/dictionaries/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json());
    
    // Mock response
    const index = dictionaries.findIndex(dict => dict.id === id);
    if (index !== -1) {
      dictionaries.splice(index, 1);
    }
    
    return { success: true };
  },

  // 获取分类列表
  getCategories: async () => {
    // TODO: Replace with actual API call
    // return fetch('/api/categories').then(res => res.json());
    
    return { data: initialCategories };
  },

  // 创建分类
  createCategory: async (data: { name: string; description: string }) => {
    // TODO: Replace with actual API call
    // return fetch('/api/categories', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(res => res.json());
    
    const newCategory = {
      id: Math.max(...initialCategories.map(c => c.id)) + 1,
      ...data
    };
    
    initialCategories.push(newCategory);
    
    return { success: true, data: newCategory };
  }
};

const DictionaryPage = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
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

  // TanStack Query for infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['dictionaries', selectedCategory],
    queryFn: ({ pageParam }) => api.getDictionaries({ 
      page: pageParam, 
      pageSize: 12, 
      categoryId: selectedCategory 
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver>(null);
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages data
  const allDictionaries = data?.pages.flatMap(page => page.data) || [];

  const handleClick = () => {
    setIsCreateMode(true);
    setSelectedDictionary({
      id: Date.now(), // Temporary ID for new dictionary
      title: '',
      subtitle: '',
      words: 0,
      color: 'is-link',
      categoryId: parseInt(selectedCategory) || 1,
    });
    setWordList([]);
    setOpen(true);
  };

  const handleAddCategory = async () => {
    if (newCategoryData.name.trim()) {
      try {
        await api.createCategory({
          name: newCategoryData.name.trim(),
          description: newCategoryData.description.trim(),
        });
        setCategoriesList([...categoriesList, {
          id: Math.max(...categoriesList.map(c => c.id)) + 1,
          name: newCategoryData.name.trim(),
          description: newCategoryData.description.trim(),
        }]);
        setNewCategoryData({ name: '', description: '' });
        setCategoryModalOpen(false);
      } catch (error) {
        console.error('Failed to create category:', error);
      }
    }
  };

  const handleEditDictionary = (dict: typeof dictionaries[0]) => {
    setIsCreateMode(false);
    setSelectedDictionary(dict);
    setWordList([]); // 这里可以加载实际的单词列表
    setOpen(true);
  };

  const handleSaveDictionary = async () => {
    if (isCreateMode && selectedDictionary) {
      // 创建新词库
      try {
        await api.createDictionary({
          title: selectedDictionary.title,
          subtitle: selectedDictionary.subtitle,
          categoryId: selectedDictionary.categoryId,
          words: wordList,
        });
        refetch();
      } catch (error) {
        console.error('Failed to create dictionary:', error);
      }
    } else if (selectedDictionary) {
      // 更新现有词库
      try {
        await api.updateDictionary(selectedDictionary.id, {
          title: selectedDictionary.title,
          subtitle: selectedDictionary.subtitle,
          categoryId: selectedDictionary.categoryId,
          words: wordList,
        });
        refetch();
      } catch (error) {
        console.error('Failed to update dictionary:', error);
      }
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

  return (
    <Main>
      <div style={{
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Fixed Header */}
        <div style={{ flexShrink: 0 }}>
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
            </ButtonGroup>
          </Header>

          {/* Fixed Search and Filter */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginTop: 16,
            padding: '0 24px',
            flexShrink: 0
          }}>
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

          <Divider sx={{ margin: "16px 24px" }} />
        </div>

        {/* Scrollable Grid Area */}
        <div style={{
          flex: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
        }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}>
              <Typography color="danger">加载失败，请重试</Typography>
            </div>
          ) : (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 2, md: 3 }}
              sx={{ flexGrow: 1 }}
            >
              {allDictionaries.map((dict, idx) => {
                const isLastElement = idx === allDictionaries.length - 1;
                return (
                  <Grid xs={1} key={idx} ref={isLastElement ? lastElementRef : null}>
                    <DictionaryCard
                      title={dict.title}
                      subtitle={dict.subtitle}
                      words={dict.words}
                      onEdit={() => handleEditDictionary(dict)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <CircularProgress size="sm" />
            </div>
          )}
        </div>

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
