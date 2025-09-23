import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Globe, 
  Wifi, 
  Moon, 
  Volume2,
  Shield,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    biometricAlerts: true,
    systemAlerts: true,
    missionUpdates: true,
    wellnessReminders: true
  });
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dataSync: true,
    offlineMode: false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Preference Updated", 
      description: `${key} changed successfully`,
    });
  };

  const systemInfo = [
    { label: 'AstroBot Version', value: 'v2.4.1', status: 'Current' },
    { label: 'Last Update', value: '2024-01-20', status: 'Recent' },
    { label: 'Database Status', value: 'Synchronized', status: 'Active' },
    { label: 'Connection Status', value: 'Ground Link Active', status: 'Connected' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
            <p className="text-muted-foreground">Configure AstroBot preferences and system options</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator nominal"></div>
            <span className="text-sm font-medium text-nominal">All Systems Configured</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage alerts and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Biometric Alerts</p>
                  <p className="text-sm text-muted-foreground">Heart rate, stress level warnings</p>
                </div>
                <Switch
                  checked={notifications.biometricAlerts}
                  onCheckedChange={(value) => handleNotificationChange('biometricAlerts', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-muted-foreground">Critical system status notifications</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(value) => handleNotificationChange('systemAlerts', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mission Updates</p>
                  <p className="text-sm text-muted-foreground">Schedule changes and announcements</p>
                </div>
                <Switch
                  checked={notifications.missionUpdates}
                  onCheckedChange={(value) => handleNotificationChange('missionUpdates', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Wellness Reminders</p>
                  <p className="text-sm text-muted-foreground">Exercise, sleep, and break reminders</p>
                </div>
                <Switch
                  checked={notifications.wellnessReminders}
                  onCheckedChange={(value) => handleNotificationChange('wellnessReminders', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Preferences
              </CardTitle>
              <CardDescription>Language, timezone, and system behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Language</p>
                <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Timezone</p>
                <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                    <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Synchronization</p>
                  <p className="text-sm text-muted-foreground">Auto-sync with ground control</p>
                </div>
                <Switch
                  checked={preferences.dataSync}
                  onCheckedChange={(value) => handlePreferenceChange('dataSync', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Offline Mode</p>
                  <p className="text-sm text-muted-foreground">Function during communication blackouts</p>
                </div>
                <Switch
                  checked={preferences.offlineMode}
                  onCheckedChange={(value) => handlePreferenceChange('offlineMode', value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>Current system status and version details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemInfo.map((info, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{info.label}</p>
                    <p className="text-sm text-muted-foreground">{info.value}</p>
                  </div>
                  <Badge variant="outline" className="text-nominal border-nominal">
                    {info.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Backup, export, and system maintenance options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Settings
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                System Reset
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-muted/20 rounded-lg border">
              <h4 className="font-medium text-foreground mb-2">Storage Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used Storage</span>
                  <span className="font-medium">2.3 GB / 16 GB</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '14%' }} />
                </div>
                <p className="text-xs text-muted-foreground">Last backup: 2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Security protocols and data privacy controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Encryption Status</p>
                <p className="text-sm text-muted-foreground">End-to-end data encryption</p>
              </div>
              <Badge variant="outline" className="text-nominal border-nominal">
                Enabled
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Access Logging</p>
                <p className="text-sm text-muted-foreground">Track system access and changes</p>
              </div>
              <Badge variant="outline" className="text-nominal border-nominal">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ground Control Link</p>
                <p className="text-sm text-muted-foreground">Secure communication with mission control</p>
              </div>
              <Badge variant="outline" className="text-nominal border-nominal">
                Authenticated
              </Badge>
            </div>

            <Button variant="outline" className="w-full mt-4">
              View Security Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;