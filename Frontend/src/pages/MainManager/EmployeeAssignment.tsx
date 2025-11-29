import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  ArrowRight,
  ClipboardList,
  Zap,
  List,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
// Removed ThreeDot import

// --- DUMMY STATIC DATA (for new employees) ---
const DUMMY_NEW_EMPLOYEES = [
  {
    id: 101,
    name: "Daniel Smith",
    role: "Frontend Developer",
    department: "Engineering",
    email: "daniel.s@comp.com",
  },
  {
    id: 102,
    name: "Emily Clark",
    role: "UX Designer",
    department: "Design",
    email: "emily.c@comp.com",
  },
  {
    id: 103,
    name: "Fiona Gale",
    role: "Data Analyst",
    department: "Product",
    email: "fiona.g@comp.com",
  },
];

// Helper component for Manager/Employee details
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Icon className="h-4 w-4 text-red-500" />
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);
const backendUrl = import.meta.env.VITE_API_BASE_URL;

// --- NEW SKELETON LOADER COMPONENT ---
const SkeletonAssignmentDashboard = ({ PRIMARY_COLOR, ACCENT_RED }) => {
  // Replicating the structure of the two main columns
  const ManagerSkeletonCard = () => (
    <Card className="p-4 border border-gray-100 shadow-sm animate-pulse h-40">
      <div className="flex justify-between pb-2">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex justify-between border-b pb-2">
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
          <div className="h-5 w-10 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-full bg-gray-200 rounded-md"></div>
        <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
      </div>
    </Card>
  );

  const EmployeeSkeletonCard = () => (
    <Card className="p-4 border border-gray-100 shadow-sm flex items-center justify-between animate-pulse h-24">
      <div className="space-y-2">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-3 w-40 bg-gray-100 rounded"></div>
      </div>
      <div className="h-8 w-20 bg-blue-200/50 rounded-md"></div>
    </Card>
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
          <div className="h-10 w-48 bg-red-200 rounded-lg"></div>
        </div>

        {/* Skeleton Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. New Employees Skeleton Column */}
          <Card className="p-6 col-span-1 border border-red-500/40 shadow-xl bg-red-50/50">
            <div className="flex items-center gap-2 mb-4 border-b pb-3 animate-pulse">
              <UserPlus className="h-6 w-6 text-red-400" />
              <div className="h-6 w-48 bg-red-200 rounded"></div>
            </div>
            <div className="space-y-4 max-h-[600px] pr-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <EmployeeSkeletonCard key={i} />
              ))}
            </div>
          </Card>

          {/* 2. Manager List Skeleton Column */}
          <Card
            className={`p-6 lg:col-span-2 border border-[${PRIMARY_COLOR}]/40 shadow-xl bg-blue-50/50`}
          >
            <div className="flex items-center gap-2 mb-4 border-b pb-3 animate-pulse">
              <Users className="h-6 w-6 text-blue-400" />
              <div className="h-6 w-64 bg-blue-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] pr-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <ManagerSkeletonCard key={i} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
