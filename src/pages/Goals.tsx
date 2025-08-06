import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient, Goal } from "@/services/api";
import { useApi, useMutation } from "@/hooks/useApi";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalShareDialog } from "@/components/goals/GoalShareDialog";
import { setGoalMeta } from "@/lib/goalMeta";

export default function GoalsPage() {
  const { data: goals, loading, error, refetch } = useApi<Goal[]>(() => apiClient.getGoals(), []);
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [shareFor, setShareFor] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<{ title: string; description?: string; target_value: number; unit: string; deadline?: Date | null; category: string; }>(
    { title: "", description: "", target_value: 100, unit: "pts", deadline: null, category: "general" }
  );

  const { mutate: createGoal, loading: creating } = useMutation<Goal, { title: string; description?: string; target_value: number; unit: string; deadline?: string }>((payload) => apiClient.createGoal(payload as any));

  const onCreate = async () => {
    if (!newGoal.title || !newGoal.unit) return;
    const payload = {
      title: newGoal.title,
      description: newGoal.description || undefined,
      target_value: Number(newGoal.target_value) || 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline ? newGoal.deadline.toISOString() : undefined,
    } as any;

    const created = await createGoal(payload);
    if (created) {
      setGoalMeta(created.id, { category: newGoal.category, isPublic: true });
      toast({ title: "Goal created", description: `\"${created.title}\" was added.` });
      setIsAddOpen(false);
      setNewGoal({ title: "", description: "", target_value: 100, unit: "pts", deadline: null, category: "general" });
      refetch();
    } else {
      toast({ title: "Failed to create goal", variant: "destructive" as any });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Goals</h1>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-1" /> Add New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="e.g. Run 5K" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} placeholder="Optional details" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target value</Label>
                      <Input type="number" value={newGoal.target_value} onChange={(e) => setNewGoal({ ...newGoal, target_value: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input value={newGoal.unit} onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })} placeholder="e.g. km, pages" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input value={newGoal.category} onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })} placeholder="e.g. fitness" />
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start", !newGoal.deadline && "text-muted-foreground")}> 
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {newGoal.deadline ? format(newGoal.deadline, "PP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={newGoal.deadline ?? undefined} onSelect={(d) => setNewGoal({ ...newGoal, deadline: d ?? null })} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button onClick={onCreate} disabled={creating}>{creating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Create"}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full text-muted-foreground">Loading goals...</div>
            )}
            {error && (
              <div className="col-span-full text-destructive">{error}</div>
            )}
            {goals?.map((g) => (
              <GoalCard key={g.id} goal={g} onShare={() => setShareFor(g)} />
            ))}
            {goals && goals.length === 0 && !loading && (
              <Card className="col-span-full">
                <CardContent className="py-10 text-center text-muted-foreground">No goals yet. Click "Add New Goal" to create your first goal.</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {shareFor && (
        <GoalShareDialog open={!!shareFor} onOpenChange={(o) => !o && setShareFor(null)} goal={shareFor} />
      )}
    </div>
  );
}
