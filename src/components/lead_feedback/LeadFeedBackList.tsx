import "./leadFeedBackList.css"
import { useGetPendingAssignmentsQuery } from "../../api_service/lead_assignment/lead_assignment.api";
import getUserIdFromToken from "../../utils/getUserIDfromToken";
import LeadFeedbackCard from "./LeadFeedBackCard";

export default function LeadFeedbackList() {
  const token = localStorage.getItem("token")   
  if (!token) return "Not Authorized"
  const user = getUserIdFromToken(token)

  const sampleFeedbacks = useGetPendingAssignmentsQuery(Number(user?.id))


  return (
    <div className="feedback-list-page">
      <h1>Provide Feedback</h1>

      <div className="feedback-list">
  {sampleFeedbacks.data?.map((item) => (
    <LeadFeedbackCard
      key={item.id}
      item={item}
    />
  ))}
</div>
</div>
)}