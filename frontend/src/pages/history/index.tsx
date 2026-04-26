import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  ListChecks,
  Play,
  Trash2,
} from "lucide-react";
import { useDiscardSession, useSessions } from "@/api/practice";
import { Button } from "@/components/core/Button";
import { clearPracticeSessionProgress } from "@/lib/practiceSessionProgress";
import * as css from "./index.css";

export function HistoryPage() {
  const [page, setPage] = useState(1);
  const [discardingSessionId, setDiscardingSessionId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState("");
  const pageSize = 10;
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname !== "/history") {
    return <Outlet />;
  }

  const { data, isLoading } = useSessions(page, pageSize);
  const discardSession = useDiscardSession();
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openSessionDetail = useCallback(
    (sessionId: string) => {
      void navigate({ to: "/history/$sessionId", params: { sessionId } });
    },
    [navigate],
  );

  const resumeSession = useCallback(
    (sessionId: string) => {
      void navigate({ to: "/practice", search: { sessionId } });
    },
    [navigate],
  );

  const discardPendingSession = useCallback(
    (sessionId: string) => {
      if (!window.confirm("确定要舍弃这条未完成练习吗？舍弃后无法继续恢复。")) {
        return;
      }

      setActionError("");
      setDiscardingSessionId(sessionId);
      discardSession.mutate(sessionId, {
        onSuccess: () => {
          clearPracticeSessionProgress(sessionId);
          setDiscardingSessionId(null);
        },
        onError: (err) => {
          setDiscardingSessionId(null);
          setActionError(
            err instanceof Error ? err.message : "舍弃练习失败，请重试",
          );
        },
      });
    },
    [discardSession],
  );

  return (
    <div className={css.page}>
      <div className={css.pageHeader}>
        <div>
          <h1 className={css.title}>练习记录</h1>
          <p className={css.subtitle}>回顾你的速度与稳定性</p>
        </div>
        <Button
          onClick={() =>
            navigate({ to: "/practice", search: { sessionId: undefined } })
          }
        >
          新练习
        </Button>
      </div>

      <div className={css.statsBar}>
        <ListChecks className={css.iconSm} />
        <span>
          共 <span className={css.statCount}>{total}</span> 条记录
        </span>
      </div>

      {actionError && <p className={css.actionError}>{actionError}</p>}

      {isLoading && <div className={css.loadingState}>加载中...</div>}

      {!isLoading && (data?.list.length ?? 0) === 0 && (
        <div className={css.emptyState}>
          <p className={css.emptyTitle}>还没有练习记录</p>
          <p className={css.emptyDesc}>先去完成第一轮训练。</p>
        </div>
      )}

      <div className={css.list} role="list">
        {data?.list.map((item, i) => {
          const isComplete = Boolean(item.result || item.ended_at);
          return (
            <div
              key={item.id}
              className={`${css.entry} ${isComplete ? css.entryComplete : css.entryPending}`}
              role="listitem"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <div className={css.entryInfo}>
                <div className={css.entryTags}>
                  <span className={css.tag}>{formatModeLabel(item.mode)}</span>
                  <span className={css.tag}>
                    {formatSourceLabel(item.source_type)}
                  </span>
                  <span className={css.tagCount}>{item.item_count} 项</span>
                </div>
                <p className={css.entryDate}>
                  {new Date(item.created_at).toLocaleString("zh-CN")}
                </p>
              </div>

              <div className={css.entryMetrics}>
                <div className={css.metricWpm}>
                  <span className={css.metricWpmValue}>
                    {item.result ? item.result.wpm.toFixed(1) : "—"}
                  </span>
                  <span className={css.metricWpmLabel}>WPM</span>
                </div>
                <div className={css.metricItem}>
                  <span className={css.metricValue}>
                    {item.result
                      ? `${(item.result.accuracy * 100).toFixed(1)}%`
                      : "—"}
                  </span>
                  <span className={css.metricLabel}>准确率</span>
                </div>
                <div className={css.metricItem}>
                  <span className={css.metricDuration}>
                    <Clock3 className={css.iconXs} />
                    {item.duration_ms
                      ? `${Math.floor(item.duration_ms / 1000)}s`
                      : "—"}
                  </span>
                  <span className={css.metricLabel}>用时</span>
                </div>
              </div>

              <div className={css.entryActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openSessionDetail(item.id)}
                >
                  <Eye className={css.iconSm} />
                  查看
                </Button>
                {!isComplete && (
                  <>
                    <Button size="sm" onClick={() => resumeSession(item.id)}>
                      <Play className={css.iconSm} />
                      继续
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => discardPendingSession(item.id)}
                      disabled={discardingSessionId === item.id}
                    >
                      <Trash2 className={css.iconSm} />
                      {discardingSessionId === item.id ? "舍弃中..." : "舍弃"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(data?.list.length ?? 0) > 0 && (
        <div className={css.pager}>
          <span className={css.pagerText}>
            第 {page} / {totalPages} 页
          </span>
          <div className={css.pagerButtons}>
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className={css.iconXs} />
              上一页
            </Button>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              variant="outline"
              size="sm"
            >
              下一页
              <ChevronRight className={css.iconXs} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatModeLabel(mode: string) {
  switch (mode) {
    case "dictation":
      return "默写";
    case "recitation":
      return "背词";
    default:
      return "打字";
  }
}

function formatSourceLabel(sourceType: string) {
  return sourceType === "sentence_bank" ? "句库" : "词库";
}
