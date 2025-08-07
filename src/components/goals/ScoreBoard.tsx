import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserScore } from "@/services/api";
import { Trophy, Target, CheckCircle, Plus } from "lucide-react";

interface ScoreBoardProps {
  userScore?: UserScore;
  className?: string;
}

export function ScoreBoard({ userScore, className }: ScoreBoardProps) {
  if (!userScore) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Loading score...</p>
        </CardContent>
      </Card>
    );
  }

  const nextLevelThreshold = Math.ceil(userScore.total_points / 100) * 100 + 100;
  const progressToNext = ((userScore.total_points % 100) / 100) * 100;

  return (
    <Card className={`bg-gradient-to-br from-primary/5 to-secondary/5 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Your Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {userScore.total_points}
          </div>
          <p className="text-sm text-muted-foreground">Total Points</p>
          <Badge variant="secondary" className="mt-2">
            Level {Math.floor(userScore.total_points / 100) + 1}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next level</span>
            <span>{Math.round(progressToNext)}%</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {nextLevelThreshold - userScore.total_points} points to next level
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Plus className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-semibold">{userScore.goals_created}</div>
            <p className="text-xs text-muted-foreground">Goals Created</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Target className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-lg font-semibold">{userScore.milestones_completed}</div>
            <p className="text-xs text-muted-foreground">Milestones</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold">{userScore.goals_completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>• +10 points for creating a goal</p>
          <p>• +5 points for completing a milestone</p>
          <p>• +50 points for completing a goal</p>
        </div>
      </CardContent>
    </Card>
  );
}