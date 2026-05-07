import { useMemo, useState } from "react";
import { Plus, Target, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import {
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
} from "@/api/goals";
import type { UserGoal } from "@/types/api";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/core/Card";
import { Input } from "@/components/core/Input";
import { Progress } from "@/components/core/Progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/Select";
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/core/Dialog";
import * as css from "./index.css";

const GOAL_TYPE_LABELS: Record<string, string> = {
  duration: "练习时长",
  wpm: "平均 WPM",
  accuracy: "准确率",
  practice_count: "练习次数",
};

const GOAL_TYPE_UNITS: Record<string, string> = {
  duration: "分钟",
  wpm: "WPM",
  accuracy: "%",
  practice_count: "次",
};

export function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals();
  const [showForm, setShowForm] = useState(false);

  const summary = useMemo(() => {
    const active = goals.filter((goal) => goal.is_active === 1);
    const completed = active.filter((goal) => calcProgress(goal) >= 100);
    return {
      all: goals.length,
      active: active.length,
      completed: completed.length,
    };
  }, [goals]);

  return (
    <div className={css.pageRoot}>
      <section className={css.hero}>
        <div className={css.heroGlow} aria-hidden />
        <div className={css.heroTopRow}>
          <div>
            <p className={css.heroEyebrow}>Goal Studio</p>
            <h1 className={css.heroTitle}>每日目标</h1>
            <p className={css.heroSubtitle}>
              设定你的训练节奏，把每次练习转化为可见进步。
            </p>
          </div>
          <Button
            onClick={() => setShowForm((prev) => !prev)}
            className={css.addButton}
          >
            <Plus size={16} />
            添加目标
          </Button>
        </div>

        <div className={css.heroStats}>
          <div className={css.statCard}>
            <span className={css.statLabel}>目标总数</span>
            <span className={css.statValue}>{summary.all}</span>
          </div>
          <div className={css.statCard}>
            <span className={css.statLabel}>进行中</span>
            <span className={css.statValue}>{summary.active}</span>
          </div>
          <div className={css.statCard}>
            <span className={css.statLabel}>已完成</span>
            <span className={css.statValue}>{summary.completed}</span>
          </div>
        </div>
      </section>

      <CreateGoalFormModal open={showForm} onOpenChange={setShowForm} />

      {isLoading ? (
        <p className={css.loadingText}>目标加载中...</p>
      ) : goals.length === 0 ? (
        <EmptyState onCreate={() => setShowForm(true)} />
      ) : (
        <div className={css.goalGrid}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}

function CreateGoalFormModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createGoal = useCreateGoal();
  const [goalType, setGoalType] = useState("practice_count");
  const [targetValue, setTargetValue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(targetValue);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    createGoal.mutate(
      { goal_type: goalType, target_value: value, period: "daily" },
      {
        onSuccess: () => {
          setTargetValue("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建每日目标</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={css.formGrid}>
          <label className={css.fieldGroup}>
            <span className={css.fieldLabel}>目标类型</span>
            <Select value={goalType} onValueChange={setGoalType}>
              <SelectTrigger className={css.selectTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GOAL_TYPE_LABELS).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className={css.fieldGroup}>
            <span className={css.fieldLabel}>目标值</span>
            <Input
              type="number"
              min={1}
              step="any"
              value={targetValue}
              onChange={(event) => setTargetValue(event.target.value)}
              placeholder={`输入目标值（${GOAL_TYPE_UNITS[goalType]}）`}
              required
            />
          </label>

          <div className={css.actionsRow}>
            <Button type="submit" disabled={createGoal.isPending}>
              {createGoal.isPending ? "创建中..." : "创建目标"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

function GoalCard({ goal }: { goal: UserGoal }) {
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const progress = calcProgress(goal);
  const isComplete = progress >= 100;
  const isActive = goal.is_active === 1;
  const statusLabel = !isActive ? "已暂停" : isComplete ? "已完成" : "进行中";
  const statusVariant = !isActive
    ? "secondary"
    : isComplete
      ? "success"
      : "warning";

  return (
    <Card className={isActive ? css.goalCardActive : css.goalCardPaused}>
      <CardContent className={css.goalCardContent}>
        <div className={css.goalCardTop}>
          <div className={css.goalHeadingWrap}>
            <span className={isComplete ? css.goalIconDone : css.goalIcon}>
              <Target size={16} strokeWidth={1.9} />
            </span>
            <div>
              <p className={css.goalName}>
                {GOAL_TYPE_LABELS[goal.goal_type] ?? goal.goal_type}
              </p>
              <p className={css.goalMeta}>每日目标</p>
            </div>
          </div>

          <div className={css.goalActionsRow}>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            <Button
              variant="ghost"
              size="icon"
              title={isActive ? "暂停目标" : "恢复目标"}
              onClick={() =>
                updateGoal.mutate({ id: goal.id, is_active: isActive ? 0 : 1 })
              }
            >
              {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="删除目标"
              onClick={() => deleteGoal.mutate(goal.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div className={css.goalValuesRow}>
          <div>
            <div className={css.currentValue}>
              {formatGoalValue(goal.goal_type, goal.current_value)}
            </div>
            <div className={css.targetHint}>
              目标 {formatGoalValue(goal.goal_type, goal.target_value)}{" "}
              {GOAL_TYPE_UNITS[goal.goal_type]}
            </div>
          </div>
          <div className={css.percentBadge}>{progress.toFixed(0)}%</div>
        </div>

        <Progress value={progress} success={isComplete} />
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className={css.emptyState}>
      <Target className={css.emptyIcon} strokeWidth={1.5} />
      <p className={css.emptyTitle}>还没有每日目标</p>
      <p className={css.emptyText}>
        先创建一个可衡量的小目标，让训练更有方向感。
      </p>
      <Button onClick={onCreate} className={css.emptyAction}>
        <Plus size={16} />
        创建第一个目标
      </Button>
    </div>
  );
}

function calcProgress(goal: UserGoal): number {
  if (goal.target_value <= 0) {
    return 0;
  }

  return Math.min(100, (goal.current_value / goal.target_value) * 100);
}

function formatGoalValue(type: string, value: number): string {
  if (type === "accuracy") return value.toFixed(1);
  if (type === "wpm") return value.toFixed(1);
  if (type === "duration") return value.toFixed(0);
  return String(Math.round(value));
}
