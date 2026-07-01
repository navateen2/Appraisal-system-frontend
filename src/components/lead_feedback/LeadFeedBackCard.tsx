import { Eye, ClipboardCheck, Clock, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";

export default function LeadFeedbackCard({ item }: { item: any }) {
  const navigate = useNavigate();

  const format = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="feedback-item">
      <div className="feedback-top">
        <div>
          <h2>{item.employee_name}</h2>

          <div className="cycle">
            <ClipboardCheck size={16} />
            Appraisal #{item.appraisal_id}
          </div>

          <div className="period">
            <CalendarDays size={16} />
            {format(item.start_date)} - {format(item.end_date)}
          </div>
        </div>

        <span className={`status ${item.status.toLowerCase()}`}>
          {item.status}
        </span>
      </div>

      <div className="feedback-bottom">
        <div className="assigned">
          <Clock size={16} />
          Assigned {format(item.created_at)}
        </div>

        <button
          onClick={() =>
            navigate(`/employee/lead_feedback/${item.id}`)
          }
        >
          <Eye size={18} />
          {item.status === "Pending"
            ? "Provide Feedback"
            : "View Feedback"}
        </button>
      </div>
    </div>
  );
}