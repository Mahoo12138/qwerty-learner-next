import { useRef, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';

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
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Switch from '@mui/joy/Switch';

import { ChevronDown, Ellipsis, Plus, Trash2, Edit2, ChevronRight } from 'lucide-react';

import { Main } from "@/components/layouts/Main";
import Header from "@/components/SettingHeader";
import ListItemButton from '@mui/joy/ListItemButton';
import {
  fetchDictionaries,
  createDictionary,
  updateDictionary,
  deleteDictionary,
  DictionaryResDto,
  CreateDictionaryDto,
  UpdateDictionaryDto,
  fetchWordsByDictionary,
  WordResDto,
} from '@/api/dictionary';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryResDto,
  CreateCategoryDto,
  UpdateCategoryDto
} from '@/api/category';
import {
  createWord,
  deleteWord,
} from '@/api/word';

// 类型扩展
interface DictionaryForm extends DictionaryResDto {
  tags?: string[];
}

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

const DictionaryPage = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryForm | null>(null);
  const [wordList, setWordList] = useState<WordResDto[]>([]);
  const [wordModalOpen, setWordModalOpen] = useState(false);
  const [newWordData, setNewWordData] = useState<WordResDto>({ word: '', definition: '', pronunciation: '', examples: [] });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', description: '' });
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResDto | null>(null);

  // 分类列表
  const { data: categoriesData, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    select: (res) => res as CategoryResDto[],
  });
  const categoriesList = categoriesData || [];

  // 词典分页列表
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
    queryFn: ({ pageParam = 1 }) => fetchDictionaries({
      page: pageParam,
      limit: 12,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined
    }),
    getNextPageParam: (lastPage) => lastPage.pagination?.nextPage,
    initialPageParam: 1,
  });
  const allDictionaries: DictionaryResDto[] = data?.pages.flatMap(page => page.data) || [];

  // 新建/编辑/删除词典
  const createDictionaryMutation = useMutation({
    mutationFn: (data: CreateDictionaryDto) => createDictionary(data),
    onSuccess: () => { refetch(); },
  });
  const updateDictionaryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateDictionaryDto }) => updateDictionary(id, data),
    onSuccess: () => { refetch(); },
  });
  const deleteDictionaryMutation = useMutation({
    mutationFn: (id: string) => deleteDictionary(id),
    onSuccess: () => { refetch(); },
  });

  // 新建/编辑/删除分类
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => createCategory(data),
    onSuccess: () => { refetchCategories(); },
  });
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateCategoryDto }) => updateCategory(id, data),
    onSuccess: () => { refetchCategories(); },
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => { refetchCategories(); },
  });

  // 新增/删除单词 mutation
  const createWordMutation = useMutation({
    mutationFn: createWord,
    onSuccess: () => { refetchWordList(); },
  });
  const deleteWordMutation = useMutation({
    mutationFn: deleteWord,
    onSuccess: () => { refetchWordList(); },
  });

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClick = () => {
    setIsCreateMode(true);
    setSelectedDictionary({
      id: '',
      name: '',
      description: '',
      wordCount: 0,
      isPublic: false,
      isActive: true,
      categoryId: selectedCategory !== 'all' ? selectedCategory : '',
      words: [],
      metadata: {},
      createdAt: '',
      updatedAt: '',
    });
    setWordList([]);
    setOpen(true);
  };

  const handleEditDictionary = (dict: DictionaryResDto) => {
    setIsCreateMode(false);
    setSelectedDictionary(dict);
    setWordList(dict.words || []);
    setOpen(true);
  };

  const handleSaveDictionary = async () => {
    if (!selectedDictionary) return;
    if (isCreateMode) {
      await createDictionaryMutation.mutateAsync({
        name: selectedDictionary.name,
        description: selectedDictionary.description,
        isPublic: selectedDictionary.isPublic,
        isActive: selectedDictionary.isActive,
        categoryId: selectedDictionary.categoryId,
        metadata: selectedDictionary.metadata,
      });
    } else {
      await updateDictionaryMutation.mutateAsync({
        id: selectedDictionary.id,
        data: {
          name: selectedDictionary.name,
          description: selectedDictionary.description,
          isPublic: selectedDictionary.isPublic,
          isActive: selectedDictionary.isActive,
          categoryId: selectedDictionary.categoryId,
          metadata: selectedDictionary.metadata,
        },
      });
    }
    setOpen(false);
    setSelectedDictionary(null);
    setIsCreateMode(false);
  };

  const handleAddCategory = async () => {
    if (editingCategory) {
      // 编辑模式
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        data: {
          name: editingCategory.name.trim(),
          description: editingCategory.description?.trim() || '',
        },
      });
      setEditingCategory(null);
    } else if (newCategoryData.name.trim()) {
      // 新建模式
      await createCategoryMutation.mutateAsync({
        name: newCategoryData.name.trim(),
        description: newCategoryData.description.trim(),
      });
      setNewCategoryData({ name: '', description: '' });
    }
    setCategoryModalOpen(false);
  };

  const handleAddWord = async () => {
    if (!newWordData.word.trim() || !selectedDictionary?.id) return;
    await createWordMutation.mutateAsync({
      ...newWordData,
      dictionaryId: selectedDictionary.id,
    });
    setNewWordData({ word: '', definition: '', pronunciation: '', examples: [] });
    setWordModalOpen(false);
  };

  const handleDeleteWord = async (word: WordResDto) => {
    if (!word.id) return;
    await deleteWordMutation.mutateAsync(word.id);
  };

  const PAGE_SIZE = 100;

  const {
    data: wordData,
    fetchNextPage: fetchWordNextPage,
    hasNextPage: hasWordNextPage,
    isFetchingNextPage: isWordFetchingNextPage,
    refetch: refetchWordList,
  } = useInfiniteQuery({
    queryKey: ['words', selectedDictionary?.id],
    queryFn: ({ pageParam = 1 }) =>
      selectedDictionary?.id ? fetchWordsByDictionary(selectedDictionary.id, { page: pageParam, limit: PAGE_SIZE }) : Promise.resolve({ data: [], pagination: {} }),
    getNextPageParam: (lastPage) => (lastPage as any).pagination?.nextPage,
    initialPageParam: 1,
    enabled: !!selectedDictionary?.id,
  });

  const allWords = (wordData?.pages.flatMap(page => (page as any).data) || []) as any[];

  // 计算实际展示的单词列表
  const displayedWords = isCreateMode
    ? wordList
    : [...allWords, ...wordList];

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: displayedWords.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].slice(-1);
    if (lastItem && lastItem.index >= allWords.length - 1 && hasWordNextPage && !isWordFetchingNextPage) {
      fetchWordNextPage();
    }
  }, [rowVirtualizer.getVirtualItems(), hasWordNextPage, isWordFetchingNextPage, fetchWordNextPage, allWords.length]);

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
                onClick={() => setCategoryDrawerOpen(true)}
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
                      title={dict.name}
                      subtitle={dict.description}
                      words={dict.wordCount}
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
                value={selectedDictionary?.name}
                onChange={(e) => setSelectedDictionary(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>词库介绍</FormLabel>
              <Textarea
                minRows={2}
                value={selectedDictionary?.description}
                onChange={(e) => setSelectedDictionary(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>分类</FormLabel>
              <Select
                value={selectedDictionary?.categoryId || ''}
                onChange={(_, value) => setSelectedDictionary(prev => prev ? { ...prev, categoryId: value || '' } : null)}
              >
                {categoriesList.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>标签（逗号分隔）</FormLabel>
              <Input
                value={selectedDictionary?.tags?.join(',') || ''}
                onChange={e => setSelectedDictionary(prev => prev ? { ...prev, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } : null)}
                placeholder="如：英语,四级,高频"
              />
            </FormControl>

            <FormControl orientation="horizontal">
              <FormLabel>是否公开</FormLabel>
              <Switch
                checked={!!selectedDictionary?.isPublic}
                onChange={e => setSelectedDictionary(prev => prev ? { ...prev, isPublic: e.target.checked } : null)}
              />
            </FormControl>

            <FormControl orientation="horizontal">
              <FormLabel>是否启用</FormLabel>
              <Switch
                checked={!!selectedDictionary?.isActive}
                onChange={e => setSelectedDictionary(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
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

            <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
              <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map(virtualRow => {
                  const wordObj = displayedWords[virtualRow.index];
                  return (
                    <div
                      key={wordObj.id || wordObj.word}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {wordObj.word}
                      {wordObj.id && (
                        <IconButton
                          variant="plain"
                          color="neutral"
                          onClick={() => handleDeleteWord(wordObj)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </div>
                  );
                })}
              </div>
              {isWordFetchingNextPage && <div>加载中...</div>}
            </div>

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
                  value={newWordData.definition}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, definition: e.target.value }))}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>例句</FormLabel>
                <Textarea
                  minRows={2}
                  value={newWordData.examples?.join('\n') || ''}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, examples: e.target.value.split('\n').filter(Boolean) }))}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>备注</FormLabel>
                <Textarea
                  minRows={2}
                  value={newWordData.metadata?.remark}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, metadata: { ...prev.metadata || {}, remark: e.target.value } }))}
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

        {/* 分类管理 Drawer */}
        <Drawer
          size="md"
          variant="plain"
          open={categoryDrawerOpen}
          onClose={() => setCategoryDrawerOpen(false)}
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
              分类管理
            </Typography>
            <List>
              {[...categoriesList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((cat) => (
                <ListItem
                  key={cat.id}
                  onClick={() => {
                    setEditingCategory(cat);
                    setCategoryModalOpen(true);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemButton>
                    <ListItemDecorator>
                      <span role="img" aria-label="category">📁</span>
                    </ListItemDecorator>
                    <ListItemContent>
                      <Typography level="title-md">{cat.name}</Typography>
                      <Typography level="body-sm" color="neutral">{cat.description}</Typography>
                    </ListItemContent>
                    <ChevronRight />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <div style={{ marginTop: 'auto', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryModalOpen(true);
                }}
                startDecorator={<Plus size={16} />}
              >
                添加
              </Button>
            </div>
          </Sheet>
        </Drawer>

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
                  value={editingCategory ? editingCategory.name : newCategoryData.name}
                  onChange={e => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, name: e.target.value });
                    } else {
                      setNewCategoryData(prev => ({ ...prev, name: e.target.value }));
                    }
                  }}
                  required
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <FormLabel>分类描述</FormLabel>
                <Textarea
                  minRows={2}
                  value={editingCategory ? editingCategory.description : newCategoryData.description}
                  onChange={e => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, description: e.target.value });
                    } else {
                      setNewCategoryData(prev => ({ ...prev, description: e.target.value }));
                    }
                  }}
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
                <Button
                  type="submit"
                >
                  {editingCategory ? '保存' : '添加'}
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