export default function AssignmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [newEmployees, setNewEmployees] = useState(DUMMY_NEW_EMPLOYEES);
  const [managers, setManagers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const token = localStorage.getItem("token");

  const PRIMARY_COLOR = "#0000cc";
  const ACCENT_RED = "#D70707";
  const MAX_TEAM_CAPACITY = 10;

  // Data Transformation and Fetching functions remain the same
  const transformManagerData = (apiManagers) => {
    return apiManagers.map((manager) => {
      const teamMembers = manager.user.ManagerEmployees.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.roleTitle,
        isNew: false,
      }));

      const managerId = manager.user.id;

      return {
        id: managerId,
        name: manager.name,
        role: manager.roleTitle,
        department: manager.department,
        teamSize: teamMembers.length,
        maxCapacity: MAX_TEAM_CAPACITY,
        teamMembers: teamMembers,
        isExpanded: false,
      };
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/projectManager/Manager_employee_list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const transformedManagers = transformManagerData(res.data.managers);
      setManagers(transformedManagers);
    } catch (error) {
      console.error("Error fetching Manager Employee List:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Loading State Renderer (UPDATED) ---
  if (loading) {
    return (
      <SkeletonAssignmentDashboard
        PRIMARY_COLOR={PRIMARY_COLOR}
        ACCENT_RED={ACCENT_RED}
      />
    );
  }

  // Core Dashboard Logic (toggleManagerExpansion, handleAssignEmployee, openAssignmentDialog) remains the same

  const toggleManagerExpansion = (managerId) => {
    setManagers(
      managers.map((m) =>
        m.id === managerId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  const handleAssignEmployee = () => {
    if (!selectedEmployee || !selectedManagerId) return;

    const managerId = selectedManagerId;

    const managerIndex = managers.findIndex((m) => m.id === managerId);
    const targetManager = managers[managerIndex];

    if (targetManager.teamSize >= targetManager.maxCapacity) {
      alert(
        `Assignment failed: ${targetManager.name} is already at max capacity!`
      );
      return;
    }

    const updatedManagers = [...managers];
    updatedManagers[managerIndex] = {
      ...targetManager,
      teamSize: targetManager.teamSize + 1,
      teamMembers: [
        ...targetManager.teamMembers,
        {
          id: selectedEmployee.id,
          name: selectedEmployee.name,
          role: selectedEmployee.role,
          isNew: true,
        },
      ],
    };
    setManagers(updatedManagers);

    // TODO: AXIOS POST CALL FOR ASSIGNMENT GOES HERE

    const updatedEmployees = newEmployees.filter(
      (emp) => emp.id !== selectedEmployee.id
    );
    setNewEmployees(updatedEmployees);

    setIsDialogOpen(false);
    setSelectedEmployee(null);
    setSelectedManagerId("");
  };

  const openAssignmentDialog = (employee) => {
    setSelectedEmployee(employee);
    setSelectedManagerId("");
    setIsDialogOpen(true);
  };

  // Manager Card component
  const ManagerCard = ({ manager }) => {
    const isFull = manager.teamSize >= manager.maxCapacity;

    return (
      <Card
        className={`p-4 border ${
          manager.isExpanded ? `border-[${PRIMARY_COLOR}]` : "border-gray-200"
        } hover:shadow-md transition-all shadow-sm`}
      >
        <CardHeader className="flex flex-row items-start justify-between p-0 pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold text-gray-800">
              {manager.name}
            </CardTitle>
            <p className="text-sm text-gray-500">{manager.role}</p>
          </div>
          <Badge
            className={`font-semibold`}
            style={{ backgroundColor: PRIMARY_COLOR, color: "white" }}
          >
            Manager
          </Badge>
        </CardHeader>

        <CardContent className="p-0 space-y-3 pt-2">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-gray-700">Team Size:</span>
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: isFull ? ACCENT_RED : PRIMARY_COLOR }}
            >
              {manager.teamSize} / {manager.maxCapacity}{" "}
              {isFull && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  FULL
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => toggleManagerExpansion(manager.id)}
            className="w-full justify-start h-8 text-sm text-gray-700 "
          >
            <List className="h-4 w-4 mr-2" style={{ color: PRIMARY_COLOR }} />
            View Team Members ({manager.teamMembers.length})
            <ChevronDown
              className={`h-4 w-4 ml-auto transition-transform ${
                manager.isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>

          {manager.isExpanded && (
            <div className="mt-3 p-3 border rounded-lg bg-white max-h-40 overflow-y-auto space-y-1">
              {manager.teamMembers.length > 0 ? (
                manager.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between text-xs p-1 rounded-sm hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-800 flex items-center">
                      {member.isNew && (
                        <Zap className="h-3 w-3 mr-1 text-red-500" />
                      )}
                      {member.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-600"
                    >
                      {member.role}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  No members in this team yet.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // New Employee Card component
  const EmployeeCard = ({ employee }) => (
    <Card className="p-4 border border-red-200 hover:border-red-500/40 transition-all shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {employee.name}
        </CardTitle>
        <DetailItem icon={ClipboardList} label="Role" value={employee.role} />
        <DetailItem
          icon={Users}
          label="Department"
          value={employee.department}
        />
      </div>
      <Button
        onClick={() => openAssignmentDialog(employee)}
        className={`flex items-center gap-1 text-white shadow-md hover:opacity-90`}
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <ArrowRight className="h-4 w-4" />
        Assign
      </Button>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: PRIMARY_COLOR }}>
              Employee Assignment Dashboard
            </h1>
            <p className="text-gray-500">
              Assign new employees to the appropriate team manager after
              reviewing team capacity.
            </p>
          </div>
          <Button
            className={`gap-2 text-white rounded-lg shadow-md hover:opacity-90`}
            style={{ backgroundColor: ACCENT_RED }}
          >
            <UserPlus className="h-4 w-4" />
            New Assignments ({newEmployees.length})
          </Button>
        </div>

        {/* --- Main Dashboard Content: Columns --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. New Employees Column (Source - Red/Accent) */}
          <Card className="p-6 col-span-1 border border-red-500/40 shadow-xl bg-red-50">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <UserPlus className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-600">
                New Joiners ({newEmployees.length})
              </h2>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {newEmployees.length > 0 ? (
                newEmployees.map((emp) => (
                  <EmployeeCard key={emp.id} employee={emp} />
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-green-300">
                  <Zap className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-green-700">
                    All new employees have been assigned!
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ready for the next batch.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* 2. Manager List Column (Target - Blue/Primary) */}
          <Card
            className={`p-6 lg:col-span-2 border border-[${PRIMARY_COLOR}]/40 shadow-xl bg-blue-50`}
          >
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <Users className="h-6 w-6" style={{ color: PRIMARY_COLOR }} />
              <h2
                className="text-xl font-bold"
                style={{ color: PRIMARY_COLOR }}
              >
                Available Managers ({managers.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {managers.length > 0 ? (
                managers.map((manager) => (
                  <ManagerCard key={manager.id} manager={manager} />
                ))
              ) : (
                <div className="col-span-full text-center p-8 bg-white rounded-lg border border-gray-300">
                  <List className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-700">
                    No Managers Reporting to you Found.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Please check your system configuration.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* --- Assignment Dialog (Modal) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white rounded-xl shadow-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: PRIMARY_COLOR }}>
              Assign Employee to Manager
            </DialogTitle>
            <CardDescription className="pt-2">
              Confirm the manager for **{selectedEmployee?.name}** (
              {selectedEmployee?.role}).
            </CardDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 rounded-md border bg-gray-50">
              <span className="font-medium text-gray-700">Employee:</span>
              <Badge className="bg-red-100 text-red-700 border border-red-300">
                {selectedEmployee?.name}
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select Manager
              </label>
              <Select
                onValueChange={setSelectedManagerId}
                value={selectedManagerId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a manager to assign to" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem
                      key={manager.id}
                      value={manager.id}
                      disabled={manager.teamSize >= manager.maxCapacity}
                    >
                      {manager.name} ({manager.role}) - Team Size:{" "}
                      {manager.teamSize}/{manager.maxCapacity}
                      {manager.teamSize >= manager.maxCapacity && " (Full)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignEmployee}
              disabled={!selectedManagerId}
              className={`gap-2 text-white shadow-md`}
              style={{
                backgroundColor: PRIMARY_COLOR,
                opacity: selectedManagerId ? 1 : 0.6,
              }}
            >
              <ArrowRight className="h-4 w-4" />
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
