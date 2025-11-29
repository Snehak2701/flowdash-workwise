import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
// import { ThreeDot } from "react-loading-indicators"; // Removed ThreeDot

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Task {
  id: string;
  title: string;
  project?: string;
  status: "TODO" | "WORKING" | "STUCK" | "DONE";
  hoursAllocated?: number;
  hoursUsed?: number;
  dueDate?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  stuckTasks: number;
  completionRate: number;
  completionTrend: { week: string; rate: number }[];
}

const COLOR_PRIMARY = "#0000cc";
const COLOR_ACCENT_ICON = "text-red-500";
const COLOR_SUCCESS = "#10b981";
const COLOR_WARNING = "#f97316";

// --- SKELETON LOADER COMPONENT ---

const SkeletonOperatorDashboard = ({ PRIMARY_COLOR, ACCENT_ICON }) => {
  // Helper component for a stat card placeholder
  const StatCardSkeleton = () => (
    <Card className="p-4 border border-gray-100 shadow-sm h-28 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
          <div className="h-6 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="h-3 w-32 bg-gray-100 rounded mt-3"></div>
    </Card>
  );

  // Helper component for a task list item placeholder
  const TaskRowSkeleton = () => (
    <div className="p-4 rounded-lg border border-gray-200 bg-white animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
            <div className="h-5 w-12 bg-gray-100 rounded-full"></div>
            <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="h-4 w-20 bg-gray-100 rounded"></div>
            <div className="h-4 w-24 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="h-5 w-20 bg-blue-200 rounded"></div>
      </div>
      <div className="space-y-1">
        <div className="h-2 w-full bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8 min-h-screen">
        {/* Skeleton Header */}
        <div className="border-b pb-4 animate-pulse">
          <div className="h-8 w-80 bg-gray-300 rounded mb-1"></div>
          <div className="h-4 w-96 bg-gray-200 rounded"></div>
        </div>

        {/* Skeleton Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Skeleton Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Hours Chart Skeleton */}
          <Card className={`p-6 border-gray-200 shadow-sm h-96 animate-pulse`}>
            <CardHeader className="p-0 mb-4">
              <div className="h-5 w-48 bg-gray-300 rounded"></div>
            </CardHeader>
            <div className="h-72 w-full bg-gray-100 rounded-lg"></div>
          </Card>

          {/* Completion Trend Chart Skeleton */}
          <Card className={`p-6 border-gray-200 shadow-sm h-96 animate-pulse`}>
            <CardHeader className="p-0 mb-4">
              <div className="h-5 w-48 bg-gray-300 rounded"></div>
            </CardHeader>
            <div className="h-72 w-full bg-gray-100 rounded-lg"></div>
          </Card>
        </div>

        {/* Assigned Tasks List Skeleton */}
        <Card className={`p-6 shadow-lg border-gray-200 animate-pulse`}>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <div className="h-6 w-52 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <TaskRowSkeleton key={i} />
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};
// --- END SKELETON LOADER COMPONENT ---

export default function OperatorDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    // Simulating a slight delay to allow the skeleton screen to be visible
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/Dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { tasks, stats } = response.data;
      setTasks(tasks);
      setStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const getStatusBadgeStyles = (status: Task["status"]) => {
    switch (status) {
      case "WORKING":
        return `bg-amber-100 text-amber-700 border-amber-300`;
      case "DONE":
        return `bg-green-100 text-green-700 border-green-300`;
      case "TODO":
        return `bg-gray-100 text-gray-700 border-gray-300`;
      case "STUCK":
        return `bg-red-100 text-red-700 border-red-300`;
      default:
        return `bg-gray-100 text-gray-700`;
    }
  };

  const getPriorityBadgeStyles = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return `bg-red-600 text-white`;
      case "MEDIUM":
        return `bg-amber-500 text-white`;
      case "LOW":
        // Using Primary Blue for Low Priority
        return `bg-[${COLOR_PRIMARY}] text-white`;
      default:
        return `bg-gray-500 text-white`;
    }
  };

  if (loading) {
    // Renders the new Skeleton Dashboard component
    return (
      <SkeletonOperatorDashboard
        PRIMARY_COLOR={COLOR_PRIMARY}
        ACCENT_ICON={COLOR_ACCENT_ICON}
      />
    );
  }

  const customTooltipStyle = {
    backgroundColor: "white",
    border: `1px solid ${COLOR_PRIMARY}`,
    borderRadius: "0.5rem",
    padding: "5px 10px",
  };

  // Calculate total hours for chart (you can enhance to fetch from backend later)
  const weeklyHoursLogged = tasks.reduce(
    (sum, t) => sum + (t.hoursUsed || 0),
    0
  );

  return (
    <Layout>
      <div className="space-y-8 min-h-screen">
        {/* Header */}
        <div className="border-b pb-4">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: COLOR_PRIMARY }}
          >
            My Task Performance Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome, John Doe • Today:{" "}
            {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* Note: Assuming StatsCard props handle the custom color display logic */}
          <StatsCard
            title="Total Tasks"
            value={stats?.totalTasks || 0}
            icon={FileText}
            trend={`${stats?.completedTasks || 0} completed`}
            trendUp={true}
            color="primary"
          />
          <StatsCard
            title="In Progress"
            value={stats?.inProgressTasks || 0}
            icon={Clock}
            trend={`${stats?.pendingTasks || 0} pending`}
            trendUp={false}
            color="warning"
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats?.completionRate || 0}%`}
            icon={CheckCircle2}
            trend="Up 3% from last week"
            trendUp={true}
            color="success"
          />
          <StatsCard
            title="Total Hours Logged"
            value={`${weeklyHoursLogged}h`}
            icon={Calendar}
            trend="This Week"
            trendUp={true}
            color="primary"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Hours Chart */}
          <Card
            className={`p-6 border-[#0000cc]/20 shadow-sm hover:shadow-md transition-all`}
          >
            <CardHeader className="p-0 mb-4">
              <CardTitle
                className="text-xl flex items-center gap-2"
                style={{ color: COLOR_PRIMARY }}
              >
                <Clock className={`h-5 w-5 ${COLOR_ACCENT_ICON}`} />
                Weekly Hours Breakdown
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={tasks.map((t, i) => ({
                  title:
                    t.title.substring(0, 15) +
                    (t.title.length > 15 ? "..." : ""),
                  hours: t.hoursUsed || 0,
                }))}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="title" stroke="#666" />
                <YAxis stroke="#666" domain={[0, 10]} />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value, name, props) => [
                    `${value} hours`,
                    props.payload.title,
                  ]}
                  labelFormatter={() => "Task"}
                />
                <Bar
                  dataKey="hours"
                  fill={COLOR_PRIMARY}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Completion Trend Chart */}
          <Card
            className={`p-6 border-[#0000cc]/20 shadow-sm hover:shadow-md transition-all`}
          >
            <CardHeader className="p-0 mb-4">
              <CardTitle
                className="text-xl flex items-center gap-2"
                style={{ color: COLOR_PRIMARY }}
              >
                <TrendingUp className={`h-5 w-5 ${COLOR_ACCENT_ICON}`} />
                Task Completion Trend
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats?.completionTrend || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="week" stroke="#666" />
                <YAxis stroke="#666" domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value) => [`${value}%`, "Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke={COLOR_SUCCESS}
                  strokeWidth={3}
                  dot={{ fill: COLOR_SUCCESS, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Assigned Tasks List */}
        <Card className={`p-6 shadow-lg border-[#0000cc]/20`}>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3
              className="text-xl font-semibold flex items-center gap-2"
              style={{ color: COLOR_PRIMARY }}
            >
              <Target className={`h-5 w-5 ${COLOR_ACCENT_ICON}`} />
              My Assigned Tasks (
              {stats?.inProgressTasks! + stats?.pendingTasks! || 0} Active)
            </h3>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-[#0000cc]" />
                <p className="font-medium">
                  No tasks currently assigned to you.
                </p>
              </div>
            ) : (
              tasks.map((task) => {
                const progress =
                  task.hoursUsed && task.hoursAllocated
                    ? (task.hoursUsed / task.hoursAllocated) * 100
                    : 0;

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-[#0000cc]/40 transition-all bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-800">
                            {task.title}
                          </h4>
                          <Badge
                            variant="default"
                            className={getStatusBadgeStyles(task.status)}
                          >
                            {task.status}
                          </Badge>
                          <Badge
                            variant="default"
                            className={`capitalize ${getPriorityBadgeStyles(
                              task.priority
                            )}`}
                          >
                            {task.priority.toLowerCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {task.project && (
                            <span className="font-medium text-blue-600">
                              {task.project}
                            </span>
                          )}
                          {(task.hoursUsed !== undefined ||
                            task.hoursAllocated !== undefined) && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.hoursUsed || 0}/{task.hoursAllocated || "?"}
                              h Used
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {task.status !== "DONE" && (
                          <button
                            className="transition-colors text-sm font-semibold"
                            style={{ color: COLOR_PRIMARY }}
                          >
                            Start/Update
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span
                          className="font-semibold"
                          style={{ color: COLOR_PRIMARY }}
                        >
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className={`h-2 bg-gray-200`}
                        style={
                          {
                            // Custom color for the progress bar fill
                            "--progress-color":
                              task.status === "DONE"
                                ? COLOR_SUCCESS
                                : COLOR_PRIMARY,
                            backgroundColor: "#e2e8f0", // Background of progress bar
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Pending Tasks Reminder */}
        {stats?.pendingTasks! > 0 && (
          <Card className={`p-4 bg-amber-50 border-amber-300 shadow-sm`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-5 w-5 text-amber-600`} />
              <div className="flex-1">
                <p className={`font-medium text-amber-700`}>
                  Pending Tasks Reminder
                </p>
                <p className="text-sm text-gray-600">
                  You have <strong>{stats?.pendingTasks}</strong> task(s) that
                  need attention to meet deadlines.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
