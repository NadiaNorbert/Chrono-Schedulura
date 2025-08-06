import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { apiClient, Goal } from "@/services/api";
import { format, differenceInDays } from "date-fns";

const GoalTrackingWidget = () => {
  const { data, loading, error } = useApi<Goal[]>(() => apiClient.getGoals(), []);
  const goals = data || [];

  const progressPct = (g: Goal) => {
    if (!g.target_value) return 0;
    const pct = Math.round((g.current_value / g.target_value) * 100);
    return Math.max(0, Math.min(100, pct));
  };

  const overallProgress = goals.length
    ? Math.round(goals.reduce((acc, g) => acc + progressPct(g), 0) / goals.length)
    : 0;

  const daysLeft = (deadline?: string) => {
    if (!deadline) return null;
    try {
      const d = new Date(deadline);
      return differenceInDays(d, new Date());
    } catch {
      return null;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Goal Tracking</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {loading ? "…" : `${overallProgress}% Complete`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-xs text-destructive">{error}</div>
        )}

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Individual Goals */}
        <div className="space-y-3">
          {loading && (
            <div className="text-xs text-muted-foreground">Loading goals…</div>
          )}
          {!loading && goals.length === 0 && (
            <div className="text-xs text-muted-foreground">No goals yet.</div>
          )}
          {goals.slice(0, 3).map((g) => (
            <div key={g.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-foreground truncate max-w-[160px]">
                    {g.title}
                  </span>
                  {g.deadline && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      due {format(new Date(g.deadline), "MMM d")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-energy-high" />
                  <span className="text-xs text-muted-foreground">
                    {g.current_value}/{g.target_value} {g.unit}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={progressPct(g)} className="h-1.5 flex-1" />
                <span className="text-xs font-medium text-foreground min-w-[35px]">
                  {progressPct(g)}%
                </span>
              </div>
              {g.deadline && (
                <div className="text-[10px] text-muted-foreground">
                  {(() => {
                    const dl = daysLeft(g.deadline);
                    return dl === null ? null : dl >= 0 ? `${dl} days left` : `${Math.abs(dl)} days overdue`;
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTrackingWidget;