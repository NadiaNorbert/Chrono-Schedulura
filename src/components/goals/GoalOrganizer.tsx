import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/services/api";
import { getGoalMeta } from "@/lib/goalMeta";
import { Calendar, Target, Clock, CheckCircle } from "lucide-react";

interface GoalOrganizerProps {
  goals: Goal[];
  onGoalSelect: (goal: Goal) => void;
}

export function GoalOrganizer({ goals, onGoalSelect }: GoalOrganizerProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("deadline");

  const getGoalStatus = (goal: Goal) => {
    const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
    if (progress >= 100) return "completed";
    if (goal.deadline && new Date(goal.deadline) < new Date()) return "overdue";
    return "active";
  };

  const filteredGoals = goals
    .filter(goal => {
      if (statusFilter !== "all" && getGoalStatus(goal) !== statusFilter) return false;
      if (categoryFilter !== "all") {
        const meta = getGoalMeta(goal.id);
        if (meta?.category !== categoryFilter) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "progress":
          const aProgress = a.target_value ? (a.current_value / a.target_value) : 0;
          const bProgress = b.target_value ? (b.current_value / b.target_value) : 0;
          return bProgress - aProgress;
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const categories = [...new Set(goals.map(g => getGoalMeta(g.id)?.category || "general"))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Goal Organizer
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="created">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredGoals.map(goal => {
            const status = getGoalStatus(goal);
            const progress = goal.target_value ? Math.round((goal.current_value / goal.target_value) * 100) : 0;
            const meta = getGoalMeta(goal.id);
            
            return (
              <div
                key={goal.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onGoalSelect(goal)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge variant={status === "completed" ? "default" : status === "overdue" ? "destructive" : "secondary"}>
                      {status}
                    </Badge>
                    {meta?.category && (
                      <Badge variant="outline">{meta.category}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {progress}%
                    </span>
                    {goal.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(goal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            );
          })}
          {filteredGoals.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No goals match your filters
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}