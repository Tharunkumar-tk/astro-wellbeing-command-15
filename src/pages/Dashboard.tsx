import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Brain, 
  Activity, 
  Clock, 
  Monitor, 
  MessageSquare, 
  FileText,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [missionTime, setMissionTime] = useState(new Date());
  const [heartRate, setHeartRate] = useState(78);

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setMissionTime(new Date());
      // Simulate heart rate fluctuation
      setHeartRate(prev => prev + Math.floor(Math.random() * 6) - 3);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const statusCards = [
    {
      title: "Emotional State",
      value: "Calm",
      description: "Stable baseline",
      icon: Brain,
      color: "nominal",
      trend: "+2%"
    },
    {
      title: "Physical State", 
      value: "Active",
      description: "Good energy levels",
      icon: Activity,
      color: "nominal",
      trend: "Stable"
    },
    {
      title: "Heart Rate",
      value: `${heartRate} bpm`,
      description: "Within normal range",
      icon: Heart,
      color: heartRate > 85 ? "caution" : "nominal",
      trend: heartRate > 85 ? "Elevated" : "Normal"
    },
    {
      title: "Stress Level",
      value: "Low",
      description: "Optimal performance",
      icon: TrendingUp,
      color: "nominal",
      trend: "-5%"
    }
  ];

  const quickActions = [
    {
      title: "Live Monitoring",
      description: "View real-time biometric data",
      icon: Monitor,
      action: () => navigate('/monitoring'),
      variant: "default" as const
    },
    {
      title: "Companion Chat",
      description: "AI assistant conversation",
      icon: MessageSquare,
      action: () => navigate('/chat'),
      variant: "outline" as const
    },
    {
      title: "View Reports",
      description: "Analysis and trends",
      icon: FileText,
      action: () => navigate('/reports'),
      variant: "outline" as const
    }
  ];

  const formatMissionTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome, Commander</h1>
            <p className="text-sm md:text-base text-muted-foreground">Mission Control Dashboard</p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              Mission Day 124
            </div>
            <div className="text-xl md:text-2xl font-mono font-bold text-primary">
              {formatMissionTime(missionTime)}
            </div>
          </div>
        </div>

        {/* Status Alert */}
        <Card className="border-primary/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="status-indicator nominal"></div>
              <div>
                <p className="text-sm md:text-base font-medium text-foreground">All Systems Nominal</p>
                <p className="text-xs md:text-sm text-muted-foreground">Crew well-being parameters within acceptable ranges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {statusCards.map((card, index) => (
            <Card key={index} className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium truncate">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="text-lg md:text-2xl font-bold text-foreground tracking-tight">{card.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground truncate flex-1 mr-2">{card.description}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs flex-shrink-0 ${
                      card.color === 'nominal' ? 'text-nominal border-nominal' : 
                      card.color === 'caution' ? 'text-caution border-caution' : 
                      'text-critical border-critical'
                    }`}
                  >
                    {card.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Access</CardTitle>
            <CardDescription className="text-sm">Navigate to key monitoring and analysis tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:bg-accent/5 transition-colors active:scale-98" onClick={action.action}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm md:text-base font-medium text-foreground">{action.title}</h3>
                        <p className="text-xs text-muted-foreground hidden sm:block">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-caution" />
              <span className="text-lg md:text-xl">Recent System Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start md:items-center gap-3 p-3 bg-accent/5 rounded-lg">
                <div className="status-indicator nominal"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Routine health check completed</p>
                  <p className="text-xs text-muted-foreground">All biometric parameters nominal</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">2 min ago</span>
              </div>
              <div className="flex items-start md:items-center gap-3 p-3 bg-accent/5 rounded-lg">
                <div className="status-indicator nominal"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sleep quality analysis available</p>
                  <p className="text-xs text-muted-foreground">Last night: 8.2/10 quality score</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;