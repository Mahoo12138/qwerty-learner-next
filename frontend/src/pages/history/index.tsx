import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ListChecks,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useDiscardSession, useSessions } from "@/api/practice";
import { Badge } from "@/components/core/Badge";
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
  const sessions = data?.list ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const completedCount = useMemo(
    () => sessions.filter((item) => Boolean(item.result || item.ended_at)).length,
    [sessions],
  );
  const pendingCount = sessions.length - completedCount;
  const averageWpm = useMemo(() => {
    const scoredRuns = sessions.flatMap((item) =>
      item.result ? [item.result.wpm] : [],
    );

    if (scoredRuns.length === 0) {
      return "—";
    }

    return (
      scoredRuns.reduce((sum, value) => sum + value, 0) / scoredRuns.length
    ).toFixed(1);
  }, [sessions]);
  const coachCopy =
    total === 0
      ? "第一轮训练完成后，历史记录会从这里开始累积，后面就能直接横向看速度、稳定度和可恢复状态。"
      : pendingCount > 0
        ? `当前页还有 ${pendingCount} 条训练可以继续，先把未收官的记录接回来，通常比重开更能保住节奏。`
        : "当前页的训练都已经归档，适合直接按成绩和稳定度回看最近一段时间的训练轨迹。";

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
      <header className={css.pageHeader}>
        <div className={css.heroTexture} aria-hidden />
        <div className={css.heroBackdrop} aria-hidden>ARCHIVE</div>

        <div className={css.heroLayout}>
          <div className={css.heroCopy}>
            <div className={css.ribbonRow}>
              <Badge variant="secondary">History Board</Badge>
              <Badge variant="outline">第 {page} / {totalPages} 页</Badge>
              <Badge variant="outline">{total} 条累计记录</Badge>
            </div>

            <p className={css.heroEyebrow}>Training Archive</p>
            <h1 className={css.title}>
              <span>练习记录</span>
              <span className={css.titleAccent}>历史看板</span>
            </h1>
            <p className={css.subtitle}>
              把每一轮训练的速度、准确率、时长和恢复状态压成一块可翻页的训练档案。
            </p>

            <div className={css.coachNote}>
              <span className={css.coachLabel}>Coach Note</span>
              <span className={css.coachValue}>{coachCopy}</span>
            </div>

            <div className={css.heroActions}>
              <Button
                variant="outline"
                onClick={() =>
                  navigate({ to: "/practice", search: { sessionId: undefined } })
                }
              >
                <RotateCcw className={css.iconSm} />
                新练习
              </Button>
            </div>
          </div>

          <div className={css.heroBoard}>
            <div className={css.primaryScore}>
              <div>
                <p className={css.scoreLabel}>累计记录</p>
                <div className={css.scoreValueRow}>
                  <span className={css.scoreValue}>{total}</span>
                  <span className={css.scoreSuffix}>RUNS</span>
                </div>
              </div>
              <p className={css.scoreCaption}>
                {total > 0
                  ? `当前页展示 ${sessions.length} 条训练档案，可直接继续未完成的记录，或进入详情复盘。`
                  : "历史档案还没开始积累，完成第一轮训练后这里会接住你的成绩。"}
              </p>
              <div className={css.scoreLane} aria-hidden />
            </div>

            <div className={css.miniGrid}>
              <ArchiveMiniStat
                label="已完成"
                value={String(completedCount)}
                caption="当前页已归档成绩"
                tone="success"
              />
              <ArchiveMiniStat
                label="待继续"
                value={String(Math.max(0, pendingCount))}
                caption="仍可恢复的训练"
                tone="warning"
              />
              <ArchiveMiniStat
                label="平均 WPM"
                value={averageWpm}
                caption="当前页有效成绩"
                tone="neutral"
              />
            </div>
          </div>
        </div>
      </header>

      <section className={css.sectionPanel}>
        <div className={css.sectionHeader}>
          <div className={css.sectionTitleBlock}>
            <p className={css.sectionEyebrow}>Run Archive</p>
            <h2 className={css.sectionTitle}>历史列表</h2>
            <p className={css.sectionSubtitle}>
              每一条记录都保留查看、继续和舍弃操作，便于把训练过程完整收进同一块档案板里。
            </p>
          </div>

          <div className={css.sectionMeta}>
            <Badge variant="outline">
              <ListChecks className={css.iconXs} />
              当前页 {sessions.length} 条
            </Badge>
            <Badge variant="outline">总计 {total} 条</Badge>
          </div>
        </div>

        {actionError && <p className={css.actionError}>{actionError}</p>}

        {isLoading && (
          <div className={css.feedbackCard}>
            <p className={css.loadingState}>加载历史记录中...</p>
          </div>
        )}

        {!isLoading && sessions.length === 0 && (
          <div className={css.emptyState}>
            <p className={css.emptyTitle}>还没有练习记录</p>
            <p className={css.emptyDesc}>先去完成第一轮训练，历史档案板才会开始积累。</p>
          </div>
        )}

        {!isLoading && sessions.length > 0 && (
          <>
            <div className={css.list} role="list">
              {sessions.map((item, i) => {
          const isComplete = Boolean(item.result || item.ended_at);
          return (
            <div
              key={item.id}
              className={`${css.entry} ${isComplete ? css.entryComplete : css.entryPending}`}
              role="listitem"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <div className={css.entryTop}>
                <div className={css.entryInfo}>
                  <div className={css.entryTags}>
                    <Badge variant="secondary">{formatModeLabel(item.mode)}</Badge>
                    <Badge variant="outline">{formatSourceLabel(item.source_type)}</Badge>
                    <Badge variant={isComplete ? "success" : "warning"}>
                      {isComplete ? "已完成" : "待继续"}
                    </Badge>
                    <Badge variant="outline">{item.item_count} 项</Badge>
                  </div>
                  <p className={css.entryTitle}>
                    {formatHistoryTitle(item.mode, item.source_type, item.item_count)}
                  </p>
                  <p className={css.entryDate}>
                    {new Date(item.created_at).toLocaleString("zh-CN")}
                  </p>
                </div>

                <div className={css.entryScore}>
                  <span className={css.entryScoreValue}>
                    {item.result ? item.result.wpm.toFixed(1) : "—"}
                  </span>
                  <span className={css.entryScoreLabel}>WPM</span>
                </div>
              </div>

              <div className={css.entryMetrics}>
                <HistoryMetric
                  label="准确率"
                  value={item.result ? `${(item.result.accuracy * 100).toFixed(1)}%` : "待提交"}
                />
                <HistoryMetric
                  label="用时"
                  value={formatDuration(item.duration_ms)}
                />
                <HistoryMetric
                  label="状态"
                  value={isComplete ? "已归档" : "可恢复"}
                />
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
          </>
        )}
      </section>
    </div>
  );
}

function ArchiveMiniStat({
  label,
  value,
  caption,
  tone,
}: {
  label: string;
  value: string;
  caption: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <div className={`${css.miniStat} ${css.miniStatTone[tone]}`}>
      <span className={css.miniLabel}>{label}</span>
      <span className={css.miniValue}>{value}</span>
      <span className={css.miniCaption}>{caption}</span>
    </div>
  );
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className={css.metricTile}>
      <span className={css.metricTileLabel}>{label}</span>
      <span className={css.metricTileValue}>{value}</span>
    </div>
  );
}

function formatDuration(durationMs: number | null | undefined) {
  if (!durationMs) {
    return "—";
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatHistoryTitle(mode: string, sourceType: string, itemCount: number) {
  return `${formatModeLabel(mode)} · ${formatSourceLabel(sourceType)} · ${itemCount}项`;
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
