import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { parsePayload, verifyShareToken, sha256Hex } from "@/lib/share";
import { format } from "date-fns";

export default function GoalSharePreview() {
  const [params] = useSearchParams();
  const payloadB64 = params.get('payload') || '';
  const sig = params.get('sig') || '';

  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const payload = useMemo(() => parsePayload(payloadB64), [payloadB64]);

  useEffect(() => {
    (async () => setValid(await verifyShareToken(payloadB64, sig)))();
  }, [payloadB64, sig]);

  useEffect(() => {
    // Simple analytics: count views per signature
    if (valid) {
      const key = `goal_share_views_${sig}`;
      const current = Number(localStorage.getItem(key) || '0');
      localStorage.setItem(key, String(current + 1));
    }
  }, [valid, sig]);

  const onUnlock = async () => {
    if (!payload?.pwHash) return;
    const attempt = await sha256Hex(`pw:${password}`);
    if (attempt === payload.pwHash) {
      setUnlocked(true);
    } else {
      alert('Incorrect password');
    }
  };

  const canView = valid && payload && (!payload.pwHash || unlocked);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {valid === false && (
            <Card>
              <CardContent className="py-10 text-center text-destructive flex flex-col items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Invalid or corrupted share link.
              </CardContent>
            </Card>
          )}

          {valid && payload && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{payload.title}</span>
                  {payload.category && <Badge variant="secondary" className="capitalize">{payload.category}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payload.pwHash && !unlocked ? (
                  <div className="rounded-md border p-4">
                    <Label>Enter password to view</Label>
                    <div className="flex gap-2 mt-2">
                      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <Button onClick={onUnlock}>Unlock</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {payload.description && (
                      <p className="text-muted-foreground">{payload.description}</p>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round((payload.current_value / Math.max(payload.target_value, 1)) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((payload.current_value / Math.max(payload.target_value, 1)) * 100)} />
                      <div className="mt-1 text-xs text-muted-foreground">
                        {payload.current_value} / {payload.target_value} {payload.unit}
                      </div>
                    </div>

                    {payload.deadline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Due {format(new Date(payload.deadline), 'PP')}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button asChild>
                        <Link to="/goals">Open in app</Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
