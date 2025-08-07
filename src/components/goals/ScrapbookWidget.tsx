import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Goal, ScrapbookEntry } from "@/services/api";
import { Upload, Download, Image as ImageIcon, Calendar, X } from "lucide-react";
import html2canvas from "html2canvas";

interface ScrapbookWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
}

const SCRAPBOOK_TEMPLATES = [
  { id: "classic", name: "Classic Photo Album", className: "grid grid-cols-2 gap-4 p-6 bg-white" },
  { id: "corkboard", name: "Corkboard Style", className: "relative p-8 bg-gradient-to-br from-amber-50 to-amber-100" },
  { id: "magazine", name: "Modern Magazine", className: "flex flex-col gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50" }
];

export function ScrapbookWidget({ open, onOpenChange, goal }: ScrapbookWidgetProps) {
  const [entries, setEntries] = useState<ScrapbookEntry[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(SCRAPBOOK_TEMPLATES[0]);
  const [newCaption, setNewCaption] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrapbookRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEntry = () => {
    if (!uploadedImage && !newCaption) return;
    
    const entry: ScrapbookEntry = {
      id: Date.now().toString(),
      goal_id: goal.id,
      image_url: uploadedImage || undefined,
      caption: newCaption,
      notes: newNotes,
      created_at: new Date().toISOString()
    };

    setEntries(prev => [...prev, entry]);
    setUploadedImage(null);
    setNewCaption("");
    setNewNotes("");
    toast({ title: "Entry added to scrapbook!" });
  };

  const removeEntry = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const downloadScrapbook = async () => {
    if (!scrapbookRef.current) return;
    
    try {
      const canvas = await html2canvas(scrapbookRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `${goal.title.replace(/\s+/g, '_')}_scrapbook.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({ title: "Scrapbook downloaded!" });
    } catch (error) {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {goal.title} - Scrapbook
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Entry */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {uploadedImage && (
                <div className="relative w-32 h-32 mx-auto">
                  <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onClick={() => setUploadedImage(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              <Input
                placeholder="Add a caption..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
              />
              
              <Textarea
                placeholder="Add notes about your progress..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
              
              <Button 
                onClick={addEntry} 
                disabled={!uploadedImage && !newCaption}
                className="w-full"
              >
                Add to Scrapbook
              </Button>
            </CardContent>
          </Card>

          {/* Template Selector */}
          <div className="flex gap-2">
            {SCRAPBOOK_TEMPLATES.map(template => (
              <Button
                key={template.id}
                variant={selectedTemplate.id === template.id ? "default" : "outline"}
                onClick={() => setSelectedTemplate(template)}
                size="sm"
              >
                {template.name}
              </Button>
            ))}
          </div>

          {/* Scrapbook Preview */}
          <div 
            ref={scrapbookRef}
            className={`min-h-[400px] border-2 border-dashed border-muted rounded-lg ${selectedTemplate.className}`}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary">{goal.title}</h2>
              <p className="text-muted-foreground">Journey Scrapbook</p>
            </div>

            {entries.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Your scrapbook entries will appear here
              </div>
            ) : (
              <div className={selectedTemplate.id === "classic" ? "grid grid-cols-2 gap-4" : 
                             selectedTemplate.id === "corkboard" ? "space-y-4" : "space-y-3"}>
                {entries.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={`${selectedTemplate.id === "corkboard" ? 
                      `rotate-${index % 2 === 0 ? '1' : '-1'} transform` : ''} 
                      bg-white p-3 rounded-lg shadow-sm border relative`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() => removeEntry(entry.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    
                    {entry.image_url && (
                      <img 
                        src={entry.image_url} 
                        alt={entry.caption}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    
                    <p className="font-medium text-sm mb-1">{entry.caption}</p>
                    {entry.notes && (
                      <p className="text-xs text-muted-foreground mb-2">{entry.notes}</p>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Download Button */}
          {entries.length > 0 && (
            <Button onClick={downloadScrapbook} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Scrapbook
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}