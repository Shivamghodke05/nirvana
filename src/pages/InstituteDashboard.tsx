
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Moon,
  Sun,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface InstituteUser {
  name: string;
  institution: string;
}

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<InstituteUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);

    // User data setup
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth');
  };

  const stats = [
    {
      title: "Active Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      description: "Monthly active students",
    },
    {
      title: "Chat Sessions",
      value: "18,392",
      change: "+8.2%",
      trend: "up", 
      icon: MessageCircle,
      description: "AI conversations this month",
    },
    {
      title: "Counselor Bookings",
      value: "1,234",
      change: "+15.7%",
      trend: "up",
      icon: Calendar,
      description: "Professional sessions booked",
    },
    {
      title: "Crisis Interventions",
      value: "23",
      change: "-5.3%",
      trend: "down",
      icon: AlertTriangle,
      description: "Emergency referrals made",
    },
  ];

  const mentalHealthTrends = [
    { category: "Anxiety", percentage: 68, count: 1937, trend: "up" },
    { category: "Academic Stress", percentage: 52, count: 1481, trend: "up" },
    { category: "Depression", percentage: 34, count: 968, trend: "stable" },
    { category: "Sleep Issues", percentage: 45, count: 1281, trend: "up" },
    { category: "Social Anxiety", percentage: 29, count: 826, trend: "down" },
    { category: "Relationship Issues", percentage: 23, count: 655, trend: "stable" },
  ];

  const recentActivity = [
    {
      type: "session",
      message: "New counseling session booked",
      time: "2 minutes ago",
      status: "success",
    },
    {
      type: "crisis",
      message: "Crisis intervention activated",
      time: "15 minutes ago", 
      status: "warning",
    },
    {
      type: "feedback",
      message: "Positive feedback received",
      time: "32 minutes ago",
      status: "success",
    },
    {
      type: "registration",
      message: "New user registration",
      time: "1 hour ago",
      status: "info",
    },
  ];

  const usageMetrics = [
    { feature: "AI Chatbot", usage: 85, sessions: "18.4k" },
    { feature: "Resource Library", usage: 62, sessions: "12.1k" },
    { feature: "Counselor Booking", usage: 43, sessions: "8.7k" },
    { feature: "Self-Assessment", usage: 38, sessions: "7.2k" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/10 text-success border-success/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "info":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          {user ? (
            <>
              <h1 className="text-3xl font-bold text-foreground">Welcome, {user.name}</h1>
              <p className="text-lg text-muted-foreground">{user.institution}</p>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-foreground">Institute Dashboard</h1>
          )}
           <p className="text-muted-foreground mt-2">
            Anonymous insights into student mental health trends and platform usage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-primary"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getTrendIcon(stat.trend)}
                  <span>{stat.change} from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
          <TabsTrigger value="trends">Mental Health Trends</TabsTrigger>
          <TabsTrigger value="usage">Platform Usage</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Mental Health Issues Reported
                </CardTitle>
                <CardDescription>
                  Distribution of mental health concerns among students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentalHealthTrends.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(item.trend)}
                        <span className="text-sm text-muted-foreground">
                          {item.count} students
                        </span>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-secondary" />
                  Wellness Indicators
                </CardTitle>
                <CardDescription>
                  Positive mental health metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20">
                  <div>
                    <p className="font-medium text-success">Sessions Completed</p>
                    <p className="text-sm text-muted-foreground">Weekly average</p>
                  </div>
                  <div className="text-2xl font-bold text-success">94%</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div>
                    <p className="font-medium text-primary">Satisfaction Score</p>
                    <p className="text-sm text-muted-foreground">User feedback rating</p>
                  </div>
                  <div className="text-2xl font-bold text-primary">4.8/5</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <div>
                    <p className="font-medium text-secondary">Crisis Prevention</p>
                    <p className="text-sm text-muted-foreground">Early intervention success</p>
                  </div>
                  <div className="text-2xl font-bold text-secondary">87%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Feature Usage Analytics</CardTitle>
              <CardDescription>
                How students are engaging with different platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {usageMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{metric.feature}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {metric.sessions} sessions
                      </span>
                      <span className="text-sm font-medium">{metric.usage}%</span>
                    </div>
                  </div>
                  <Progress value={metric.usage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Recent Platform Activity
              </CardTitle>
              <CardDescription>
                Real-time updates and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-success' :
                      activity.status === 'warning' ? 'bg-warning' : 'bg-primary'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
