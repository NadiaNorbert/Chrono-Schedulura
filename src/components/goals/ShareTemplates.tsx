import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Goal, UserScore } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Download, Share2, Trophy, Target, Calendar } from "lucide-react";
import html2canvas from "html2canvas";

interface ShareTemplatesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
  userScore?: UserScore;
}

const SHARE_TEMPLATES = [
  { 
    id: "minimalist", 
    name: "Minimalist", 
    className: "bg-white border-l-4 border-primary",
    description: "Clean design with focus on typography"
  },
  { 
    id: "vibrant", 
    name: "Vibrant", 
    className: "bg-gradient-to-br from-primary to-secondary text-white",
    description: "Bold colors and modern graphics"
  },
  { 
    id: "inspirational", 
    name: "Inspirational", 
    className: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden",
    description: "Mountain background with motivational quote"
  }
];

export function ShareTemplates({ open, onOpenChange, goal, userScore }: ShareTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(SHARE_TEMPLATES[0]);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const progress = goal.target_value ? Math.round((goal.current_value / goal.target_value) * 100) : 0;
  const isCompleted = progress >= 100;

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `${goal.title.replace(/\s+/g, '_')}_achievement.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({ title: "Achievement card downloaded!" });
    } catch (error) {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `🎯 ${isCompleted ? 'Just completed' : 'Making progress on'} my goal: ${goal.title}! ${isCompleted ? '✅' : ''} #GoalAchieved #Progress`;
    const url = window.location.href;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Achievement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selector */}
          <div className="grid grid-cols-3 gap-3">
            {SHARE_TEMPLATES.map(template => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all ${selectedTemplate.id === template.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className="p-3 text-center">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Card Preview */}
          <div 
            ref={cardRef}
            className={`w-full h-80 p-6 rounded-lg shadow-lg ${selectedTemplate.className} relative flex flex-col justify-center`}
          >
            {selectedTemplate.id === "inspirational" && (
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
            )}
            
            <div className="relative z-10 text-center space-y-4">
              {isCompleted && (
                <div className="flex justify-center">
                  <Badge className="bg-green-500 text-white text-lg px-4 py-1">
                    🎉 GOAL ACHIEVED!
                  </Badge>
                </div>
              )}
              
              <h1 className={`text-2xl font-bold ${selectedTemplate.id === "minimalist" ? "text-primary" : ""}`}>
                {goal.title}
              </h1>
              
              {goal.description && (
                <p className={`text-lg ${selectedTemplate.id === "minimalist" ? "text-muted-foreground" : "opacity-90"}`}>
                  {goal.description}
                </p>
              )}
              
              <div className="flex justify-center items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{progress}% Complete</span>
                </div>
                
                {goal.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {userScore && (
                <div className="flex justify-center items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4" />
                  <span>Total Score: {userScore.total_points} points</span>
                </div>
              )}
              
              {selectedTemplate.id === "inspirational" && (
                <div className="mt-6">
                  <p className="text-lg italic opacity-90">
                    "The journey of a thousand miles begins with one step"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button onClick={() => shareToSocial('twitter')} variant="outline" size="sm">
              Twitter/X
            </Button>
            <Button onClick={() => shareToSocial('facebook')} variant="outline" size="sm">
              Facebook
            </Button>
            <Button onClick={() => shareToSocial('linkedin')} variant="outline" size="sm">
              LinkedIn
            </Button>
            <Button onClick={() => shareToSocial('whatsapp')} variant="outline" size="sm">
              WhatsApp
            </Button>
            <Button onClick={downloadCard} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link copied!" });
              }}
              variant="outline" 
              size="sm"
            >
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}