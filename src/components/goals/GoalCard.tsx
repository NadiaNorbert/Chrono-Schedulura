import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/services/api";
import { getGoalMeta } from "@/lib/goalMeta";
import { Calendar as CalendarIcon, Share2, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  onShare: () => void;
  onView?: () => void;
}

export function GoalCard({ goal, onShare, onView }: GoalCardProps) {
  const meta = getGoalMeta(goal.id) || { category: "general", isPublic: true };
  const progress = Math.min(100, Math.round((goal.current_value / Math.max(goal.target_value, 1)) * 100));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate">{goal.title}</CardTitle>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{goal.description}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 capitalize">{meta.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} />
          <div className="mt-1 text-xs text-muted-foreground">
            {goal.current_value} / {goal.target_value} {goal.unit}
          </div>
        </div>
        {goal.deadline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>Due {format(new Date(goal.deadline), "PP")}</span>
          </div>
        )}
        <div className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-1" /> Share
          </Button>
          {onView && (
            <Button variant="ghost" size="sm" onClick={onView}>
              <ExternalLink className="w-4 h-4 mr-1" /> View details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
