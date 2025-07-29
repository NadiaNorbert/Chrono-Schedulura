import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Heart } from "lucide-react";

const motivationalQuotes = [
  "Your potential is endless, and today is your canvas.",
  "Small steps daily lead to big changes yearly.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You are capable of amazing things when you believe in yourself.",
  "Progress, not perfection, is the goal.",
  "Every expert was once a beginner who never gave up.",
  "Your mindset determines your reality.",
  "Challenges are opportunities in disguise.",
  "Consistency beats perfection every single time.",
  "You grow strongest in the moments when you think you can't go on.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only impossible journey is the one you never begin.",
];

const AIMotivatorWidget = () => {
  const [currentQuote, setCurrentQuote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);

  const generateNewQuote = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setCurrentQuote(randomQuote);
      setIsGenerating(false);
    }, 1000);
  };

  const likeQuote = () => {
    if (currentQuote && !likedQuotes.includes(currentQuote)) {
      setLikedQuotes(prev => [...prev, currentQuote]);
    }
  };

  useEffect(() => {
    generateNewQuote();
    
    // Auto-generate new quotes every 30 seconds
    const interval = setInterval(generateNewQuote, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary/30 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>AI Motivator</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={likeQuote}
              disabled={!currentQuote || likedQuotes.includes(currentQuote)}
              className="p-1 h-6 w-6"
            >
              <Heart 
                className={`w-3 h-3 ${
                  currentQuote && likedQuotes.includes(currentQuote) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-muted-foreground'
                }`} 
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={generateNewQuote}
              disabled={isGenerating}
              className="p-1 h-6 w-6"
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[80px] flex items-center">
          {isGenerating ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm italic">Generating motivation...</span>
            </div>
          ) : (
            <blockquote className="text-sm font-medium text-foreground leading-relaxed italic">
              "{currentQuote}"
            </blockquote>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>AI Generated</span>
          </div>
          {likedQuotes.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3 text-red-500" />
              <span>{likedQuotes.length} saved</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMotivatorWidget;