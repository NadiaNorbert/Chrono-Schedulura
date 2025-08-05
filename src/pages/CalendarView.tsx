import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'daily' | 'weekly' | 'monthly';
  dueDate?: Date;
  createdAt: Date;
}

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  // Mock tasks with due dates
  const [tasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Morning workout', 
      completed: false, 
      priority: 'high', 
      category: 'daily', 
      dueDate: new Date(), 
      createdAt: new Date() 
    },
    { 
      id: '2', 
      title: 'Team meeting review', 
      completed: true, 
      priority: 'medium', 
      category: 'daily', 
      dueDate: new Date(), 
      createdAt: new Date() 
    },
    { 
      id: '3', 
      title: 'Grocery shopping', 
      completed: false, 
      priority: 'low', 
      category: 'weekly', 
      dueDate: new Date(Date.now() + 24*60*60*1000), 
      createdAt: new Date() 
    },
    { 
      id: '4', 
      title: 'Monthly budget planning', 
      completed: false, 
      priority: 'high', 
      category: 'monthly', 
      dueDate: new Date(Date.now() + 2*24*60*60*1000), 
      createdAt: new Date() 
    },
    { 
      id: '5', 
      title: 'Doctor appointment', 
      completed: false, 
      priority: 'high', 
      category: 'daily', 
      dueDate: new Date(Date.now() + 3*24*60*60*1000), 
      createdAt: new Date() 
    },
  ]);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(task.dueDate, date)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return eachDayOfInterval({ start, end });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Calendar View
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                Week
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{view === 'month' ? 'Monthly View' : 'Weekly View'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {view === 'month' ? (
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border w-full pointer-events-auto"
                      components={{
                        Day: ({ date, ...props }) => {
                          const tasksForDate = getTasksForDate(date);
                          return (
                            <div className="relative w-full h-full">
                              <button
                                {...props}
                                className={cn(
                                  "w-full h-full p-0 font-normal aria-selected:opacity-100 min-h-[2.5rem]",
                                  isSameDay(date, selectedDate) && "bg-primary text-primary-foreground",
                                  isSameDay(date, new Date()) && !isSameDay(date, selectedDate) && "bg-accent",
                                  "hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                <div className="flex flex-col items-center justify-center h-full">
                                  <span className="text-sm">{format(date, 'd')}</span>
                                  {tasksForDate.length > 0 && (
                                    <div className="flex space-x-1 mt-1">
                                      {tasksForDate.slice(0, 3).map((task, index) => (
                                        <div
                                          key={index}
                                          className={cn("w-1.5 h-1.5 rounded-full", getPriorityColor(task.priority))}
                                        />
                                      ))}
                                      {tasksForDate.length > 3 && (
                                        <span className="text-xs">+{tasksForDate.length - 3}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </button>
                            </div>
                          );
                        }
                      }}
                    />
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <h3 className="text-lg font-semibold">
                          {format(getWeekDays()[0], 'MMM d')} - {format(getWeekDays()[6], 'MMM d, yyyy')}
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {getWeekDays().map((day) => (
                          <div key={day.toISOString()} className="border rounded-lg p-2 min-h-[120px]">
                            <div className="text-sm font-medium mb-2">
                              <div>{format(day, 'EEE')}</div>
                              <div className={cn(
                                "text-lg",
                                isSameDay(day, new Date()) && "text-primary font-bold"
                              )}>
                                {format(day, 'd')}
                              </div>
                            </div>
                            <div className="space-y-1">
                              {getTasksForDate(day).map((task) => (
                                <div
                                  key={task.id}
                                  className={cn(
                                    "text-xs p-1 rounded truncate",
                                    task.completed ? "line-through opacity-50" : "",
                                    task.priority === 'high' ? "bg-red-100 text-red-800" :
                                    task.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                                    "bg-green-100 text-green-800"
                                  )}
                                  title={task.title}
                                >
                                  {task.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Task Details for Selected Date */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTasksForDate(selectedDate).length > 0 ? (
                      getTasksForDate(selectedDate).map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-lg border bg-card space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
                            <h4 className={cn("text-sm font-medium", task.completed && "line-through")}>
                              {task.title}
                            </h4>
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.category}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tasks for this date</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;