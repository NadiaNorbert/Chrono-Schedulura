import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/services/api";
import { format, differenceInDays } from "date-fns";
import { getGoalMeta } from "@/lib/goalMeta";

export function GoalMiniBar({ goal }: { goal: Goal }) {
  const pct = goal.target_value
    ? Math.max(0, Math.min(100, Math.round((goal.current_value / goal.target_value) * 100)))
    : 0;

  const meta = getGoalMeta(goal.id);
  const category = meta?.category;
  const categoryClass = (() => {
    switch ((category || '').toLowerCase()) {
      case 'fitness':
      case 'health':
        return 'bg-wellness-physical/15 text-wellness-physical';
      case 'learning':
      case 'personal':
        return 'bg-secondary/15 text-secondary';
      case 'productivity':
        return 'bg-primary/15 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  })();

  const daysLeft = () => {
    if (!goal.deadline) return null;
    try {
      const dl = differenceInDays(new Date(goal.deadline), new Date());
      return dl;
    } catch {
      return null;
    }
  };

  return (
    <div className="p-3 rounded-lg border bg-card/60">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="text-sm font-medium truncate">{goal.title}</div>
          {category && (
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryClass}`}>{category}</Badge>
          )}
        </div>
        {goal.deadline && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {format(new Date(goal.deadline), "MMM d")}
          </Badge>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Progress value={pct} className="h-1.5 flex-1" />
        <span className="text-xs font-medium min-w-[32px] text-right">{pct}%</span>
      </div>
      {goal.deadline && (
        <div className="mt-1 text-[10px] text-muted-foreground">
          {(() => {
            const dl = daysLeft();
            return dl === null ? null : dl >= 0 ? `${dl} days left` : `${Math.abs(dl)} days overdue`;
          })()}
        </div>
      )}
    </div>
  );
}
