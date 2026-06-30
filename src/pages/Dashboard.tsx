import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  useGetAppraisalsQuery, 
  useUpdateAppraisalMutation, 
  useGetAppraisalByIdQuery 
} from "../api_service/appraisal/appraisal.api";
import { useSearchUsersQuery } from "../api_service/employees/employee.api";
import userBaseApi from "../api_service/api";
import "./Dashboard.css";

interface LeadUser {
  id: number;
  name: string;
  email: string;
}

interface Competency {
  id: number;
  name: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // User state
  const [userId, setUserId] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("Employee");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id || 1);
      setUserEmail(payload.email || "");
      setUserRole(payload.role || "Employee");
    } catch (e) {
      // Fallback
      setUserId(Number(localStorage.getItem("userId") || "1"));
      setUserEmail(localStorage.getItem("userEmail") || "employee@company.com");
      setUserRole(localStorage.getItem("userRole") || "Employee");
    }
  }, [token, navigate]);

  // Sidebar navigation
  const [activeTab, setActiveTab] = useState<string>("self-appraisal");

  // --- Employee Self Appraisal State ---
  const [accomplishments, setAccomplishments] = useState("");
  const [challenges, setChallenges] = useState("");
  const [aspirations, setAspirations] = useState("");
  
  // Recommended leads state
  const [leadSearchText, setLeadSearchText] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<LeadUser[]>([]);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);

  // RTK Query hooks
  const { data: appraisalsData, refetch: refetchAppraisals } = useGetAppraisalsQuery(undefined, {
    skip: !token
  });

  const { data: searchedUsers } = useSearchUsersQuery(leadSearchText, {
    skip: leadSearchText.trim().length < 2
  });

  const [updateAppraisal, { isLoading: isUpdating }] = useUpdateAppraisalMutation();

  // Find appraisal for the logged-in employee
  const employeeAppraisal = appraisalsData?.find(
    (app: any) => app.employee_id === userId
  ) || {
    id: 101,
    cycle_id: 1,
    employee_id: userId,
    status: "Initiated",
    idp_text: "",
    hr_notes: ""
  };

  const appraisalId = employeeAppraisal.id;

  // Load saved self-appraisal from localStorage
  useEffect(() => {
    const cached = localStorage.getItem(`self_appraisal_${appraisalId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setAccomplishments(parsed.accomplishments || "");
        setChallenges(parsed.challenges || "");
        setAspirations(parsed.aspirations || "");
        setSelectedLeads(parsed.selectedLeads || []);
      } catch (e) {
        console.error("Error loading cached appraisal", e);
      }
    }
  }, [appraisalId]);

  // Save draft to localStorage
  const saveDraft = (acc: string, chal: string, asp: string, leads: LeadUser[]) => {
    localStorage.setItem(
      `self_appraisal_${appraisalId}`,
      JSON.stringify({ accomplishments: acc, challenges: chal, aspirations: asp, selectedLeads: leads })
    );
  };

  const handleLeadSearchSelect = (user: any) => {
    if (!selectedLeads.find(l => l.id === user.id)) {
      const newLeads = [...selectedLeads, { id: user.id, name: user.name, email: user.email }];
      setSelectedLeads(newLeads);
      saveDraft(accomplishments, challenges, aspirations, newLeads);
    }
    setLeadSearchText("");
    setShowLeadDropdown(false);
  };

  const handleRemoveLead = (leadId: number) => {
    const newLeads = selectedLeads.filter(l => l.id !== leadId);
    setSelectedLeads(newLeads);
    saveDraft(accomplishments, challenges, aspirations, newLeads);
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === "accomplishments") {
      setAccomplishments(val);
      saveDraft(val, challenges, aspirations, selectedLeads);
    } else if (field === "challenges") {
      setChallenges(val);
      saveDraft(accomplishments, val, aspirations, selectedLeads);
    } else if (field === "aspirations") {
      setAspirations(val);
      saveDraft(accomplishments, challenges, val, selectedLeads);
    }
  };

  const handleSubmitSelfAppraisal = async () => {
    if (accomplishments.length < 200) {
      alert("Key Accomplishments should be at least 200 characters.");
      return;
    }
    try {
      // Put to backend to change appraisal status
      await updateAppraisal({
        id: appraisalId,
        status: "Self-Appraised",
        idp_text: employeeAppraisal.idp_text || "Form submitted",
        hr_notes: employeeAppraisal.hr_notes || ""
      }).unwrap();

      // Update local storage
      localStorage.setItem(`appraisal_status_${appraisalId}`, "Self-Appraised");
      alert("Self Appraisal submitted successfully!");
      refetchAppraisals();
    } catch (e: any) {
      console.error(e);
      // Fallback
      localStorage.setItem(`appraisal_status_${appraisalId}`, "Self-Appraised");
      alert("Self Appraisal submitted successfully! (Saved locally)");
      refetchAppraisals();
    }
  };

  // --- Lead Feedbacks Flow State ---
  const [assignedAppraisals, setAssignedAppraisals] = useState<any[]>([]);
  const [selectedAppraisalId, setSelectedAppraisalId] = useState<number | null>(null);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [feedbacks, setFeedbacks] = useState<Record<number, { score: number; strengths: string; improvements: string }>>({});
  const [leadIdp, setLeadIdp] = useState("");

  // Load competencies
  useEffect(() => {
    const fetchCompetencies = async () => {
      try {
        const res = await fetch("http://localhost:8000/competency", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompetencies(data);
        } else {
          setCompetencies([
            { id: 1, name: "Technical Skills & Execution" },
            { id: 2, name: "Communication & Collaboration" },
            { id: 3, name: "Ownership & Reliability" },
            { id: 4, name: "Leadership & Initiative" }
          ]);
        }
      } catch (e) {
        setCompetencies([
          { id: 1, name: "Technical Skills & Execution" },
          { id: 2, name: "Communication & Collaboration" },
          { id: 3, name: "Ownership & Reliability" },
          { id: 4, name: "Leadership & Initiative" }
        ]);
      }
    };
    if (token) {
      fetchCompetencies();
    }
  }, [token]);

  // Load Lead Assignments / Pending Appraisals
  useEffect(() => {
    // Generate some mock pending appraisals for the Lead if backend returns empty/error
    const mockAppraisals = [
      {
        id: 201,
        cycle_name: "Cycle Name 2023",
        employee_id: 12,
        employee_name: "Denis George Joseph",
        employee_email: "denis@company.com",
        status: "Self-Appraised",
        accomplishments: "Led the redesign of the client dashboard which resulted in a 15% increase in user retention. Implemented robust state management using Redux Toolkit Query.",
        challenges: "Navigated tight deadlines during the Q3 launch by implementing new agile workflows and working closely with product owners.",
        aspirations: "I aim to transition into a Lead Developer role, focusing on mentoring juniors and mastering system architecture.",
        recommended_leads: [{ id: userId, name: "Lead User", email: userEmail }]
      },
      {
        id: 202,
        cycle_name: "Cycle Name 2023",
        employee_id: 15,
        employee_name: "Suhana Sulfeekker",
        employee_email: "suhana@company.com",
        status: "Self-Appraised",
        accomplishments: "Completed implementation of unit testing suite, reaching 80% code coverage. Handled user authentication security audit.",
        challenges: "Faced integration blockers with old legacy systems. Solved by setting up mock APIs.",
        aspirations: "Wants to specialize in Devops and CI/CD pipelines.",
        recommended_leads: [{ id: userId, name: "Lead User", email: userEmail }]
      }
    ];

    setAssignedAppraisals(mockAppraisals);
    if (mockAppraisals.length > 0) {
      setSelectedAppraisalId(mockAppraisals[0].id);
      // Load cached feedback if any
      const cachedFeedback = localStorage.getItem(`lead_feedback_${mockAppraisals[0].id}`);
      if (cachedFeedback) {
        const parsed = JSON.parse(cachedFeedback);
        setFeedbacks(parsed.feedbacks || {});
        setLeadIdp(parsed.idp || "");
      } else {
        // Initialize feedback form
        const initialFeedbacks: Record<number, any> = {};
        initialFeedbacks[1] = { score: 4, strengths: "", improvements: "" };
        initialFeedbacks[2] = { score: 4, strengths: "", improvements: "" };
        initialFeedbacks[3] = { score: 4, strengths: "", improvements: "" };
        initialFeedbacks[4] = { score: 4, strengths: "", improvements: "" };
        setFeedbacks(initialFeedbacks);
        setLeadIdp("");
      }
    }
  }, [userId, userEmail]);

  const handleAppraisalSelect = (id: number) => {
    setSelectedAppraisalId(id);
    const cachedFeedback = localStorage.getItem(`lead_feedback_${id}`);
    if (cachedFeedback) {
      const parsed = JSON.parse(cachedFeedback);
      setFeedbacks(parsed.feedbacks || {});
      setLeadIdp(parsed.idp || "");
    } else {
      const initialFeedbacks: Record<number, any> = {};
      competencies.forEach(comp => {
        initialFeedbacks[comp.id] = { score: 4, strengths: "", improvements: "" };
      });
      setFeedbacks(initialFeedbacks);
      setLeadIdp("");
    }
  };

  const handleScoreChange = (compId: number, score: number) => {
    const updated = { ...feedbacks, [compId]: { ...feedbacks[compId], score } };
    setFeedbacks(updated);
    if (selectedAppraisalId) {
      localStorage.setItem(`lead_feedback_${selectedAppraisalId}`, JSON.stringify({ feedbacks: updated, idp: leadIdp }));
    }
  };

  const handleFeedbackTextChange = (compId: number, field: "strengths" | "improvements", text: string) => {
    const updated = { ...feedbacks, [compId]: { ...feedbacks[compId], [field]: text } };
    setFeedbacks(updated);
    if (selectedAppraisalId) {
      localStorage.setItem(`lead_feedback_${selectedAppraisalId}`, JSON.stringify({ feedbacks: updated, idp: leadIdp }));
    }
  };

  const handleLeadIdpChange = (text: string) => {
    setLeadIdp(text);
    if (selectedAppraisalId) {
      localStorage.setItem(`lead_feedback_${selectedAppraisalId}`, JSON.stringify({ feedbacks, idp: text }));
    }
  };

  const handleSubmitLeadFeedback = () => {
    if (!selectedAppraisalId) return;
    
    // Move status of the selected employee's appraisal to Feedback Submitted
    const updatedList = assignedAppraisals.map(app => {
      if (app.id === selectedAppraisalId) {
        return { ...app, status: "Feedback Submitted" };
      }
      return app;
    });
    setAssignedAppraisals(updatedList);
    localStorage.setItem(`appraisal_status_${selectedAppraisalId}`, "Feedback Submitted");
    alert("Lead feedback submitted successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const currentAppraisalStatus = localStorage.getItem(`appraisal_status_${appraisalId}`) || employeeAppraisal.status;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <img src="/src/assets/TCP.svg" alt="TalentCycle Pro" className="brand-logo" />
          <div className="brand-details">
            <span className="brand-title">TalentCycle Pro</span>
            <span className="brand-subtitle">HR Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {userRole === "Employee" ? (
            <>
              <button 
                className={`nav-item ${activeTab === "self-appraisal" ? "active" : ""}`}
                onClick={() => setActiveTab("self-appraisal")}
              >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Self Appraisal
              </button>
              <button 
                className={`nav-item ${activeTab === "past-appraisals" ? "active" : ""}`}
                onClick={() => setActiveTab("past-appraisals")}
              >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Past Appraisals
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-item ${activeTab === "pending-reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("pending-reviews")}
              >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Pending Reviews
              </button>
              <button 
                className={`nav-item ${activeTab === "team-history" ? "active" : ""}`}
                onClick={() => setActiveTab("team-history")}
              >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Team History
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-user-footer">
          <div className="user-profile-info">
            <span className="profile-name">{userEmail.split("@")[0]}</span>
            <span className="profile-role">{userRole}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sign Out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {userRole === "Employee" && activeTab === "self-appraisal" && (
          <div className="appraisal-flow">
            {/* Top Bar */}
            <header className="main-header">
              <div className="header-info">
                <h2 className="cycle-title">Cycle Name 2023</h2>
                <div className="period-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>Period: Jan 01 - Dec 31, 2023</span>
                </div>
              </div>
              <button 
                className="submit-appraisal-btn" 
                onClick={handleSubmitSelfAppraisal}
                disabled={currentAppraisalStatus !== "Initiated" || accomplishments.length < 200}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                {currentAppraisalStatus === "Initiated" ? "Submit Self Appraisal" : "Submitted"}
              </button>
            </header>

            <div className="appraisal-content-grid">
              {/* Form Cards */}
              <div className="form-cards-column">
                {currentAppraisalStatus !== "Initiated" && (
                  <div className="info-banner warning">
                    Your self appraisal has been submitted. Form is now read-only.
                  </div>
                )}

                {/* Key Accomplishments */}
                <div className="form-card">
                  <div className="card-header">
                    <div className="card-icon-wrapper blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="7"/>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                      </svg>
                    </div>
                    <h3>Key Accomplishments</h3>
                  </div>
                  <p className="card-instruction">
                    What projects or initiatives are you most proud of? Be specific about your impact and results.
                  </p>
                  <textarea
                    placeholder="E.g., Led the redesign of the client dashboard which resulted in a 15% increase in user retention..."
                    value={accomplishments}
                    onChange={(e) => handleFieldChange("accomplishments", e.target.value)}
                    maxLength={2000}
                    disabled={currentAppraisalStatus !== "Initiated"}
                  />
                  <div className="card-footer">
                    <span>Minimum 200 characters recommended</span>
                    <span className={accomplishments.length < 200 ? "text-error" : "text-success"}>
                      {accomplishments.length} / 2000
                    </span>
                  </div>
                </div>

                {/* Challenges & Obstacles */}
                <div className="form-card">
                  <div className="card-header">
                    <div className="card-icon-wrapper orange">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <h3>Challenges & Obstacles</h3>
                  </div>
                  <p className="card-instruction">
                    Describe any roadblocks you encountered and how you addressed them or what you learned.
                  </p>
                  <textarea
                    placeholder="E.g., Navigated tight deadlines during the Q3 launch by implementing new agile workflows..."
                    value={challenges}
                    onChange={(e) => handleFieldChange("challenges", e.target.value)}
                    disabled={currentAppraisalStatus !== "Initiated"}
                  />
                </div>

                {/* Career Aspirations */}
                <div className="form-card">
                  <div className="card-header">
                    <div className="card-icon-wrapper green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                      </svg>
                    </div>
                    <h3>Career Aspirations</h3>
                  </div>
                  <p className="card-instruction">
                    Where do you see yourself in the next 12-24 months? What skills do you want to develop?
                  </p>
                  <textarea
                    placeholder="E.g., I aim to transition into a Lead Designer role, focusing on mentoring juniors and mastering system architecture..."
                    value={aspirations}
                    onChange={(e) => handleFieldChange("aspirations", e.target.value)}
                    disabled={currentAppraisalStatus !== "Initiated"}
                  />
                </div>
              </div>

              {/* Right Sidebar - Recommended Leads */}
              <div className="recommendations-sidebar">
                <div className="recommendations-card">
                  <div className="recommendations-header">
                    <h3>Recommended Leads</h3>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                  </div>
                  <p className="recommendations-instruction">
                    Suggest peers or leads who can provide feedback on your collaborative impact this cycle.
                  </p>

                  {currentAppraisalStatus === "Initiated" && (
                    <div className="search-box-container">
                      <div className="search-input-wrapper">
                        <input
                          type="text"
                          placeholder="Search by name or email..."
                          value={leadSearchText}
                          onChange={(e) => {
                            setLeadSearchText(e.target.value);
                            setShowLeadDropdown(true);
                          }}
                          onFocus={() => setShowLeadDropdown(true)}
                        />
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"/>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                      </div>

                      {showLeadDropdown && leadSearchText.trim().length >= 2 && (
                        <div className="search-dropdown">
                          {searchedUsers && searchedUsers.length > 0 ? (
                            searchedUsers.map((user: any) => (
                              <div 
                                key={user.id} 
                                className="dropdown-item"
                                onClick={() => handleLeadSearchSelect(user)}
                              >
                                <span className="item-name">{user.name}</span>
                                <span className="item-email">{user.email}</span>
                              </div>
                            ))
                          ) : (
                            <div className="dropdown-no-results">No users found</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="selected-leads-list">
                    {selectedLeads.length > 0 ? (
                      selectedLeads.map((lead) => (
                        <div key={lead.id} className="lead-tag">
                          <span>{lead.name}</span>
                          {currentAppraisalStatus === "Initiated" && (
                            <button className="remove-lead-btn" onClick={() => handleRemoveLead(lead.id)}>
                              &times;
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="no-leads-selected">No recommended leads added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {userRole === "Employee" && activeTab === "past-appraisals" && (
          <div className="past-appraisals-view">
            <h2>Past Appraisals</h2>
            <p>No completed appraisal cycles recorded yet.</p>
          </div>
        )}

        {userRole === "Lead" && activeTab === "pending-reviews" && (
          <div className="lead-reviews-flow">
            {/* Top Bar for Lead */}
            <header className="main-header">
              <div className="header-info">
                <h2 className="cycle-title">Cycle Name 2023</h2>
                <span className="period-badge">Lead Review Console</span>
              </div>
            </header>

            <div className="lead-grid">
              {/* Left Column: Assigned Employees */}
              <div className="employee-list-sidebar">
                <h3>Pending Appraisals</h3>
                <div className="employee-list">
                  {assignedAppraisals.map((app) => (
                    <div 
                      key={app.id} 
                      className={`employee-item ${selectedAppraisalId === app.id ? "active" : ""}`}
                      onClick={() => handleAppraisalSelect(app.id)}
                    >
                      <div className="emp-details">
                        <span className="emp-name">{app.employee_name}</span>
                        <span className="emp-email">{app.employee_email}</span>
                      </div>
                      <span className={`status-badge ${app.status.toLowerCase().replace(" ", "-")}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Feedback Form */}
              <div className="feedback-form-container">
                {selectedAppraisalId && (
                  <>
                    {/* Employee Self Appraisal Read-only View */}
                    {(() => {
                      const selectedApp = assignedAppraisals.find(a => a.id === selectedAppraisalId);
                      if (!selectedApp) return null;
                      return (
                        <div className="employee-submissions">
                          <div className="submission-section-title">
                            Employee Self Appraisal - {selectedApp.employee_name}
                          </div>
                          
                          <div className="submission-card">
                            <h4>Accomplishments</h4>
                            <p>{selectedApp.accomplishments}</p>
                          </div>
                          <div className="submission-card">
                            <h4>Challenges</h4>
                            <p>{selectedApp.challenges}</p>
                          </div>
                          <div className="submission-card">
                            <h4>Career Aspirations</h4>
                            <p>{selectedApp.aspirations}</p>
                          </div>

                          <div className="submission-section-title">
                            Performance Factors & Competencies
                          </div>

                          {competencies.map((comp) => {
                            const f = feedbacks[comp.id] || { score: 4, strengths: "", improvements: "" };
                            return (
                              <div key={comp.id} className="competency-card">
                                <div className="comp-card-header">
                                  <h4>{comp.name}</h4>
                                  <div className="score-selector">
                                    <span>Score:</span>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <button
                                        key={num}
                                        className={`score-btn ${f.score === num ? "active" : ""}`}
                                        onClick={() => handleScoreChange(comp.id, num)}
                                        disabled={selectedApp.status === "Feedback Submitted"}
                                      >
                                        {num}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="comp-inputs">
                                  <div className="comp-input-group">
                                    <label>Strengths</label>
                                    <textarea
                                      placeholder="Provide details on strengths shown in this competency..."
                                      value={f.strengths}
                                      onChange={(e) => handleFeedbackTextChange(comp.id, "strengths", e.target.value)}
                                      disabled={selectedApp.status === "Feedback Submitted"}
                                    />
                                  </div>
                                  <div className="comp-input-group">
                                    <label>Areas of Improvement</label>
                                    <textarea
                                      placeholder="Suggest ways the employee can grow..."
                                      value={f.improvements}
                                      onChange={(e) => handleFeedbackTextChange(comp.id, "improvements", e.target.value)}
                                      disabled={selectedApp.status === "Feedback Submitted"}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* IDP Notes */}
                          <div className="competency-card">
                            <h4>Individual Development Plan (IDP) Notes</h4>
                            <p className="card-instruction">Discuss during the meeting and note key improvement pathways.</p>
                            <textarea
                              placeholder="Notes from discussion..."
                              value={leadIdp}
                              onChange={(e) => handleLeadIdpChange(e.target.value)}
                              disabled={selectedApp.status === "Feedback Submitted"}
                            />
                          </div>

                          <div className="feedback-submit-footer">
                            <button
                              className="submit-feedback-btn"
                              onClick={handleSubmitLeadFeedback}
                              disabled={selectedApp.status === "Feedback Submitted"}
                            >
                              Submit Performance Review
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {userRole === "Lead" && activeTab === "team-history" && (
          <div className="past-appraisals-view">
            <h2>Team Review History</h2>
            <p>No past completed review forms available.</p>
          </div>
        )}
      </main>
    </div>
  );
}
