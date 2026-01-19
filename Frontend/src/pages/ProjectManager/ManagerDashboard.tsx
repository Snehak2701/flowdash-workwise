import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    FolderKanban,
    Users,
    Clock,
    CheckCircle2,
    Plus,
    TrendingUp,
    Calendar,
    FileText,
    AlertCircle,
    Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
// import { ThreeDot} from 'react-loading-indicators'; // Removed ThreeDot

// --- SKELETON LOADER COMPONENT ---
const SkeletonManagerDashboard = ({ PRIMARY_COLOR }) => {
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

    // Helper component for a team row placeholder
    const TeamRowSkeleton = () => (
        <div className="p-4 rounded-lg border border-gray-100 bg-white animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                    <div className="flex-1 space-y-1">
                        <div className="h-5 w-48 bg-gray-200 rounded"></div>
                        <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="h-10 w-10 bg-gray-200 rounded"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded"></div>
                    <div className="h-10 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-8 min-h-screen">
                {/* Skeleton Header */}
                <div className="flex items-center justify-between border-b pb-4 animate-pulse">
                    <div>
                        <div className="h-8 w-80 bg-gray-300 rounded"></div>
                        <div className="h-4 w-96 bg-gray-200 rounded mt-2"></div>
                    </div>
                    <div className="h-10 w-40 bg-blue-200 rounded-lg"></div>
                </div>

                {/* Skeleton Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>

                {/* Skeleton Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="p-6 border border-gray-200/50 shadow-sm h-[320px] animate-pulse">
                        <div className="h-5 w-48 bg-gray-200 rounded mb-4"></div>
                        <div className="h-[250px] w-full bg-gray-100 rounded-lg"></div>
                    </Card>
                    <Card className="p-6 border border-gray-200/50 shadow-sm h-[320px] animate-pulse">
                        <div className="h-5 w-48 bg-gray-200 rounded mb-4"></div>
                        <div className="h-[250px] w-full bg-gray-100 rounded-lg"></div>
                    </Card>
                </div>

                {/* Skeleton Team Overview */}
                <Card className="p-6 border border-gray-200/50 shadow-md animate-pulse">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-5 w-40 bg-gray-300 rounded"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-64 bg-gray-200 rounded"></div>
                            <div className="h-8 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <TeamRowSkeleton key={i} />
                        ))}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};
// --- END SKELETON LOADER COMPONENT ---


