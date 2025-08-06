import { useMemo, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { apiClient, Goal } from "@/services/api";
import { Plus, Target, AlertTriangle, Clock3 } from "lucide-react";
import GoalTrackingWidget from "@/components/widgets/GoalTrackingWidget";
import { GoalMiniBar } from "@/components/goals/GoalMiniBar";
import { GoalShareDialog } from "@/components/goals/GoalShareDialog";
import { GoalCard } from "@/components/goals/GoalCard";
import GoalFormModal from "@/components/goals/GoalFormModal";
import { useToast } from "@/hooks/use-toast";
import GoalSummarySection from "@/components/goals/GoalSummarySection";

export default function GoalTrackerPage() {
  const { data: goals, loading, error, refetch } = useApi<Goal[]>(() => apiClient.getGoals(), []);
  const [shareFor, setShareFor] = useState<Goal | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editFor, setEditFor] = useState<Goal | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Goal Tracker</h1>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add New Goal
            </Button>
          </div>

          <GoalTrackingWidget />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <GoalSummarySection />
            </CardContent>
          </Card>

          <Card id="goal-cards">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <div className="text-muted-foreground text-sm">Loading…</div>}
              {error && <div className="text-destructive text-sm">{error}</div>}
              {!loading && goals && goals.length === 0 && (
                <div className="text-muted-foreground text-sm">No goals yet. Click "Add New Goal" to create one.</div>
              )}
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {goals?.map((g) => (
                  <div key={g.id} id={`goal-${g.id}`} className="space-y-2">
                    <GoalCard 
                      goal={g} 
                      onShare={() => setShareFor(g)} 
                      onView={() => (window.location.href = '/goals')}
                      onEdit={() => setEditFor(g)}
                      onDelete={() => toast({ title: 'Delete not available', description: 'Delete endpoint not implemented yet.', variant: 'destructive' as any })}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {shareFor && (
        <GoalShareDialog open={!!shareFor} onOpenChange={(o) => !o && setShareFor(null)} goal={shareFor} />
      )}
      {formOpen && (
        <GoalFormModal 
          open={formOpen} 
          onOpenChange={(o) => { setFormOpen(o); if (!o) setEditFor(null);} } 
          initial={editFor}
          onSaved={() => refetch()}
        />
      )}
    </div>
  );
}
