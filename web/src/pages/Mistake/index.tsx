import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Play, Trash2 } from 'lucide-react';
import styles from './index.module.scss';
import { Main } from '@/components/layouts/Main';

interface MistakeWord {
  word: string;
  meaning: string;
  errorCount: number;
  dictionary: string;
}

const MistakePage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [mistakes, setMistakes] = useState<MistakeWord[]>([]);

  const columnHelper = createColumnHelper<MistakeWord>();

  const columns = [
    columnHelper.accessor('word', {
      header: t('单词'),
      cell: info => <div className={styles.wordCell}>{info.getValue()}</div>,
    }),
    columnHelper.accessor('meaning', {
      header: t('释义'),
      cell: info => <div className={styles.meaningCell}>{info.getValue()}</div>,
    }),
    columnHelper.accessor('errorCount', {
      header: t('错误次数'),
      cell: info => (
        <div className={styles.errorCountCell}>
          <span className={styles.errorBadge}>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('dictionary', {
      header: t('词典'),
      cell: info => <div className={styles.dictionaryCell}>{info.getValue()}</div>,
    }),
    columnHelper.display({
      id: 'actions',
      header: t('操作'),
      cell: () => (
        <div className={styles.actionCell}>
          <button className={`button is-small is-text`} title={t('练习')}>
            <Play size={16} />
          </button>
          <button className={`button is-small is-text`} title={t('删除')}>
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ];

  // Mock data
  const mockMistakes: MistakeWord[] = [
    { word: 'apple', meaning: '苹果', errorCount: 3, dictionary: 'CET-4' },
    { word: 'banana', meaning: '香蕉', errorCount: 2, dictionary: 'CET-6' },
    { word: 'orange', meaning: '橙子', errorCount: 1, dictionary: 'TOEFL' },
    { word: 'apple', meaning: '苹果', errorCount: 3, dictionary: 'CET-4' },
    { word: 'banana', meaning: '香蕉', errorCount: 2, dictionary: 'CET-6' },
    { word: 'orange', meaning: '橙子', errorCount: 1, dictionary: 'TOEFL' },
    { word: 'apple', meaning: '苹果', errorCount: 3, dictionary: 'CET-4' },
    { word: 'banana', meaning: '香蕉', errorCount: 2, dictionary: 'CET-6' },
    { word: 'orange', meaning: '橙子', errorCount: 1, dictionary: 'TOEFL' },
    { word: 'humble', meaning: '谦逊的；地位低下的；简陋的 (adj.)；使谦恭； 使卑下 (vt.)', errorCount: 1, dictionary: 'TOEFL' },

  ];

  useEffect(() => {
    // Simulate API call
    const fetchMistakes = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMistakes(mockMistakes);
      setLoading(false);
    };

    fetchMistakes();
  }, []);

  const table = useReactTable({
    data: mistakes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Main>
      <div className={`container ${styles.mistakePage}`}>
        <div className={styles.header}>
          <h1 className="title is-2">{t('错题本')}</h1>
          <p className={styles.description}>
            {t('记录你在练习过程中拼写错误的单词，帮助你更有针对性地复习和练习。通过反复练习这些容易出错的单词，提高你的打字准确率。')}
          </p>
        </div>

        {loading ? (
          <div className="has-text-centered">
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className={styles.tableHeader}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className={styles.tableRow}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className={styles.tableCell}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.paginationContainer}>
              <div className={styles.paginationInfo}>
                {t('第')} {table.getState().pagination.pageIndex + 1} {t('页，共')} {table.getPageCount()} {t('页')}
              </div>
              <div className={styles.paginationControls}>
                <button
                  className={`button is-small ${styles.paginationButton}`}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {t('上一页')}
                </button>
                <button
                  className={`button is-small ${styles.paginationButton}`}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {t('下一页')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Main>
  );
};

export default MistakePage;