export default function ManagerDashboard() {
   

    const [employeeName, setEmployeeName] = useState("");
const [employeeEmail, setEmployeeEmail] = useState("");
const [employeeRole, setEmployeeRole] = useState("");
const [employeeDepartment, setEmployeeDepartment] = useState("");


    const [isCreateEmpOpen, setIsCreateEmpOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [selectedRole, setSelectedRole] = useState("ALL");

// demo: task requires this role
const taskRequiredRole = "Developer";


    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const PRIMARY_COLOR = "#0000cc";
    
    const canAssignTask = (employeeRole: string, taskRole: string) => {
  return employeeRole.toLowerCase() === taskRole.toLowerCase();
};


    useEffect(() => {
        async function fetchDashboard() {
            // Simulate a slight delay to allow the skeleton screen to be visible
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            
            try {
                
                const token = localStorage.getItem("token");
                console.log("TOKEN USED:", token);

                const res = await fetch(
  `${API_BASE_URL}/employees/dashboard`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);


                
                if (!res.ok) throw new Error("Failed to fetch dashboard data");
                const data = await res.json();
                
                // *** Using dummy data structure if the fetch is unsuccessful for component display, 
                //     you should remove this once your API is fully stable. ***
                if (!data || !data.weeklyData || !data.performanceData) {
                     setDashboardData({
                        totalEmployees: 45,
                        activeEmployees: 40,
                        totalTasks: 120,
                        completionRate: 85,
                        weeklyData: [{ day: 'Mon', hours: 8 }, { day: 'Tue', hours: 9 }, { day: 'Wed', hours: 7 }, { day: 'Thu', hours: 8 }, { day: 'Fri', hours: 10 }],
                        performanceData: [{ week: 'W1', completion: 70 }, { week: 'W2', completion: 75 }, { week: 'W3', completion: 85 }, { week: 'W4', completion: 90 }],
                        teamOverview: [
                            { id: 1, name: 'Alex Johnson', status: 'Active', role: 'Developer', tasksCompleted: 20, hoursLogged: 45, efficiency: 88 },
                            { id: 2, name: 'Maya Lee', status: 'Active', role: 'Designer', tasksCompleted: 15, hoursLogged: 40, efficiency: 92 },
                            { id: 3, name: 'Ben Wong', status: 'On Leave', role: 'Analyst', tasksCompleted: 5, hoursLogged: 10, efficiency: 50 },
                        ],
                    });
                } else {
                    setDashboardData(data);
                }
                
                setLoading(false);
            
            } 
            catch (error) {
            console.error("Dashboard fetch error:", error);
            setLoading(false);
            }



        }
        fetchDashboard();
    }, []);

    if (loading) {
        return <SkeletonManagerDashboard PRIMARY_COLOR={PRIMARY_COLOR} />;
    }
    
    // Error state (remains the same)
    if (!dashboardData) return <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-80px)] p-6">
            <Card className="w-full max-w-lg p-6 text-center border-red-500 bg-red-50 shadow-xl">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
                <CardTitle className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                    Data Loading Failed
                </CardTitle>
                <CardDescription className="text-red-800 mb-4">
                    { "We're having trouble loading the dashboard data right now. Please try refreshing the page." }
                </CardDescription>  
                <Button
                    onClick={() => window.location.reload()}
                    className="gap-2 bg-[#0000cc] hover:bg-[#0000cc]/90 text-white rounded-lg shadow-md"
                >
                    <Zap className="h-4 w-4 text-red-500" />
                    Try Refreshing
                </Button>
            </Card>
        </div>
    </Layout>

        const {
            totalEmployees,
            activeEmployees,
            totalTasks,
            completionRate,
            weeklyData,
            performanceData,
            teamOverview,
        } = dashboardData;
    
        const employeeRoleMap = (teamOverview || []).reduce((acc: any, emp: any) => {
      const key = emp.userId ?? emp.id ?? emp.email ?? emp.name;
      acc[key] = emp.role ?? emp.roleTitle ?? emp.role;
      return acc;
    }, {});
    const handleCreateEmployee = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/employees/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: employeeName,
          email: employeeEmail,
          roleTitle: employeeRole,
          department: employeeDepartment,
          password: "operator123", // default password
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create employee");
    }

    // success
    setIsCreateEmpOpen(false);
    alert("Employee created successfully");
  } catch (err: any) {
    alert(err.message);
  }
};


    return (
        <Layout>
            <div className="space-y-8 min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0000cc]">Manager Dashboard</h1>
                        <p className="text-gray-500">Manage team, track performance, and assign tasks</p>
                    </div>
                    <Dialog open={isCreateEmpOpen} onOpenChange={setIsCreateEmpOpen}>
                        <DialogTrigger asChild>
                            {/* Assuming you want a button here to trigger the dialog, 
                                as the original code had an empty DialogTrigger */}
                            <Button className="gap-2 bg-[#D70707] hover:bg-[#D70707]/90 text-white rounded-lg shadow-md">
                                <Plus className="h-4 w-4" /> Create Employee
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-xl shadow-xl">
                            <DialogHeader>
                                <DialogTitle className="text-[#0000cc]">Create New Employee</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Employee Name</Label>
                                    <Input
  value={employeeName}
  onChange={(e) => setEmployeeName(e.target.value)}
  placeholder="Enter full name"
/>

                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
  type="email"
  value={employeeEmail}
  onChange={(e) => setEmployeeEmail(e.target.value)}
  placeholder="employee@company.com"
/>

                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select onValueChange={setEmployeeRole}>
  <SelectTrigger>
    <SelectValue placeholder="Select role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Developer">Developer</SelectItem>
    <SelectItem value="Designer">Designer</SelectItem>
    <SelectItem value="Tester">Tester</SelectItem>
  </SelectContent>
</Select>

                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Select onValueChange={setEmployeeDepartment}>
  <SelectTrigger>
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Engineering">Engineering</SelectItem>
    <SelectItem value="Design">Design</SelectItem>
    <SelectItem value="Operations">Operations</SelectItem>
  </SelectContent>
</Select>

                                </div>
                                <Button
  type="button"
  onClick={handleCreateEmployee}
  className="w-full bg-[#0000cc] hover:bg-[#0000cc]/90 text-white"
>
  Create Employee
</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatsCard
                        title="Total Employees"
                        value={totalEmployees}
                        icon={Users}
                        trend={`${activeEmployees} active`}
                        trendUp={true}
                        color="primary"
                    />
                    <StatsCard
                        title="Total Tasks"
                        value={totalTasks}
                        icon={FolderKanban}
                        trend={`${completionRate}% completed`}
                        trendUp={true}
                        color="success"
                    />
                    <StatsCard
                        title="Total Hours (Week)"
                        value={weeklyData.reduce((sum: number, d: any) => sum + d.hours, 0)}
                        icon={Clock}
                        trend="Weekly logged hours"
                        trendUp={true}
                        color="warning"
                    />
                    <StatsCard
                        title="Completion Rate"
                        value={`${completionRate}%`}
                        icon={CheckCircle2}
                        trend="+ vs last week"
                        trendUp={true}
                        color="success"
                    />
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="p-6 border border-[#0000cc]/20 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-red-500" />
                            <h3 className="text-lg font-semibold text-[#0000cc]">Weekly Hours Overview</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip />
                                <Bar dataKey="hours" fill="#0000cc" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="p-6 border border-[#0000cc]/20 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="h-5 w-5 text-red-500" />
                            <h3 className="text-lg font-semibold text-[#0000cc]">Task Completion Trend</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="week" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="completion"
                                    stroke="#0000cc"
                                    strokeWidth={3}
                                    dot={{ fill: "#D70707", r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Team Overview */}
                <Card className="p-6 border border-[#0000cc]/20 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#0000cc]">Team Overview</h3>
                        <div className="flex items-center gap-2">
  <Input placeholder="Search employees..." className="w-56 border-gray-300" />
<div className="flex items-center gap-2"></div>
  <Select onValueChange={setSelectedRole} defaultValue="ALL">
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Filter by role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ALL">All Roles</SelectItem>
      <SelectItem value="Developer">Developer</SelectItem>
      <SelectItem value="Designer">Designer</SelectItem>
      <SelectItem value="Tester">Tester</SelectItem>
    </SelectContent>
  </Select>
</div>

                    </div>

                    <div className="space-y-4">
                        {teamOverview.filter((emp: any) =>
    selectedRole === "ALL" ? true : emp.role === selectedRole
  ).map((emp: any) => {
  const taskRequiredRole = "Developer"; // demo purpose

  const allowed = canAssignTask(emp.role, taskRequiredRole);

  return (
    <div
      key={emp.id}
      className={`p-4 rounded-lg border transition-all ${
        allowed
          ? "border-blue-400 bg-blue-50"
          : "border-gray-200 bg-gray-50 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{emp.name}</h4>
         <p className="text-sm text-gray-500">{emp.roleTitle}</p>

        </div>

        <Button
          disabled={!allowed}
          className={`${
            allowed
              ? "bg-[#0000cc] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Assign Task
        </Button>
      </div>
    </div>
  );
})}

                    </div>
                </Card>
            </div>
        </Layout>
    );
}