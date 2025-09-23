import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Mic, 
  Heart, 
  Activity, 
  Brain, 
  AlertTriangle,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

const Monitoring = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [heartRate, setHeartRate] = useState(78);
  const [stressLevel, setStressLevel] = useState(12);
  const [fatigueIndex, setFatigueIndex] = useState(25);
  const [voiceLevel, setVoiceLevel] = useState(0);

  // Simulate real-time data updates
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate(prev => Math.max(60, Math.min(100, prev + Math.floor(Math.random() * 6) - 3)));
      setStressLevel(prev => Math.max(0, Math.min(100, prev + Math.floor(Math.random() * 4) - 2)));
      setFatigueIndex(prev => Math.max(0, Math.min(100, prev + Math.floor(Math.random() * 3) - 1)));
      
      if (isRecording) {
        setVoiceLevel(Math.random() * 100);
      } else {
        setVoiceLevel(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  const getStatusColor = (value: number, thresholds: {low: number, high: number}) => {
    if (value <= thresholds.low) return 'nominal';
    if (value <= thresholds.high) return 'caution';
    return 'critical';
  };

  const getStatusText = (value: number, thresholds: {low: number, high: number}) => {
    if (value <= thresholds.low) return 'Normal';
    if (value <= thresholds.high) return 'Elevated';
    return 'Critical';
  };

  const VoiceVisualizer = () => {
    const bars = Array.from({ length: 12 }, (_, i) => {
      const height = isRecording ? Math.random() * voiceLevel + 10 : 5;
      return (
        <div
          key={i}
          className="bg-primary transition-all duration-150 ease-out rounded-sm"
          style={{
            height: `${height}%`,
            opacity: isRecording ? 0.7 + (height / 100) * 0.3 : 0.3
          }}
        />
      );
    });

    return (
      <div className="flex items-end justify-center gap-1 h-16 px-4">
        {bars}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Monitoring</h1>
            <p className="text-muted-foreground">Real-time crew biometric and behavioral analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator nominal"></div>
            <span className="text-sm font-medium text-nominal">All Systems Active</span>
          </div>
        </div>

        {/* Alert Banner */}
        {fatigueIndex > 60 && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium text-warning">Fatigue Level Alert</p>
                  <p className="text-sm text-muted-foreground">Elevated fatigue detected - recommend rest break and hydration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Feed */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Feed Analysis
              </CardTitle>
              <CardDescription>Real-time visual monitoring and behavioral analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Camera Feed Placeholder</p>
                  <p className="text-xs text-muted-foreground mt-1">Connection: Station Cam 01</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Posture Analysis</p>
                  <p className="font-medium text-nominal">Good</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Activity Level</p>
                  <p className="font-medium text-primary">Moderate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Input Visualization */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Analysis
              </CardTitle>
              <CardDescription>Speech pattern and stress indicator analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/10 rounded-lg border">
                  <VoiceVisualizer />
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isRecording ? "destructive" : "default"}
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                    className="flex items-center gap-2"
                  >
                    {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Speech Rate</p>
                    <p className="font-medium text-foreground">Normal</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Voice Stress</p>
                    <p className="font-medium text-nominal">Low</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Metrics Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Biometric Data
            </CardTitle>
            <CardDescription>Real-time physiological monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Heart Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Heart Rate</span>
                  </div>
                  <Badge variant="outline" className={`text-${getStatusColor(heartRate, {low: 80, high: 90})}`}>
                    {getStatusText(heartRate, {low: 80, high: 90})}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-foreground">{heartRate} <span className="text-lg text-muted-foreground">bpm</span></div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (heartRate / 120) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Stress Level</span>
                  </div>
                  <Badge variant="outline" className={`text-${getStatusColor(stressLevel, {low: 30, high: 60})}`}>
                    {getStatusText(stressLevel, {low: 30, high: 60})}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-foreground">{stressLevel}<span className="text-lg text-muted-foreground">%</span></div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${stressLevel}%` }}
                  />
                </div>
              </div>

              {/* Fatigue Index */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Fatigue Index</span>
                  </div>
                  <Badge variant="outline" className={`text-${getStatusColor(fatigueIndex, {low: 40, high: 70})}`}>
                    {getStatusText(fatigueIndex, {low: 40, high: 70})}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-foreground">{fatigueIndex}<span className="text-lg text-muted-foreground">%</span></div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${fatigueIndex}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Monitoring;