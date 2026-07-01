import "./Dashboard.css";
import { Users, Activity, CircleCheck } from "lucide-react";

import { useGetUsersQuery } from "../../api_service/employees/employee.api";
import { useGetCyclesQuery } from "../../api_service/cycle/cycle.api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Cycle {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: "Initiated" | "Completed" | "In Progress";
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useGetUsersQuery() as {
    data: User[];
    isLoading: boolean;
    isError: boolean;
  };

  const {
    data: cycles = [],
    isLoading: cyclesLoading,
    isError: cyclesError,
  } = useGetCyclesQuery() as {
    data: Cycle[];
    isLoading: boolean;
    isError: boolean;
  };

  if (usersLoading || cyclesLoading) {
    return <div className="reporting-page">Loading...</div>;
  }

  if (usersError || cyclesError) {
    return (
      <div className="reporting-page">
        Failed to load dashboard data.
      </div>
    );
  }

  const totalEmployees = users.length;

  const activeCycles = cycles.filter(
    (cycle) => cycle.status !== "Completed"
  ).length;

  const completedCycles = cycles.filter(
    (cycle) => cycle.status === "Completed"
  ).length;

  const completionRate =
    cycles.length === 0
      ? 0
      : Math.round((completedCycles / cycles.length) * 100);

  return (
    <div className="reporting-page">
      <div className="reporting-header">
        <div>
          <h2>Reporting & Analytics</h2>
          <p>
            Monitor organization-wide performance and appraisal progress.
          </p>
        </div>

        <button className="export-btn">Export PDF</button>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon employee-icon">
            <Users size={18} />
          </div>

          <p className="card-title">TOTAL EMPLOYEES</p>

          <h2>{totalEmployees}</h2>

          <span className="card-subtitle">
            Registered employees
          </span>
        </div>

        <div className="analytics-card">
          <div className="card-icon cycle-icon">
            <Activity size={18} />
          </div>

          <p className="card-title">ACTIVE CYCLES</p>

          <h2>{activeCycles}</h2>

          <span className="card-subtitle">
            Currently running
          </span>
        </div>

        <div className="analytics-card">
          <div className="card-icon completion-icon">
            <CircleCheck size={18} />
          </div>

          <p className="card-title">COMPLETION RATE</p>

          <h2>{completionRate}%</h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <span className="card-subtitle">
            {completedCycles} of {cycles.length} cycles completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;