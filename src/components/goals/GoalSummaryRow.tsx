import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/services/api";
import { differenceInDays, isAfter, isBefore, parseISO } from "date-fns";

export function GoalSummaryRow({ goals, onClickNear, onClickAll, onClickInProgress, onClickCompleted }: {
  goals: Goal[];
  onClickNear: () => void;
  onClickAll: () => void;
  onClickInProgress: () => void;
  onClickCompleted: () => void;
}) {
  const total = goals.length;
  const completed = goals.filter(g => g.target_value && g.current_value >= g.target_value).length;
  const inProgress = goals.filter(g => g.target_value && g.current_value < g.target_value).length;
  const near = goals.filter(g => g.deadline && differenceInDays(new Date(g.deadline!), new Date()) <= 7 && differenceInDays(new Date(g.deadline!), new Date()) >= 0).length;

  const items = [
    { label: 'Total Goals', value: total, color: 'from-primary/10 to-primary/5', onClick: onClickAll },
    { label: 'Completed', value: completed, color: 'from-wellness-physical/10 to-wellness-physical/5', onClick: onClickCompleted },
    { label: 'In Progress', value: inProgress, color: 'from-secondary/10 to-secondary/5', onClick: onClickInProgress },
    { label: 'Near Deadlines', value: near, color: 'from-destructive/10 to-destructive/5', onClick: onClickNear },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <Card key={it.label} onClick={it.onClick} className="cursor-pointer hover:shadow-glow transition-all">
          <CardContent className={`p-4 rounded-lg bg-gradient-to-br ${it.color}`}>
            <div className="text-xs text-muted-foreground">{it.label}</div>
            <div className="text-2xl font-bold">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
