import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";

const EnergyLevelWidget = () => {
  const [energyLevel, setEnergyLevel] = useState(75);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  const getEnergyColor = (level: number) => {
    if (level >= 70) return "text-energy-high";
    if (level >= 40) return "text-energy-medium";
    return "text-energy-low";
  };

  const getEnergyBadgeVariant = (level: number) => {
    if (level >= 70) return "default";
    if (level >= 40) return "secondary";
    return "destructive";
  };

  const getEnergyLabel = (level: number) => {
    if (level >= 80) return "Excellent";
    if (level >= 60) return "Good";
    if (level >= 40) return "Moderate";
    if (level >= 20) return "Low";
    return "Very Low";
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-energy-high" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-energy-low" />;
      default:
        return <Minus className="w-4 h-4 text-energy-medium" />;
    }
  };

  // Simulate energy level changes
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 10) - 5;
      setEnergyLevel(prev => {
        const newLevel = Math.max(0, Math.min(100, prev + change));
        if (newLevel > prev) setTrend('up');
        else if (newLevel < prev) setTrend('down');
        else setTrend('stable');
        return newLevel;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Zap className={`w-4 h-4 ${getEnergyColor(energyLevel)}`} />
            <span>Energy Level</span>
          </div>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {energyLevel}%
            </div>
            <Badge variant={getEnergyBadgeVariant(energyLevel)} className="text-xs">
              {getEnergyLabel(energyLevel)}
            </Badge>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="100, 100"
                className="text-muted stroke-current opacity-30"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${energyLevel}, 100`}
                className={`${getEnergyColor(energyLevel)} stroke-current`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className={`w-6 h-6 ${getEnergyColor(energyLevel)}`} />
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => setEnergyLevel(prev => Math.min(100, prev + 10))}
          >
            Boost
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-xs"
            onClick={() => setEnergyLevel(prev => Math.max(0, prev - 10))}
          >
            Rest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyLevelWidget;