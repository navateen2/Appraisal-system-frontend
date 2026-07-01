import {
    UsersRound,
    ClipboardClock
} from "lucide-react";
import { useNavigate } from "react-router";
import "./LeadFeedbackSummary.css";
import type { AppraisalStatus } from "../../../types/appraisal";
import LeadFeedbackItem from "./LeadFeedbackItem";

export interface LeadFeedback {
    feedbackId: string;
    leadName: string;
    status: "PENDING" | "SUBMITTED";
}

interface LeadFeedbackSummaryProps {
    appraisalId: string;
    appraisalStatus: AppraisalStatus;
    feedbacks?: LeadFeedback[];
    onSelectLeads?: () => void;
}

function LeadFeedbackSummary({
    appraisalId,
    appraisalStatus,
    feedbacks = [],
    onSelectLeads
}: LeadFeedbackSummaryProps) {

    const navigate = useNavigate();

    const openFeedback = (
        feedbackId: string,
        status: "PENDING" | "SUBMITTED"
    ) => {

        if (status !== "SUBMITTED") {
            return;
        }

        navigate(
            `/hr/appraisals/${appraisalId}/feedback/${feedbackId}`
        );
    };

    const showPending =
        appraisalStatus=== "INITIATED";

    const showLeadSelection =
        appraisalStatus=== "SELF-APPRAISED";

    const showFeedbacks = [
        "INITIATE FEEDBACK",
        "FEEDBACK SUBMITTED",
        "MEETING DONE",
        "DONE"
    ].includes(appraisalStatus);

    return (
        <div className="lead-feedback-summary-card">

            <div className="lead-feedback-summary-header">

                <div className="lead-feedback-summary-title">
                    <UsersRound
                        size={18}
                        color="#5B21B6"
                    />

                    <span>
                        Lead Feedback Summary
                    </span>
                </div>

            </div>

            {showPending && (
                <div className="lead-feedback-empty-state">

                    <ClipboardClock
                        size={28}
                        strokeWidth={1.75}
                        color="#9CA3AF"
                    />

                    <div className="lead-feedback-empty-text">
                        Lead Assignment Pending
                    </div>

                </div>
            )}

            {showLeadSelection && (
                <div className="lead-feedback-empty-state">

                    <ClipboardClock
                        size={28}
                        strokeWidth={1.75}
                        color="#9CA3AF"
                    />

                    <div className="lead-feedback-empty-text">
                        Lead Assignment Pending
                    </div>

                    <button
                        type="button"
                        className="select-leads-button"
                        onClick={onSelectLeads}
                    >
                        Select Leads
                    </button>

                </div>
            )}

            {showFeedbacks && (
                <>
                    {feedbacks.length === 0 ? (
                        <div className="lead-feedback-empty-state">

                            <ClipboardClock
                                size={28}
                                strokeWidth={1.75}
                                color="#9CA3AF"
                            />

                            <div className="lead-feedback-empty-text">
                                No feedback requests available
                            </div>

                        </div>
                    ) : (
                        <div className="feedback-summary-list">

                            {feedbacks.map((feedback) => (
                                <LeadFeedbackItem
                                    key={feedback.feedbackId}
                                    leadName={feedback.leadName}
                                    status={feedback.status}
                                    onClick={() =>
                                        openFeedback(
                                            feedback.feedbackId,
                                            feedback.status
                                        )
                                    }
                                />
                            ))}

                        </div>
                    )}
                </>
            )}

        </div>
    );
}

export default LeadFeedbackSummary;