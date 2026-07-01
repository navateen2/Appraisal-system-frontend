import "./appraisalList.css";
import { CalendarDays, Eye, Pencil, Clock } from "lucide-react";
import { useGetEmployeeAppraisalHistoryQuery } from "../../api_service/appraisal/appraisal.api";
import { useNavigate } from "react-router";

export default function AppraisalList() {
    const navigate = useNavigate()
  const { data, isLoading, isError } =
    useGetEmployeeAppraisalHistoryQuery();

  if (isLoading) {
    return <h2>Loading appraisals...</h2>;
  }

  if (isError) {
    return <h2>Failed to load appraisals.</h2>;
  }

  if (!data?.length) {
    return (
      <div className="appraisal-list-page">
        <h1>My Appraisals</h1>

        <div className="empty-state">
          No appraisals found.
        </div>
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="appraisal-list-page">
      <h1>My Appraisals</h1>

      <div className="appraisal-list">
        {data.map((appraisal: any) => (
          <div
            className="appraisal-card"
            key={appraisal.id}
          >
            <div className="appraisal-header">
              <div>
                <h2>{appraisal.cycle_details.cycle_name}</h2>

                <div className="period">
                  <CalendarDays size={16} />

                  {formatDate(appraisal.cycle_details.start_date)}
                  {" - "}
                  {formatDate(appraisal.cycle_details.end_date)}
                </div>
              </div>

              <span
                className={`status ${appraisal.status
                  .replace(/\s+/g, "")
                  .toLowerCase()}`}
              >
                {appraisal.status}
              </span>
            </div>

            <div className="details">
              <div>
                <Clock size={16} />

                Created&nbsp;

                {formatDate(appraisal.created_at)}
              </div>

              <div>
                <strong>Cycle Status:</strong>{" "}
                {appraisal.cycle_details.cycle_status}
              </div>
            </div>

            <div className="actions">
              <button className="view-btn" onClick={() => navigate(`/appraisals/${appraisal.id}`)}>
                <Eye size={18} />
                View
              </button>

              {appraisal.status === "Initiated" && (
                <button className="edit-btn">
                  <Pencil size={18} />
                  Continue
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}