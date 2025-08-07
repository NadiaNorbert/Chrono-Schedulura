import { useMemo, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/useApi";
import { apiClient, Goal, UserScore } from "@/services/api";
import { Plus, Target, BookOpen, Trophy, Share2, Trash2 } from "lucide-react";
import GoalTrackingWidget from "@/components/widgets/GoalTrackingWidget";
import { GoalMiniBar } from "@/components/goals/GoalMiniBar";
import { GoalShareDialog } from "@/components/goals/GoalShareDialog";
import { GoalCard } from "@/components/goals/GoalCard";
import GoalFormModal from "@/components/goals/GoalFormModal";
import { GoalOrganizer } from "@/components/goals/GoalOrganizer";
import { ScrapbookWidget } from "@/components/goals/ScrapbookWidget";
import { ShareTemplates } from "@/components/goals/ShareTemplates";
import { ScoreBoard } from "@/components/goals/ScoreBoard";
import { useToast } from "@/hooks/use-toast";
import GoalSummarySection from "@/components/goals/GoalSummarySection";

export default function GoalTrackerPage() {
  const { data: goals, loading, error, refetch } = useApi<Goal[]>(() => apiClient.getGoals(), []);
  const { data: userScore } = useApi<UserScore>(() => apiClient.getUserScore(), []);
  const [shareFor, setShareFor] = useState<Goal | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editFor, setEditFor] = useState<Goal | null>(null);
  const [scrapbookFor, setScrapbookFor] = useState<Goal | null>(null);
  const [shareTemplatesFor, setShareTemplatesFor] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const handleDeleteGoal = async (goal: Goal) => {
    if (!confirm(`Are you sure you want to delete "${goal.title}"?`)) return;
    
    try {
      await apiClient.deleteGoal(goal.id);
      toast({ title: "Goal deleted successfully" });
      refetch();
    } catch (error) {
      toast({ 
        title: "Delete failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    }
  };

  const handleGoalComplete = async (goal: Goal) => {
    try {
      await apiClient.updateGoal(goal.id, { current_value: goal.target_value });
      toast({ title: "🎉 Goal completed! Great job!" });
      refetch();
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🎯 Goal Tracker
            </h1>
            <div className="flex gap-2">
              <Button onClick={() => setFormOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Add New Goal
              </Button>
            </div>
          </div>

          {/* Score Board and Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Goal Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoalSummarySection />
                </CardContent>
              </Card>
            </div>
            <ScoreBoard userScore={userScore} />
          </div>

          <Tabs defaultValue="goals" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                My Goals
              </TabsTrigger>
              <TabsTrigger value="organizer" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Organizer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="goals" className="space-y-6">
              <GoalTrackingWidget />
              
              <Card id="goal-cards">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Active Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && <div className="text-muted-foreground text-sm">Loading…</div>}
                  {error && <div className="text-destructive text-sm">{error}</div>}
                  {!loading && goals && goals.length === 0 && (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                      <p className="text-muted-foreground mb-4">Start your journey by creating your first goal!</p>
                      <Button onClick={() => setFormOpen(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Create Your First Goal
                      </Button>
                    </div>
                  )}
                  <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals?.map((g) => (
                      <div key={g.id} id={`goal-${g.id}`} className="space-y-2">
                        <GoalCard 
                          goal={g} 
                          onShare={() => setShareTemplatesFor(g)} 
                          onView={() => setSelectedGoal(g)}
                          onEdit={() => setEditFor(g)}
                          onDelete={() => handleDeleteGoal(g)}
                          showMilestones={true}
                          onComplete={() => handleGoalComplete(g)}
                          onScrapbook={() => setScrapbookFor(g)}
                        />
                        <GoalMiniBar goal={g} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizer" className="space-y-6">
              <GoalOrganizer 
                goals={goals || []} 
                onGoalSelect={setSelectedGoal}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      {shareFor && (
        <GoalShareDialog 
          open={!!shareFor} 
          onOpenChange={(o) => !o && setShareFor(null)} 
          goal={shareFor} 
        />
      )}
      
      {shareTemplatesFor && (
        <ShareTemplates
          open={!!shareTemplatesFor}
          onOpenChange={(o) => !o && setShareTemplatesFor(null)}
          goal={shareTemplatesFor}
          userScore={userScore}
        />
      )}
      
      {scrapbookFor && (
        <ScrapbookWidget
          open={!!scrapbookFor}
          onOpenChange={(o) => !o && setScrapbookFor(null)}
          goal={scrapbookFor}
        />
      )}
      
      {formOpen && (
        <GoalFormModal 
          open={formOpen} 
          onOpenChange={(o) => { setFormOpen(o); if (!o) setEditFor(null);} } 
          initial={editFor}
          onSaved={(goal) => {
            refetch();
            if (!editFor) {
              toast({ 
                title: "🎉 Goal created!", 
                description: `You earned 10 points for creating "${goal.title}"` 
              });
            }
          }}
        />
      )}
    </div>
  );
}
