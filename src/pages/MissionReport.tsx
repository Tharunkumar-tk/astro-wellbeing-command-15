import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Wrench, 
  Package, 
  Wind, 
  Dumbbell, 
  AlertTriangle,
  CheckCircle,
  Download,
  Clock,
  Users
} from 'lucide-react';

const MissionReport = () => {
  const missionEvents = [
    {
      time: '08:45:00',
      type: 'maintenance',
      status: 'completed',
      title: 'Life Support System Check',
      description: 'Routine inspection of oxygen generation and CO2 scrubbing systems',
      crew: 'Commander, Flight Engineer',
      priority: 'high'
    },
    {
      time: '10:30:00',
      type: 'experiment',
      status: 'in-progress',
      title: 'Protein Crystal Growth Experiment',
      description: 'Monitoring crystal formation in microgravity environment',
      crew: 'Mission Specialist',
      priority: 'medium'
    },
    {
      time: '14:15:00',
      type: 'exercise',
      status: 'completed',
      title: 'Resistance Exercise Session',
      description: 'ARED workout protocol - upper body and core',
      crew: 'All Crew',
      priority: 'high'
    },
    {
      time: '16:20:00',
      type: 'communication',
      status: 'completed',
      title: 'Ground Control Conference',
      description: 'Daily planning conference with mission control',
      crew: 'Commander',
      priority: 'high'
    }
  ];

  const systemStatus = [
    {
      system: 'Oxygen Generation',
      status: 'nominal',
      value: '99.8%',
      lastCheck: '2 hours ago',
      icon: Wind
    },
    {
      system: 'Power Systems',
      status: 'nominal', 
      value: '87.2%',
      lastCheck: '30 minutes ago',
      icon: CheckCircle
    },
    {
      system: 'Life Support',
      status: 'nominal',
      value: '98.5%',
      lastCheck: '1 hour ago',
      icon: CheckCircle
    },
    {
      system: 'Communication',
      status: 'caution',
      value: '78.3%',
      lastCheck: '15 minutes ago',
      icon: AlertTriangle
    }
  ];

  const supplies = [
    { item: 'Water', current: 450, capacity: 500, unit: 'L', status: 'nominal' },
    { item: 'Food Rations', current: 28, capacity: 30, unit: 'days', status: 'nominal' },
    { item: 'Oxygen', current: 825, capacity: 900, unit: 'kg', status: 'nominal' },
    { item: 'Medical Supplies', current: 85, capacity: 100, unit: '%', status: 'caution' }
  ];

  const exerciseLogs = [
    { session: 'Morning ARED', duration: '45 min', compliance: 'Complete', crew: 'Commander', intensity: 'High' },
    { session: 'Cardio COLAV', duration: '30 min', compliance: 'Complete', crew: 'Flight Engineer', intensity: 'Medium' },
    { session: 'Resistance Training', duration: '60 min', compliance: 'Partial', crew: 'Mission Specialist', intensity: 'High' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nominal': return 'text-nominal border-nominal';
      case 'caution': return 'text-caution border-caution';
      case 'critical': return 'text-critical border-critical';
      case 'completed': return 'text-nominal border-nominal';
      case 'in-progress': return 'text-primary border-primary';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return Wrench;
      case 'experiment': return CheckCircle;
      case 'exercise': return Dumbbell;
      case 'communication': return Users;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mission Report</h1>
            <p className="text-muted-foreground">Daily operational status and activity logs</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Mission Day</p>
              <p className="text-2xl font-bold text-primary">124</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Log
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        <Card className="border-caution bg-caution/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-caution" />
              <div>
                <p className="font-medium text-caution">Communication System Alert</p>
                <p className="text-sm text-muted-foreground">Module 3 communication array showing degraded performance - 78.3% efficiency</p>
              </div>
              <Badge variant="outline" className="text-caution border-caution ml-auto">
                Under Review
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Real-time station systems monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <system.icon className={`h-4 w-4 ${
                        system.status === 'nominal' ? 'text-nominal' : 
                        system.status === 'caution' ? 'text-caution' : 'text-critical'
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">{system.system}</p>
                        <p className="text-xs text-muted-foreground">Last check: {system.lastCheck}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{system.value}</p>
                  <Badge variant="outline" className={getStatusColor(system.status)}>
                    {system.status}
                  </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Supplies Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Supplies & Resources
              </CardTitle>
              <CardDescription>Current inventory and consumption rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplies.map((supply, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{supply.item}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{supply.current}/{supply.capacity} {supply.unit}</span>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(supply.status)}
                    >
                      {supply.status}
                    </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          supply.status === 'nominal' ? 'bg-nominal' : 
                          supply.status === 'caution' ? 'bg-caution' : 'bg-critical'
                        }`}
                        style={{ width: `${(supply.current / supply.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise and Health Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Exercise & Health Logs
            </CardTitle>
            <CardDescription>Daily physical fitness and health maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-muted-foreground">Session</th>
                    <th className="text-left p-2 text-muted-foreground">Duration</th>
                    <th className="text-left p-2 text-muted-foreground">Crew Member</th>
                    <th className="text-left p-2 text-muted-foreground">Intensity</th>
                    <th className="text-left p-2 text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseLogs.map((log, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-2 font-medium">{log.session}</td>
                      <td className="p-2">{log.duration}</td>
                      <td className="p-2">{log.crew}</td>
                      <td className="p-2">
                      <Badge variant="outline">
                        {log.intensity}
                      </Badge>
                      </td>
                      <td className="p-2">
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(log.compliance === 'Complete' ? 'completed' : 'caution')}
                        >
                          {log.compliance}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mission Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Mission Timeline
            </CardTitle>
            <CardDescription>Chronological log of today's activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missionEvents.map((event, index) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-card/30 rounded-lg border-l-4 border-l-primary">
                    <div className="flex items-center gap-2 min-w-0">
                      <EventIcon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-mono text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <Badge variant="outline">
                          {event.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                      <p className="text-xs text-muted-foreground">Crew: {event.crew}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionReport;