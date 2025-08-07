import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Goal } from "@/services/api";
import { getGoalMeta } from "@/lib/goalMeta";
import { Calendar as CalendarIcon, Share2, ExternalLink, CheckCircle, BookOpen, Trophy, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  onShare?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  onScrapbook?: () => void;
  showMilestones?: boolean;
}

export function GoalCard({ goal, onShare, onView, onEdit, onDelete, onComplete, onScrapbook, showMilestones = false }: GoalCardProps) {
  const meta = getGoalMeta(goal.id) || { category: "general", isPublic: true };
  const progress = Math.min(100, Math.round((goal.current_value / Math.max(goal.target_value, 1)) * 100));
  const isCompleted = progress >= 100;
  const startIso = (getGoalMeta(goal.id)?.startDate) || goal.created_at;
  const endIso = goal.deadline || undefined;
  const completedMilestones = goal.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = goal.milestones?.length || 0;

  const categoryColors = {
    fitness: 'bg-green-100 text-green-800 border-green-200',
    career: 'bg-blue-100 text-blue-800 border-blue-200',
    personal: 'bg-purple-100 text-purple-800 border-purple-200',
    finance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    learning: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    health: 'bg-red-100 text-red-800 border-red-200',
    general: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <Card className={`h-full flex flex-col transition-shadow hover:shadow-lg ${isCompleted ? 'ring-2 ring-green-500 bg-green-50/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className={`truncate ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {goal.title}
              </CardTitle>
              {isCompleted && <Trophy className="w-5 h-5 text-yellow-500 shrink-0" />}
            </div>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{goal.description}</p>
            )}
            <div className="flex gap-2 mt-2">
              <Badge className={`text-xs ${categoryColors[meta.category as keyof typeof categoryColors] || categoryColors.general}`}>
                {meta.category}
              </Badge>
              {isCompleted && (
                <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                  Completed
                </Badge>
              )}
            </div>
          </div>
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

        {/* Milestones */}
        {showMilestones && totalMilestones > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Milestones</span>
              <span className="font-medium">{completedMilestones} / {totalMilestones}</span>
            </div>
            <div className="space-y-1">
              {goal.milestones?.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2 text-sm">
                  <Checkbox 
                    checked={milestone.completed} 
                    className="w-3 h-3"
                    disabled={isCompleted}
                  />
                  <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                    {milestone.title}
                  </span>
                </div>
              ))}
              {totalMilestones > 3 && (
                <p className="text-xs text-muted-foreground">+{totalMilestones - 3} more milestones</p>
              )}
            </div>
          </div>
        )}

        {goal.deadline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>Due {format(new Date(goal.deadline), "PP")}</span>
          </div>
        )}

        {/* Timeline / View Bar */}
        <div className="mt-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>{startIso ? format(new Date(startIso), "MMM d") : "Start"}</span>
            <span>{endIso ? format(new Date(endIso), "MMM d") : "End"}</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {(() => {
              if (!goal.deadline) return `${progress}% complete`;
              const days = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000*60*60*24));
              return `${progress}% complete • ${days >= 0 ? days + " days left" : Math.abs(days) + " days overdue"}`;
            })()}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-1">
          {!isCompleted && onComplete && (
            <Button variant="default" size="sm" onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Button>
          )}
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
          )}
          {onScrapbook && (
            <Button variant="outline" size="sm" onClick={onScrapbook}>
              <BookOpen className="w-3 h-3 mr-1" />
              Scrapbook
            </Button>
          )}
          {onView && (
            <Button variant="ghost" size="sm" onClick={onView}>
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
