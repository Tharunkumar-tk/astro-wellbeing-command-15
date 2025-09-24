import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Download,
  Heart,
  Brain,
  Moon,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Reports = () => {
  // Mock data for charts and trends
  const moodTrendData = [
    { day: 'Mon', value: 8.2 },
    { day: 'Tue', value: 7.8 },
    { day: 'Wed', value: 8.5 },
    { day: 'Thu', value: 7.9 },
    { day: 'Fri', value: 8.8 },
    { day: 'Sat', value: 9.1 },
    { day: 'Sun', value: 8.6 }
  ];

  const stressLevelData = [
    { day: 'Mon', value: 15 },
    { day: 'Tue', value: 22 },
    { day: 'Wed', value: 18 },
    { day: 'Thu', value: 28 },
    { day: 'Fri', value: 12 },
    { day: 'Sat', value: 8 },
    { day: 'Sun', value: 14 }
  ];

  const sleepQualityData = [
    { category: 'Deep Sleep', value: 35, color: 'bg-chart-1' },
    { category: 'REM Sleep', value: 25, color: 'bg-chart-2' },
    { category: 'Light Sleep', value: 30, color: 'bg-chart-3' },
    { category: 'Awake', value: 10, color: 'bg-chart-4' }
  ];

  const dailyLogs = [
    {
      date: '2024-01-22',
      emotional: 8.5,
      physical: 7.8,
      notes: 'Completed EVA training. Feeling confident and energized.',
      status: 'nominal'
    },
    {
      date: '2024-01-21',
      emotional: 7.2,
      physical: 8.1,
      notes: 'Equipment maintenance day. Slightly fatigued but overall good.',
      status: 'nominal'
    },
    {
      date: '2024-01-20',
      emotional: 9.1,
      physical: 8.8,
      notes: 'Successful experiment completion. High morale.',
      status: 'nominal'
    },
    {
      date: '2024-01-19',
      emotional: 6.8,
      physical: 7.0,
      notes: 'Communication delay with ground. Minor stress but managed well.',
      status: 'caution'
    }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card className="data-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="metric-display">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <TrendingUp className={`h-3 w-3 ${change >= 0 ? 'text-nominal' : 'text-destructive'}`} />
          <span className={change >= 0 ? 'text-nominal' : 'text-destructive'}>
            {change >= 0 ? '+' : ''}{change}% from last week
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const SimpleChart = ({ data, type, color }: any) => {
    const maxValue = Math.max(...data.map((d: any) => d.value));
    
    return (
      <div className="space-y-2">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{item.day}</span>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const PieChart = ({ data }: any) => {
    const total = data.reduce((sum: number, item: any) => sum + item.value, 0);
    
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {data.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <div className="flex-1">
                <p className="text-xs font-medium">{item.category}</p>
                <p className="text-xs text-muted-foreground">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1 rounded-full overflow-hidden h-3">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className={item.color}
              style={{ width: `${(item.value / total) * 100}%` }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Well-being Reports</h1>
            <p className="text-sm md:text-base text-muted-foreground">Comprehensive analysis and trends</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <MetricCard
            title="Average Mood"
            value="8.4/10"
            change={5.2}
            icon={Brain}
            color="text-chart-1"
          />
          <MetricCard
            title="Stress Level"
            value="16.7%"
            change={-12.3}
            icon={Heart}
            color="text-chart-2"
          />
          <MetricCard
            title="Sleep Quality"
            value="87.2%"
            change={3.1}
            icon={Moon}
            color="text-chart-3"
          />
          <MetricCard
            title="Physical Activity"
            value="94.5%"
            change={1.8}
            icon={Activity}
            color="text-chart-4"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Mood Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-base md:text-lg">Mood Trends (Last 7 Days)</span>
              </CardTitle>
              <CardDescription className="text-sm">Daily emotional well-being scores</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleChart data={moodTrendData} type="line" color="bg-chart-1" />
            </CardContent>
          </Card>

          {/* Stress Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-base md:text-lg">Stress Levels (Last 7 Days)</span>
              </CardTitle>
              <CardDescription className="text-sm">Daily stress percentage readings</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleChart data={stressLevelData} type="bar" color="bg-chart-2" />
            </CardContent>
          </Card>

          {/* Sleep Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                <span className="text-base md:text-lg">Sleep Quality Distribution</span>
              </CardTitle>
              <CardDescription className="text-sm">Average sleep phase breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart data={sleepQualityData} />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span className="text-base md:text-lg">Physical Activity Summary</span>
              </CardTitle>
              <CardDescription className="text-sm">Exercise compliance and metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Exercise Sessions</span>
                <span className="text-sm md:text-base font-medium">6/7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Average Duration</span>
                <span className="text-sm md:text-base font-medium">45 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Resistance Training</span>
                <Badge variant="outline" className="text-nominal border-nominal">Completed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Cardio Sessions</span>
                <Badge variant="outline" className="text-nominal border-nominal">5/5</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Log Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-lg md:text-xl">Daily Log Entries</span>
            </CardTitle>
            <CardDescription className="text-sm">Personal well-being assessments and notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {dailyLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-card/50 rounded-lg border">
                  <div className={`status-indicator ${log.status} mt-2`}></div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <span className="text-sm md:text-base font-medium text-foreground">{log.date}</span>
                      <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          Emotional: <span className="font-medium text-chart-1">{log.emotional}/10</span>
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          Physical: <span className="font-medium text-chart-2">{log.physical}/10</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{log.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;