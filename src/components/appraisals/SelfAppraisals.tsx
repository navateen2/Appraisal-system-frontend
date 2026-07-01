import { useState } from "react";
import { useParams } from "react-router";
import {
    CalendarDays,
    Send,
    Award,
    TriangleAlert,
    TrendingUp,
    Search,
    UsersRound,
    X,

} from "lucide-react";
import "./appraisals.css";
import { useGetUsersQuery } from "../../api_service/employees/employee.api";
import { useGetAppraisalByIdQuery, useUpdateAppraisalStatusMutation } from "../../api_service/appraisal/appraisal.api";
import { useGetCycleByIdQuery } from "../../api_service/cycle/cycle.api";
import { useCreateSelfAppraisalMutation } from "../../api_service/self_appraisal/self_appraisal.api";
import { useCreateOrUpdateLeadRecommendationsMutation } from "../../api_service/employee_lead_recommendation/employee_lead_recommendation.api";
interface Lead {
    id: number;
    name: string;

}
export default function SelfAppraisal() {
    const { appraisalId } = useParams();
    const [createSelfAppraisal] = useCreateSelfAppraisalMutation();
    const [createLeadRecommendations] =
    useCreateOrUpdateLeadRecommendationsMutation();
    const [changeAppraisalStatus] = useUpdateAppraisalStatusMutation()
  const {
      data: appraisal,
      isLoading: appraisalLoading,

  } = useGetAppraisalByIdQuery(Number(appraisalId));
  const {
      data: cycle,
      isLoading: cycleLoading,

  } = useGetCycleByIdQuery(appraisal?.cycle_id, {
      skip: !appraisal,

  });
  const {
      data: users = [],
      isLoading: usersLoading,

  } = useGetUsersQuery();
  const allLeads: Lead[] = users
    .filter((user: any) => user.role === "Employee")
    .map((user: any) => ({
        id: user.id,
        name: user.name,

    }));
  const [search, setSearch] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [accomplishments, setAccomplishments] = useState("");
  const [challenges, setChallenges] = useState("");
  const [career, setCareer] = useState("");
  const formatDate = (date?: string) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",

    });
  };
  const suggestions = allLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedLeads.some((l) => l.id === lead.id)
  );
  const addLead = (lead: Lead) => {
      if (selectedLeads.length >= 3) return;
      setSelectedLeads((prev) => [...prev, lead]);
      setSearch("");

  };
  const removeLead = (id: number) => {
      setSelectedLeads((prev) =>
        prev.filter((lead) => lead.id !== id)
    );

  };
  const submit = () => {
      const payload = {
        appraisal_id: appraisal?.id,
        accomplishments,
        challenges,
        career_aspirations:career,
    };
    console.log(payload);

    const handleSubmit = async () => {
      await createSelfAppraisal(payload).unwrap();
      await createLeadRecommendations({
        appraisalId: appraisal!.id,
        body: {
          recommended_lead_ids: selectedLeads.map(
            (lead) => lead.id
          ),
        },
      }).unwrap();
      await changeAppraisalStatus({
        appraisalId: appraisal.id,
        status: "Self-Appraised",
      }).unwrap();
    };   

    handleSubmit()
  
  };
   if (usersLoading || appraisalLoading || cycleLoading) {
     return <div>Loading...</div>;
   }
   return (
     <div className="appraisal-page">
       {/* HEADER */}
   
       <div className="top-bar">
         <div>
           <h1>{cycle?.name ?? "Appraisal Cycle"}</h1>
   
           <div className="period-badge">
             <CalendarDays size={15} />
   
             <span>
               Period: {formatDate(cycle?.start_date)} -{" "}
               {formatDate(cycle?.end_date)}
             </span>
           </div>
         </div>
   
         <button className="submit-btn" onClick={submit}>
           <Send size={18} />
           Submit Self Appraisal
         </button>
       </div>
   
       <div className="content">
   
         {/* LEFT */}
   
         <div className="left-column">
   
           {/* ACCOMPLISHMENTS */}
   
           <div className="card">
   
             <div className="section-title">
   
               <div className="icon blue">
                 <Award size={22} />
               </div>
   
               <h2>Key Accomplishments</h2>
   
             </div>
   
             <p className="description">
               What projects or initiatives are you most proud of? Be
               specific about your impact and results.
             </p>
   
             <textarea
               maxLength={2000}
               value={accomplishments}
               onChange={(e) => setAccomplishments(e.target.value)}
               placeholder="Describe your major accomplishments..."
             />
   
             <div className="footer-row">
               <span>Minimum 200 characters recommended</span>
   
               <span>{accomplishments.length} / 2000</span>
             </div>
   
           </div>
   
           {/* CHALLENGES */}
   
           <div className="card">
   
             <div className="section-title">
   
               <div className="icon red">
                 <TriangleAlert size={22} />
               </div>
   
               <h2>Challenges & Obstacles</h2>
   
             </div>
   
             <p className="description">
               Describe any roadblocks you encountered and how you
               addressed them.
             </p>
   
             <textarea
               value={challenges}
               onChange={(e) => setChallenges(e.target.value)}
               placeholder="Describe challenges faced..."
             />
   
           </div>
   
           {/* CAREER */}
   
           <div className="card">
   
             <div className="section-title">
   
               <div className="icon grey">
                 <TrendingUp size={22} />
               </div>
   
               <h2>Career Aspirations</h2>
   
             </div>
   
             <p className="description">
               Where do you see yourself over the next 12–24 months?
             </p>
   
             <textarea
               value={career}
               onChange={(e) => setCareer(e.target.value)}
               placeholder="Describe your career goals..."
             />
   
           </div>
   
         </div>
         {/* RIGHT */}
 <div className="right-column">
   <div className="card leads-card">
     <div className="section-title">
       <h2>Recommended Leads</h2>
       <UsersRound
         size={20}
         color="#2c6fb7"
       />
     </div>
     <p className="lead-text">
       Suggest up to 3 employees who can provide feedback on your
       collaborative impact during this appraisal cycle.
     </p>
     <div className="search-box">
       <Search size={18} />
       <input
         placeholder="Search employees..."
         value={search}
         onChange={(e) => setSearch(e.target.value)}
       />
     </div>
     {search && (
       <div className="suggestions">
         {suggestions.length > 0 ? (
           suggestions.map((lead) => (
             <div
               key={lead.id}
               className="suggestion"
               onClick={() => addLead(lead)}
             >
               {lead.name}
             </div>
           ))
         ) : (
           <div className="suggestion">
             No matching employees
           </div>
         )}
       </div>
     )}
     <div className="chips">
       {selectedLeads.map((lead) => (
         <div
           key={lead.id}
           className="chip"
         >
           {lead.name}
           <X
             size={14}
             style={{ cursor: "pointer" }}
             onClick={() => removeLead(lead.id)}
           />
         </div>
       ))}
     </div>
     <div
       style={{
         marginTop: 12,
         display: "flex",
         justifyContent: "space-between",
         fontSize: 13,
         color: "#6b7280",
       }}
     >
       <span>
         {selectedLeads.length} / 3 selected
       </span>
       {selectedLeads.length === 3 && (
         <span style={{ color: "#d97706" }}>
           Maximum reached
         </span>
       )}
     </div>
   </div>
   {/* Summary Card */}
   <div className="card">
     <div className="section-title">
       <h2>Summary</h2>
     </div>
     <div
       style={{
         display: "flex",
         flexDirection: "column",
         gap: "10px",
         fontSize: "14px",
       }}
     >
       <div>
         <strong>Cycle:</strong>{" "}
         {cycle?.name}
       </div>
       <div>
         <strong>Status:</strong>{" "}
         {appraisal?.status}
       </div>
       <div>
         <strong>Period:</strong>{" "}
         {formatDate(cycle?.start_date)} -{" "}
         {formatDate(cycle?.end_date)}
       </div>
       <div>
         <strong>Recommended Leads:</strong>{" "}
         {selectedLeads.length}
       </div>
     </div>
   </div>
 </div>
 </div>
 </div>
 );
}