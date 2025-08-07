import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Goal, apiClient, Milestone } from "@/services/api";
import { getGoalMeta, setGoalMeta } from "@/lib/goalMeta";
import { Plus, X } from "lucide-react";

interface GoalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Goal | null;
  onSaved?: (goal: Goal) => void;
}

export default function GoalFormModal({ open, onOpenChange, initial, onSaved }: GoalFormModalProps) {
  const isEdit = Boolean(initial);
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [targetValue, setTargetValue] = useState<number>(100);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [unit, setUnit] = useState("%");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description || "");
      setTargetValue(initial.target_value);
      setUnit(initial.unit);
      setEndDate(initial.deadline || "");
      const meta = getGoalMeta(initial.id);
      setCategory(meta?.category || "general");
      setStartDate(meta?.startDate || initial.created_at);
      const pct = initial.target_value ? Math.round((initial.current_value / initial.target_value) * 100) : 0;
      setProgressPct(Math.max(0, Math.min(100, pct)));
      setMilestones(initial.milestones || []);
    } else {
      setTitle("");
      setDescription("");
      setCategory("general");
      setTargetValue(100);
      setProgressPct(0);
      setUnit("%");
      setStartDate(new Date().toISOString().slice(0,10));
      setEndDate("");
      setMilestones([]);
    }
  }, [initial, open]);

  const onSubmit = async () => {
    try {
      setSaving(true);
      const currentValue = Math.round((progressPct / 100) * targetValue);

      if (isEdit && initial) {
        const { data } = await apiClient.updateGoal(initial.id, {
          title,
          description,
          target_value: targetValue,
          current_value: currentValue,
          unit,
          deadline: endDate || undefined,
          milestones,
        });
        setGoalMeta(data.id, { category, isPublic: true, startDate });
        toast({ title: "Goal updated" });
        onSaved?.(data);
      } else {
        const { data } = await apiClient.createGoal({
          title,
          description,
          target_value: targetValue,
          current_value: currentValue,
          unit,
          deadline: endDate || undefined,
          milestones,
          id: "" as any, user_id: "" as any, created_at: "" as any, updated_at: "" as any,
        } as any);
        setGoalMeta(data.id, { category, isPublic: true, startDate });
        toast({ title: "Goal created" });
        onSaved?.(data);
      }
      onOpenChange(false);
    } catch (e) {
      toast({ title: "Save failed", description: e instanceof Error ? e.message : "", variant: "destructive" as any });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Goal" : "Add New Goal"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Run 5K" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="fitness, productivity, learning" />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. km, pages, %" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Target Value</Label>
              <Input type="number" value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Progress %</Label>
              <Input type="number" value={progressPct} onChange={(e) => setProgressPct(Math.max(0, Math.min(100, Number(e.target.value))))} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <Separator />

          {/* Milestones Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Milestones / Sub-tasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMilestones(prev => [...prev, { 
                  id: Date.now().toString(), 
                  title: "", 
                  completed: false, 
                  order: prev.length 
                }])}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Milestone
              </Button>
            </div>
            
            {milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Break down your goal into smaller, manageable steps
              </p>
            ) : (
              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center gap-2">
                    <Input
                      placeholder={`Milestone ${index + 1}`}
                      value={milestone.title}
                      onChange={(e) => setMilestones(prev => 
                        prev.map(m => m.id === milestone.id ? { ...m, title: e.target.value } : m)
                      )}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setMilestones(prev => prev.filter(m => m.id !== milestone.id))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button onClick={onSubmit} disabled={saving || !title} className="w-full">
              {saving ? "Saving..." : (isEdit ? "Save Changes" : "Create Goal")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
