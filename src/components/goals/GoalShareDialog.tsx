import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Share2, Link as LinkIcon, Clipboard, Check, Twitter, Linkedin, Mail, Shield } from "lucide-react";
import { Goal } from "@/services/api";
import { GoalMeta, setGoalMeta, getGoalMeta, pushRecentShare, getRecentShares, RecentShare } from "@/lib/goalMeta";
import { SharePayload, generateShareToken, buildShareUrl, hashPassword } from "@/lib/share";

interface GoalShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
}

export function GoalShareDialog({ open, onOpenChange, goal }: GoalShareDialogProps) {
  const { toast } = useToast();
  const [meta, setMeta] = useState<GoalMeta>(() => getGoalMeta(goal.id) || { category: "general", isPublic: true });
  const [password, setPassword] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const recent = useMemo<RecentShare[]>(() => getRecentShares(), [open]);

  useEffect(() => {
    setGoalMeta(goal.id, meta);
  }, [meta, goal.id]);

  const canGenerate = meta.isPublic || password.length > 0;

  const onGenerate = async () => {
    try {
      setIsGenerating(true);
      setCopied(false);

      const payload: SharePayload = {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        target_value: goal.target_value,
        current_value: goal.current_value,
        unit: goal.unit,
        deadline: goal.deadline || null,
        category: meta.category,
        created_at: goal.created_at,
        updated_at: goal.updated_at,
        version: 1,
      };

      if (!meta.isPublic) {
        const pwHash = await hashPassword(password);
        payload.pwHash = pwHash;
        meta.passwordHash = pwHash;
        setMeta({ ...meta });
      }

      const { payloadB64, sig } = await generateShareToken(payload);
      const url = buildShareUrl(payloadB64, sig);
      setShareUrl(url);

      pushRecentShare({ id: goal.id, title: goal.title, url, timestamp: Date.now() });
    } catch (e) {
      toast({ title: "Share failed", description: "Could not generate a share link.", variant: "destructive" as any });
    } finally {
      setIsGenerating(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied", description: "Share link copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy link.", variant: "destructive" as any });
    }
  };

  const onWebShare = async () => {
    if (!shareUrl) await onGenerate();
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({ title: goal.title, text: "Check out this goal", url: shareUrl });
      } catch (e) {
        // user canceled or error
      }
    } else {
      toast({ title: "Sharing not supported", description: "Use the copy link or social buttons instead." });
    }
  };

  const openTwitter = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`My goal: ${goal.title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const openLinkedIn = () => {
    if (!shareUrl) return;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const openEmail = () => {
    if (!shareUrl) return;
    const subject = encodeURIComponent(`Sharing a goal: ${goal.title}`);
    const body = encodeURIComponent(`I wanted to share this goal with you:\n\n${goal.title}\n${goal.description || ""}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share goal</DialogTitle>
          <DialogDescription>Generate a secure link to share this goal. Choose privacy controls below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Privacy</Label>
            <div className="flex items-center justify-between rounded-md border p-3 bg-card">
              <div>
                <div className="text-sm font-medium">Publicly shareable</div>
                <div className="text-xs text-muted-foreground">Anyone with the link can view</div>
              </div>
              <Switch checked={meta.isPublic} onCheckedChange={(v) => setMeta({ ...meta, isPublic: Boolean(v) })} />
            </div>
            {!meta.isPublic && (
              <div className="rounded-md border p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium"><Shield className="w-4 h-4" /> Password protection</div>
                <Input type="password" placeholder="Enter a password to protect" value={password} onChange={(e) => setPassword(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Viewers must enter this password to access the goal.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input placeholder="e.g. fitness, productivity, learning" value={meta.category} onChange={(e) => setMeta({ ...meta, category: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Share link</Label>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} placeholder="Generate a link..." />
              <Button variant="secondary" onClick={onGenerate} disabled={!canGenerate || isGenerating}>
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={onCopy} disabled={!shareUrl}>
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Clipboard className="w-4 h-4 mr-1" />} Copy link
              </Button>
              <Button variant="outline" size="sm" onClick={onWebShare} disabled={!shareUrl && !navigator.share}>
                <Share2 className="w-4 h-4 mr-1" /> Share via device
              </Button>
              <Button variant="outline" size="sm" onClick={openTwitter} disabled={!shareUrl}>
                <Twitter className="w-4 h-4 mr-1" /> Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={openLinkedIn} disabled={!shareUrl}>
                <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
              </Button>
              <Button variant="outline" size="sm" onClick={openEmail} disabled={!shareUrl}>
                <Mail className="w-4 h-4 mr-1" /> Email
              </Button>
            </div>
          </div>

          <Separator />

          {recent.length > 0 && (
            <div className="space-y-2">
              <Label>Recent shares</Label>
              <div className="space-y-2 max-h-40 overflow-auto pr-1">
                {recent.map((r) => (
                  <div key={r.timestamp + r.id} className="flex items-center justify-between rounded-md border p-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{r.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.url}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={async () => { await navigator.clipboard.writeText(r.url); toast({ title: "Link copied" }); }}>
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
