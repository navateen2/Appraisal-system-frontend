import "./leadFeedBackList.css"
import {
  CalendarDays,
 Eye,
 ClipboardCheck,
 Clock,
} from "lucide-react";
import { useNavigate } from "react-router";

const sampleFeedbacks = [
  {
    id: 1,
    employee: "Sarah Jenkins",
    cycle: "Annual Review 2026",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    assigned_at: "2026-07-01",
    status: "Pending",
  },
  {
    id: 2,
    employee: "John Mathew",
    cycle: "Annual Review 2026",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    assigned_at: "2026-06-28",
    status: "Submitted",
  },
];

export default function LeadFeedbackList() {
  const navigate = useNavigate();

  const format = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="feedback-list-page">
      <h1>Provide Feedback</h1>

      <div className="feedback-list">
        {sampleFeedbacks.map((item) => (
          <div
            key={item.id}
            className="feedback-item"
          >
            <div className="feedback-top">

              <div>

                <h2>{item.employee}</h2>

                <div className="cycle">
                  <ClipboardCheck size={16} />
                  {item.cycle}
                </div>

                <div className="period">
                  <CalendarDays size={16} />
                  {format(item.start_date)}
                  {" - "}
                  {format(item.end_date)}
                </div>

              </div>

              <span
                className={`status ${item.status.toLowerCase()}`}
              >
                {item.status}
              </span>

            </div>

            <div className="feedback-bottom">

              <div className="assigned">

                <Clock size={16} />

                Assigned {format(item.assigned_at)}

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
        ))}
      </div>
    </div>
  );
}