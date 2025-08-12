import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface SelfCareItem {
  step: string;
  time: string;
  completed: boolean;
}

interface AddSelfCareDialogProps {
  onAddItem: (item: SelfCareItem) => void;
}

export const AddSelfCareDialog = ({ onAddItem }: AddSelfCareDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    step: "",
    time: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.step && formData.time) {
      onAddItem({
        step: formData.step,
        time: formData.time,
        completed: false
      });
      setFormData({ step: "", time: "" });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Self-Care Step</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="step">Step Name</Label>
            <Input
              id="step"
              value={formData.step}
              onChange={(e) => setFormData(prev => ({ ...prev, step: e.target.value }))}
              placeholder="e.g., Face Mask"
              required
            />
          </div>
          
          <div>
            <Label>Time</Label>
            <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Step
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};