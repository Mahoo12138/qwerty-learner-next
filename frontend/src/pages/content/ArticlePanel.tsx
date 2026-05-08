import { useEffect, useMemo, useState, type ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/core/Dialog";
import { FileText, Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import {
  useArticleBanks,
  useArticleDetail,
  useArticleSentences,
  useArticles,
  useCreateArticle,
  useCreateArticleBank,
  useDeleteArticle,
  useDeleteArticleBank,
  useResetProgress,
  useUpdateArticle,
  useUpdateArticleBank,
  useUpdateArticleSentence,
} from "@/api/articleBanks";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/Select";
import { Switch } from "@/components/core/Switch";
import { useAuthStore } from "@/stores/authStore";
import * as css from "@/styles/pages/contentWorkspace.css";
import type {
  Article,
  ArticleSentence,
} from "@/types/api";

import { ContentDataTable } from "./ContentDataTable";
import {
  EmptyDetail,
  SectionCard,
} from "./ContentShell";
import {
  canManageLibrary,
  countLabel,
  LIBRARY_LANGUAGE_OPTIONS,
  libraryLanguageLabel,
  normalizeLibraryLanguage,
  visibilityLabel,
} from "./contentModel";

const difficultyOptions = [1, 2, 3, 4, 5];

const articleShowcaseTitle = "我的文章库";
const articleShowcaseDescription = "这里只保留你自己创建和维护的文章库。系统文章库、公开文章库和已订阅文章库将迁移到新的“发现内容”页统一处理。";

interface OwnedLibraryCard {
  id: string;
  title: string;
  caption: string;
  countText: string;
  createdText: string;
  badges: Array<{
    label: string;
    variant: "default" | "secondary" | "outline" | "warning" | "success" | "destructive";
  }>;
}

function formatLibraryDate(value?: string) {
  if (!value) {
    return "时间待补齐";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "时间待补齐";
  }

  return date.toLocaleDateString("zh-CN").replace(/\//g, "-");
}

function splitArticleTags(tags?: string) {
  if (!tags) {
    return [];
  }

  return tags
    .split(/[\s,，]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

interface ArticlePanelProps {
  createRequestKey?: number;
}

export function ArticlePanel({ createRequestKey = 0 }: ArticlePanelProps) {
  const user = useAuthStore((state) => state.user);
  const [selectedLibraryID, setSelectedLibraryID] = useState("");
  const [selectedArticleID, setSelectedArticleID] = useState("");

  const [createBankOpen, setCreateBankOpen] = useState(false);
  const [editBankOpen, setEditBankOpen] = useState(false);
  const [createArticleOpen, setCreateArticleOpen] = useState(false);
  const [editArticleOpen, setEditArticleOpen] = useState(false);

  const [bankName, setBankName] = useState("");
  const [bankDescription, setBankDescription] = useState("");
  const [bankLanguage, setBankLanguage] = useState("en");
  const [bankIsPublic, setBankIsPublic] = useState(true);

  const [editingBankName, setEditingBankName] = useState("");
  const [editingBankDescription, setEditingBankDescription] = useState("");
  const [editingBankLanguage, setEditingBankLanguage] = useState("en");
  const [editingBankIsPublic, setEditingBankIsPublic] = useState(true);

  const [createTitle, setCreateTitle] = useState("");
  const [createAuthor, setCreateAuthor] = useState("");
  const [createSourceURL, setCreateSourceURL] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createTags, setCreateTags] = useState("");
  const [createDifficulty, setCreateDifficulty] = useState("3");

  const [editingTitle, setEditingTitle] = useState("");
  const [editingAuthor, setEditingAuthor] = useState("");
  const [editingSourceURL, setEditingSourceURL] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const [editingDifficulty, setEditingDifficulty] = useState("3");

  const { data: ownedBanks = [] } = useArticleBanks("owned");

  const createBank = useCreateArticleBank();
  const updateBank = useUpdateArticleBank();
  const deleteBank = useDeleteArticleBank();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const updateSentence = useUpdateArticleSentence();
  const resetProgress = useResetProgress();

  const bankMap = useMemo(
    () => new Map(ownedBanks.map((bank) => [bank.id, bank])),
    [ownedBanks],
  );

  const listItems = useMemo<OwnedLibraryCard[]>(
    () =>
      ownedBanks.map((bank) => ({
        id: bank.id,
        title: bank.name,
        caption: bank.description || "继续补充文章、标签和练习说明。",
        countText: countLabel("article_bank", bank.article_count),
        createdText: formatLibraryDate(bank.created_at),
        badges: [
          {
            label: visibilityLabel(bank.is_public),
            variant: bank.is_public === 1 ? "success" : "outline",
          },
          { label: libraryLanguageLabel(bank.language), variant: "secondary" },
        ],
      })),
    [ownedBanks],
  );

  const selectionSignature = listItems.map((item) => item.id).join("|");

  useEffect(() => {
    if (listItems.some((item) => item.id === selectedLibraryID)) {
      return;
    }
    setSelectedLibraryID(listItems[0]?.id ?? "");
  }, [listItems, selectionSignature, selectedLibraryID]);

  const selectedBank = useMemo(
    () => bankMap.get(selectedLibraryID) ?? null,
    [bankMap, selectedLibraryID],
  );
  const canEdit = canManageLibrary(selectedBank, user);

  useEffect(() => {
    if (!selectedBank) {
      setEditingBankName("");
      setEditingBankDescription("");
      setEditingBankLanguage("en");
      setEditingBankIsPublic(true);
      return;
    }
    setEditingBankName(selectedBank.name);
    setEditingBankDescription(selectedBank.description || "");
    setEditingBankLanguage(normalizeLibraryLanguage(selectedBank.language));
    setEditingBankIsPublic(selectedBank.is_public === 1);
  }, [selectedBank]);

  const { data: articlesData } = useArticles(selectedBank?.id ?? "", 1, 100);
  const articles = articlesData?.list ?? [];

  useEffect(() => {
    if (articles.some((article) => article.id === selectedArticleID)) {
      return;
    }
    setSelectedArticleID(articles[0]?.id ?? "");
  }, [articles, selectedArticleID]);

  const { data: articleDetail } = useArticleDetail(selectedArticleID);
  const { data: articleSentences = [] } =
    useArticleSentences(selectedArticleID);

  useEffect(() => {
    if (createRequestKey < 1) {
      return;
    }

    setSelectedLibraryID("");
    setCreateBankOpen(true);
  }, [createRequestKey]);

  useEffect(() => {
    if (!articleDetail) {
      setEditingTitle("");
      setEditingAuthor("");
      setEditingSourceURL("");
      setEditingTags("");
      setEditingDifficulty("3");
      return;
    }
    setEditingTitle(articleDetail.title);
    setEditingAuthor(articleDetail.author || "");
    setEditingSourceURL(articleDetail.source_url || "");
    setEditingTags(articleDetail.tags || "");
    setEditingDifficulty(String(articleDetail.difficulty || 3));
  }, [articleDetail]);

  function handleSelectLibrary(id: string) {
    setSelectedLibraryID(id);
    setSelectedArticleID("");
  }

  function handleCreateBank() {
    if (!bankName.trim()) {
      return;
    }
    createBank.mutate(
      {
        name: bankName.trim(),
        description: bankDescription.trim(),
        language: bankLanguage.trim() || "en",
        is_public: bankIsPublic ? 1 : 0,
      },
      {
        onSuccess: (bank) => {
          setSelectedLibraryID(bank.id);
          setCreateBankOpen(false);
          setBankName("");
          setBankDescription("");
          setBankLanguage("en");
          setBankIsPublic(true);
        },
      },
    );
  }

  function handleSaveBank() {
    if (!selectedBank || !editingBankName.trim()) {
      return;
    }
    updateBank.mutate(
      {
        id: selectedBank.id,
        name: editingBankName.trim(),
        description: editingBankDescription.trim(),
        language: editingBankLanguage.trim() || "en",
        is_public: editingBankIsPublic ? 1 : 0,
      },
      {
        onSuccess: () => {
          setEditBankOpen(false);
        },
      },
    );
  }

  function handleDeleteBank() {
    if (!selectedBank) {
      return;
    }
    if (!window.confirm(`确定删除文章库「${selectedBank.name}」吗？`)) {
      return;
    }
    deleteBank.mutate(selectedBank.id, {
      onSuccess: () => {
        setEditBankOpen(false);
        setSelectedLibraryID("");
        setSelectedArticleID("");
      },
    });
  }

  function handleCreateArticle() {
    if (!selectedBank || !createTitle.trim() || !createContent.trim()) {
      return;
    }
    createArticle.mutate(
      {
        bankId: selectedBank.id,
        title: createTitle.trim(),
        author: createAuthor.trim(),
        source_url: createSourceURL.trim(),
        content: createContent.trim(),
        difficulty: Number(createDifficulty),
        tags: createTags.trim(),
      },
      {
        onSuccess: (article) => {
          setCreateTitle("");
          setCreateAuthor("");
          setCreateSourceURL("");
          setCreateContent("");
          setCreateTags("");
          setCreateDifficulty("3");
          setCreateArticleOpen(false);
          setSelectedArticleID(article.id);
        },
      },
    );
  }

  function handleSaveArticle() {
    if (!selectedArticleID || !editingTitle.trim()) {
      return;
    }
    updateArticle.mutate(
      {
        articleId: selectedArticleID,
        title: editingTitle.trim(),
        author: editingAuthor.trim(),
        source_url: editingSourceURL.trim(),
        tags: editingTags.trim(),
        difficulty: Number(editingDifficulty),
      },
      {
        onSuccess: () => {
          setEditArticleOpen(false);
        },
      },
    );
  }

  function handleDeleteArticle() {
    if (!articleDetail) {
      return;
    }
    if (!window.confirm(`确定删除文章「${articleDetail.title}」吗？`)) {
      return;
    }
    deleteArticle.mutate(articleDetail.id, {
      onSuccess: () => {
        setSelectedArticleID("");
        setEditArticleOpen(false);
      },
    });
  }

  const articleColumns = useMemo<ColumnDef<Article>[]>(
    () => [
      {
        header: "文章",
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.title}</span>
            <span className={css.tableSecondaryText}>{row.original.author || "未填写作者"}</span>
          </div>
        ),
      },
      {
        header: "难度 / 体量",
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>难度 {row.original.difficulty}</span>
            <span className={css.tableSecondaryText}>
              {row.original.paragraph_count} 段 · {row.original.total_char_count} 字符
            </span>
          </div>
        ),
      },
      {
        header: "标签",
        cell: ({ row }) => {
          const tags = splitArticleTags(row.original.tags);

          if (tags.length === 0) {
            return <span className={css.tableSecondaryText}>无</span>;
          }

          return (
            <div className={css.tableTagList}>
              {tags.slice(0, 3).map((tag) => (
                <Badge key={`${row.original.id}-${tag}`} variant="secondary" className={css.tableTagBadge}>
                  {tag}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        header: "操作",
        cell: ({ row }) => {
          const isSelected = row.original.id === selectedArticleID;

          return (
            <div className={css.tableActionIconGroup}>
              <Button
                type="button"
                size="icon"
                variant={isSelected ? "secondary" : "ghost"}
                className={css.tableActionIconButton}
                onClick={() => setSelectedArticleID(row.original.id)}
                aria-label={`查看文章 ${row.original.title}`}
              >
                <FileText size={15} />
              </Button>
              {canEdit ? (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={css.tableActionIconButton}
                  onClick={() => {
                    setSelectedArticleID(row.original.id);
                    setEditArticleOpen(true);
                  }}
                  aria-label={`编辑文章 ${row.original.title}`}
                >
                  <Pencil size={15} />
                </Button>
              ) : null}
            </div>
          );
        },
      },
    ],
    [canEdit, selectedArticleID],
  );

  let articleMeta: ReactNode = null;
  if (articleDetail) {
    articleMeta = (
      <div className={css.formGrid}>
        <p className={css.rowText}>{articleDetail.author || "未填写作者"}</p>
        <div className={css.metricsRow}>
          <Badge variant="outline">难度 {articleDetail.difficulty}</Badge>
          <Badge variant="secondary">{articleDetail.paragraph_count} 段</Badge>
          <Badge variant="secondary">{articleDetail.total_char_count} 字符</Badge>
          {articleDetail.tags ? <Badge variant="outline">{articleDetail.tags}</Badge> : null}
        </div>
        {articleDetail.source_url ? (
          <p className={css.helperText}>{articleDetail.source_url}</p>
        ) : null}
      </div>
    );
  }

  const selectedLibraryCreatedText = formatLibraryDate(selectedBank?.created_at);

  return (
    <>
      <div className={css.libraryWorkspaceStack}>
        <section className={css.libraryShowcase}>
          <header className={css.libraryShowcaseHeader}>
            <div className={css.libraryShowcaseIntro}>
              <p className={css.libraryShowcaseEyebrow}>文章库编排</p>
              <h2 className={css.libraryShowcaseTitle}>{articleShowcaseTitle}</h2>
              <p className={css.libraryShowcaseDescription}>{articleShowcaseDescription}</p>
            </div>
          </header>

          {listItems.length === 0 ? (
            <div className={css.libraryCatalogEmpty}>
              <div>
                <p className={css.libraryCatalogEmptyTitle}>还没有文章库</p>
                <p className={css.libraryCatalogEmptyText}>先建一个文章库，再录入文章、句子翻译和进度信息。</p>
              </div>
              <Button type="button" onClick={() => setCreateBankOpen(true)}>
                <Plus size={14} />
                新建文章库
              </Button>
            </div>
          ) : (
            <div className={css.libraryCatalogGrid}>
              {listItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    selectedLibraryID === item.id
                      ? css.libraryCatalogCardSelected
                      : css.libraryCatalogCard
                  }
                  onClick={() => handleSelectLibrary(item.id)}
                >
                  <div className={css.libraryCatalogCardTop}>
                    <div className={css.libraryCatalogCardIcon}>
                      <FileText size={18} />
                    </div>
                    <span className={css.libraryCatalogCardCount}>{item.countText}</span>
                  </div>

                  <div className={css.libraryCatalogCardBody}>
                    <h3 className={css.libraryCatalogCardTitle}>{item.title}</h3>
                    <p className={css.libraryCatalogCardCaption}>{item.caption}</p>
                  </div>

                  <div className={css.libraryCatalogCardBadges}>
                    {item.badges.map((badge) => (
                      <Badge key={`${item.id}-${badge.label}`} variant={badge.variant}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                  <p className={css.libraryCatalogCardDate}>创建于 {item.createdText}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={css.libraryDetailSurface}>
          {!selectedBank ? (
            <EmptyDetail
              title="先创建一个文章库"
              body="当前内容管理页只维护你自己的文章库。公开发现、系统文章库和已订阅文章库将转移到新的“发现内容”页。"
            />
          ) : (
            <>
              <div className={css.libraryDetailHeader}>
                <div className={css.libraryDetailHeading}>
                  <p className={css.libraryDetailEyebrow}>我的文章库</p>
                  <div className={css.libraryDetailTitleRow}>
                    <h2 className={css.libraryDetailTitle}>{selectedBank.name}</h2>
                    {canEdit ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={css.libraryTitleEditButton}
                        onClick={() => setEditBankOpen(true)}
                        aria-label={`编辑文章库 ${selectedBank.name}`}
                      >
                        <Pencil size={16} />
                      </Button>
                    ) : null}
                  </div>
                  <p className={css.libraryDetailMetaLine}>
                    {countLabel("article_bank", selectedBank.article_count)} · 创建于 {selectedLibraryCreatedText}
                  </p>
                  <p className={css.libraryDetailDescription}>
                    {selectedBank.description || "这套文章库还没有补充说明。"}
                  </p>
                </div>

                <div className={css.libraryDetailHeaderActions}>
                  <div className={css.libraryDetailBadges}>
                    <Badge variant="secondary">{libraryLanguageLabel(selectedBank.language)}</Badge>
                    <Badge
                      variant={selectedBank.is_public === 1 ? "success" : "outline"}
                    >
                      {visibilityLabel(selectedBank.is_public)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className={css.libraryTableToolbar}>
                <div className={css.libraryTableSummary}>
                  <span>共 {articles.length} 篇文章</span>
                  <span>先从这里切换当前文章，再继续维护翻译和进度</span>
                </div>
                {canEdit ? (
                  <Button
                    type="button"
                    size="lg"
                    className={css.libraryAddWordButton}
                    onClick={() => setCreateArticleOpen(true)}
                  >
                    <Plus size={14} />
                    新建文章
                  </Button>
                ) : null}
              </div>

              <div className={css.libraryTableCard}>
                {articles.length === 0 ? (
                  <EmptyDetail
                    title="文章库还是空的"
                    body={
                      canEdit
                        ? "先贴入一篇文章开始拆段和翻译。"
                        : "这个文章库暂时没有可展示的文章。"
                    }
                  />
                ) : (
                  <ContentDataTable ariaLabel="文章清单" data={articles} columns={articleColumns} />
                )}

                <div className={css.libraryTableFooter}>
                  <div className={css.libraryTableSummary}>
                    <span>当前文章: {articleDetail?.title || "未选择"}</span>
                    <span>查看按钮会切换下面的文章详情</span>
                  </div>
                </div>
              </div>

              {!articleDetail ? (
                <EmptyDetail
                  title="选择一篇文章"
                  body="库已经选好了，接下来从上面的文章列表里选一篇，继续维护标题、标签、来源和句子翻译。"
                />
              ) : (
                <>
                  <SectionCard
                    title="文章资料"
                    description="这里展示当前文章摘要。编辑入口收进弹窗里，正文切句和翻译仍在下方维护。"
                    actions={
                      canEdit ? (
                        <Button variant="outline" onClick={() => setEditArticleOpen(true)}>
                          编辑当前文章
                        </Button>
                      ) : null
                    }
                  >
                    {articleMeta}
                  </SectionCard>

                  <SectionCard
                    title="句子翻译"
                    description="逐句维护翻译，适合给练习视图和阅读视图共用。"
                  >
                    {articleSentences.length === 0 ? (
                      <EmptyDetail
                        title="还没有切分出的句子"
                        body="如果文章内容为空或者切句失败，这里不会展示句子。"
                      />
                    ) : (
                      <div className={css.articleSentenceList}>
                        {articleSentences.map((sentence) => (
                          <ArticleSentenceCard
                            key={sentence.id}
                            sentence={sentence}
                            canEdit={canEdit}
                            onSave={(payload) =>
                              updateSentence.mutate({
                                sentenceId: sentence.id,
                                ...payload,
                              })
                            }
                          />
                        ))}
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard
                    title="练习进度"
                    description="这里展示这篇文章的当前完成状态，必要时可以重置。"
                    actions={
                      articleDetail.progress && canEdit ? (
                        <Button
                          variant="outline"
                          onClick={() => resetProgress.mutate(articleDetail.id)}
                          disabled={resetProgress.isPending}
                        >
                          <RotateCcw size={14} />
                          重置进度
                        </Button>
                      ) : null
                    }
                  >
                    {articleDetail.progress ? (
                      <div className={css.progressList}>
                        <div className={css.progressRow}>
                          <div>
                            <p className={css.rowTitle}>{articleDetail.title}</p>
                            <p className={css.rowText}>
                              已完成 {articleDetail.progress.completed_paragraphs}{" "}
                              / {articleDetail.progress.total_paragraphs} 段
                            </p>
                          </div>
                          <div className={css.rowMeta}>
                            <Badge variant="secondary">
                              {articleDetail.progress.status}
                            </Badge>
                            {articleDetail.progress.last_practiced_at ? (
                              <Badge variant="outline">
                                最近练习{" "}
                                {articleDetail.progress.last_practiced_at}
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <EmptyDetail
                        title="还没有练习进度"
                        body="这篇文章还没有被练习过，所以暂时没有进度数据。"
                      />
                    )}
                  </SectionCard>
                </>
              )}
            </>
          )}
        </section>
      </div>

      <Dialog open={createBankOpen} onOpenChange={setCreateBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建文章库</DialogTitle>
            <DialogDescription>
              语言和公开状态决定它未来会怎样出现在“发现内容”页里。
            </DialogDescription>
          </DialogHeader>
          <div className={css.dialogStack}>
            <div className={css.formGridThree}>
              <Input
                value={bankName}
                onChange={(event) => setBankName(event.target.value)}
                placeholder="文章库名称"
              />
              <Select value={bankLanguage} onValueChange={setBankLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIBRARY_LANGUAGE_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={bankDescription}
                onChange={(event) => setBankDescription(event.target.value)}
                placeholder="文章库说明（可选）"
              />
            </div>
            <div className={css.switchRow}>
              <div className={css.switchText}>
                <p className={css.switchTitle}>公开到发现内容</p>
                <p className={css.switchDescription}>
                  打开后其他用户可以在未来的“发现内容”页里看到它。
                </p>
              </div>
              <Switch
                checked={bankIsPublic}
                onCheckedChange={setBankIsPublic}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleCreateBank} disabled={createBank.isPending}>
              <Plus size={14} />
              创建文章库
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editBankOpen} onOpenChange={setEditBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑文章库设置</DialogTitle>
            <DialogDescription>调整名称、语言、简介和公开状态，删除操作也集中在这里。</DialogDescription>
          </DialogHeader>
          <div className={css.dialogStack}>
            <div className={css.formGridThree}>
              <Input
                value={editingBankName}
                onChange={(event) => setEditingBankName(event.target.value)}
                placeholder="文章库名称"
              />
              <Select value={editingBankLanguage} onValueChange={setEditingBankLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIBRARY_LANGUAGE_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={editingBankDescription}
                onChange={(event) => setEditingBankDescription(event.target.value)}
                placeholder="文章库说明"
              />
            </div>
            <div className={css.switchRow}>
              <div className={css.switchText}>
                <p className={css.switchTitle}>公开文章库</p>
                <p className={css.switchDescription}>关闭后不会出现在后续的“发现内容”页里。</p>
              </div>
              <Switch checked={editingBankIsPublic} onCheckedChange={setEditingBankIsPublic} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteBank} disabled={deleteBank.isPending}>
              <Trash2 size={14} />
              删除
            </Button>
            <Button onClick={handleSaveBank} disabled={updateBank.isPending}>
              <Save size={14} />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createArticleOpen} onOpenChange={setCreateArticleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建文章</DialogTitle>
            <DialogDescription>文章录入放到弹窗里完成，列表区只保留轻量浏览和切换。</DialogDescription>
          </DialogHeader>
          <div className={css.dialogStack}>
            <div className={css.formGridThree}>
              <Input
                value={createTitle}
                onChange={(event) => setCreateTitle(event.target.value)}
                placeholder="文章标题 *"
              />
              <Input
                value={createAuthor}
                onChange={(event) => setCreateAuthor(event.target.value)}
                placeholder="作者"
              />
              <Input
                value={createSourceURL}
                onChange={(event) => setCreateSourceURL(event.target.value)}
                placeholder="来源链接"
              />
            </div>
            <textarea
              className={css.textarea}
              value={createContent}
              onChange={(event) => setCreateContent(event.target.value)}
              placeholder="粘贴文章内容。空行分段，后端会自动切句。"
            />
            <div className={css.formGridTwo}>
              <Input
                value={createTags}
                onChange={(event) => setCreateTags(event.target.value)}
                placeholder="标签，例如 CET6, 社科"
              />
              <Select value={createDifficulty} onValueChange={setCreateDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((item) => (
                    <SelectItem key={item} value={String(item)}>
                      难度 {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleCreateArticle} disabled={createArticle.isPending}>
              <Plus size={14} />
              新建文章
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editArticleOpen} onOpenChange={setEditArticleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑文章</DialogTitle>
            <DialogDescription>标题、作者、来源和难度都放到弹窗里调整，正文内容仍保持创建时的拆段切句结果。</DialogDescription>
          </DialogHeader>
          {articleDetail ? (
            <>
              <div className={css.dialogStack}>
                <div className={css.formGridThree}>
                  <Input
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    placeholder="文章标题"
                  />
                  <Input
                    value={editingAuthor}
                    onChange={(event) => setEditingAuthor(event.target.value)}
                    placeholder="作者"
                  />
                  <Input
                    value={editingSourceURL}
                    onChange={(event) => setEditingSourceURL(event.target.value)}
                    placeholder="来源链接"
                  />
                </div>
                <div className={css.formGridTwo}>
                  <Input
                    value={editingTags}
                    onChange={(event) => setEditingTags(event.target.value)}
                    placeholder="标签"
                  />
                  <Select value={editingDifficulty} onValueChange={setEditingDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((item) => (
                        <SelectItem key={item} value={String(item)}>
                          难度 {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">取消</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteArticle} disabled={deleteArticle.isPending}>
                  <Trash2 size={14} />
                  删除
                </Button>
                <Button onClick={handleSaveArticle} disabled={updateArticle.isPending}>
                  <Save size={14} />
                  保存
                </Button>
              </DialogFooter>
            </>
          ) : (
            <p className={css.helperText}>正在加载文章详情...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ArticleSentenceCard({
  sentence,
  canEdit,
  onSave,
}: {
  sentence: ArticleSentence;
  canEdit: boolean;
  onSave: (payload: {
    translation: string;
    translation_source: string;
  }) => void;
}) {
  const [translation, setTranslation] = useState(sentence.translation || "");
  const [translationSource, setTranslationSource] = useState(
    sentence.translation_source || "",
  );

  useEffect(() => {
    setTranslation(sentence.translation || "");
    setTranslationSource(sentence.translation_source || "");
  }, [sentence]);

  if (!canEdit) {
    return (
      <div className={css.articleSentenceCard}>
        <p className={css.rowTitle}>{sentence.content}</p>
        <p className={css.rowText}>{sentence.translation || "暂无翻译"}</p>
        {sentence.translation_source ? (
          <p className={css.helperText}>
            翻译来源: {sentence.translation_source}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={css.articleSentenceCard}>
      <p className={css.rowTitle}>{sentence.content}</p>
      <textarea
        className={css.compactTextarea}
        value={translation}
        onChange={(event) => setTranslation(event.target.value)}
        placeholder="翻译"
      />
      <div className={css.formGridTwo}>
        <Input
          value={translationSource}
          onChange={(event) => setTranslationSource(event.target.value)}
          placeholder="翻译来源"
        />
        <Button
          variant="outline"
          onClick={() =>
            onSave({
              translation: translation.trim(),
              translation_source: translationSource.trim(),
            })
          }
        >
          <Save size={14} />
          保存翻译
        </Button>
      </div>
    </div>
  );
}
