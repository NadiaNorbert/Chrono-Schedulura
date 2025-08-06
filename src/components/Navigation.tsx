import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Bell,
  Heart,
  BarChart3,
  Brain,
  MessageCircle,
  Activity,
  Sparkles,
  Menu,
  X,
  LogOut,
  Target,
} from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/scheduler", label: "Smart Scheduler", icon: Calendar },
    { path: "/calendar", label: "Calendar View", icon: Calendar },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/goal-tracker", label: "Goal Tracker", icon: Target },
    { path: "/reminders", label: "Reminders", icon: Bell },
    { path: "/wellness", label: "Wellness & Break", icon: Heart },
    { path: "/health", label: "Health Companion", icon: Activity },
    { path: "/chat", label: "Companion Chat", icon: MessageCircle },
    { path: "/neuroflow", label: "Neuro Flow", icon: Brain },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Scheduler
              </span>
            </Link>

            <div className="flex items-center space-x-1 flex-1 overflow-x-auto" role="navigation" aria-label="Primary">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className="shrink-0">
                    <Button
                      variant={isActiveRoute(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Badge variant="secondary" className="hidden lg:flex">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <span className="text-sm text-muted-foreground hidden lg:inline">
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Scheduler
              </span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 pb-4 border-t border-border">
              <div className="grid grid-cols-2 gap-2 mt-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActiveRoute(item.path) ? "default" : "ghost"}
                        size="sm"
                        className="w-full flex items-center space-x-2 justify-start"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="text-sm text-muted-foreground px-2">
                  {user?.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="w-full flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navigation;