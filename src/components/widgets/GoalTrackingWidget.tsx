import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Calendar, CheckCircle } from "lucide-react";

const GoalTrackingWidget = () => {
  const goals = [
    {
      id: 1,
      title: "Daily Tasks",
      progress: 75,
      completed: 6,
      total: 8,
      category: "productivity",
      trend: "up"
    },
    {
      id: 2,
      title: "Weekly Exercise",
      progress: 60,
      completed: 3,
      total: 5,
      category: "health",
      trend: "up"
    },
    {
      id: 3,
      title: "Learning Goals",
      progress: 40,
      completed: 2,
      total: 5,
      category: "personal",
      trend: "stable"
    }
  ];

  const overallProgress = Math.round(
    goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length
  );

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-energy-high";
    if (progress >= 60) return "bg-energy-medium";
    return "bg-energy-low";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "productivity":
        return "bg-primary/20 text-primary";
      case "health":
        return "bg-wellness-physical/20 text-wellness-physical";
      case "personal":
        return "bg-secondary/20 text-secondary";
      default:
        return "bg-muted text-muted-foreground";
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
            {overallProgress}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-foreground">
                    {goal.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0.5 ${getCategoryColor(goal.category)}`}
                  >
                    {goal.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {goal.trend === "up" && (
                    <TrendingUp className="w-3 h-3 text-energy-high" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {goal.completed}/{goal.total}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={goal.progress} className="h-1.5 flex-1" />
                <span className="text-xs font-medium text-foreground min-w-[35px]">
                  {goal.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {goals.reduce((acc, goal) => acc + goal.completed, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">
              {goals.reduce((acc, goal) => acc + goal.total, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Goals</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-energy-high">
              {goals.filter(g => g.progress >= 80).length}
            </div>
            <div className="text-xs text-muted-foreground">Achieved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTrackingWidget;