import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { apiClient, Goal } from "@/services/api";
import { Plus } from "lucide-react";
import GoalTrackingWidget from "@/components/widgets/GoalTrackingWidget";
import { GoalMiniBar } from "@/components/goals/GoalMiniBar";
import { GoalShareDialog } from "@/components/goals/GoalShareDialog";

export default function GoalTrackerPage() {
  const { data: goals, loading, error, refetch } = useApi<Goal[]>(() => apiClient.getGoals(), []);
  const [shareFor, setShareFor] = useState<Goal | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Goal Tracker</h1>
            <Button onClick={() => (window.location.href = "/goals")}>
              <Plus className="w-4 h-4 mr-1" /> Add New Goal
            </Button>
          </div>

          <GoalTrackingWidget />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick View</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <div className="text-muted-foreground text-sm">Loading…</div>}
              {error && <div className="text-destructive text-sm">{error}</div>}
              {!loading && goals && goals.length === 0 && (
                <div className="text-muted-foreground text-sm">No goals yet. Click "Add New Goal" to create one.</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {goals?.map((g) => (
                  <div key={g.id} className="space-y-2">
                    <GoalMiniBar goal={g} />
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => setShareFor(g)}>Share</Button>
                    </div>
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
    </div>
  );
}
