import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export function FirebaseSetup() {
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  const handleSave = () => {
    // Save to localStorage for development
    localStorage.setItem('firebaseConfig', JSON.stringify(config));
    window.location.reload();
  };

  const isComplete = Object.values(config).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Firebase Configuration</CardTitle>
          <CardDescription>
            Enter your Firebase project configuration to enable authentication and database features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You can find these values in your Firebase Console → Project Settings → General → Your apps → Firebase SDK snippet
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="AIza..."
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="authDomain">Auth Domain</Label>
              <Input
                id="authDomain"
                placeholder="your-project.firebaseapp.com"
                value={config.authDomain}
                onChange={(e) => setConfig(prev => ({ ...prev, authDomain: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                placeholder="your-project-id"
                value={config.projectId}
                onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="storageBucket">Storage Bucket</Label>
              <Input
                id="storageBucket"
                placeholder="your-project.appspot.com"
                value={config.storageBucket}
                onChange={(e) => setConfig(prev => ({ ...prev, storageBucket: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
              <Input
                id="messagingSenderId"
                placeholder="123456789"
                value={config.messagingSenderId}
                onChange={(e) => setConfig(prev => ({ ...prev, messagingSenderId: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="appId">App ID</Label>
              <Input
                id="appId"
                placeholder="1:123456789:web:abcdef"
                value={config.appId}
                onChange={(e) => setConfig(prev => ({ ...prev, appId: e.target.value }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={!isComplete}
            className="w-full"
          >
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}