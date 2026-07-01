import {
    useNavigate,
    useParams
} from "react-router";

import {
    ArrowLeft
} from "lucide-react";

import FeedbackHeader
from "../../components/hr-feedback/feedback-header/FeedbackHeader";

import CompetencyDisplayCard
from "../../components/hr-feedback/competency-display-card/CompetencyDisplayCard";

import {
    useGetLeadFeedbackFormQuery
} from "../../api_service/lead_feedback/lead_feedback.api";

import {
    useGetAppraisalByIdQuery
} from "../../api_service/appraisal/appraisal.api";

import {
    useGetUserByIdQuery
} from "../../api_service/employees/employee.api";

import "./Feedback.css";

function Feedback() {

    const navigate = useNavigate();

    const {
        appraisalId,
        feedbackId
    } = useParams();

    const mappingId =
        Number(feedbackId);

    const {
        data: feedback,
        isLoading: feedbackLoading,
        isError: feedbackError
    } = useGetLeadFeedbackFormQuery(
        mappingId,
        {
            skip: !mappingId
        }
    );

    const {
        data: appraisal,
        isLoading: appraisalLoading
    } = useGetAppraisalByIdQuery(
        feedback?.appraisal_id,
        {
            skip:
                !feedback?.appraisal_id
        }
    );

    const {
        data: leadUser,
        isLoading: leadLoading
    } = useGetUserByIdQuery(
        feedback?.lead_id,
        {
            skip:
                !feedback?.lead_id
        }
    );

    const {
        data: employeeUser,
        isLoading: employeeLoading
    } = useGetUserByIdQuery(
        appraisal?.employee_id,
        {
            skip:
                !appraisal?.employee_id
        }
    );

    const loading =
        feedbackLoading ||
        appraisalLoading ||
        leadLoading ||
        employeeLoading;

    if (loading) {
        return (
            <div className="feedback-page-loading">
                Loading...
            </div>
        );
    }

    if (
        feedbackError ||
        !feedback
    ) {
        return (
            <div className="feedback-page-loading">
                Feedback not found
            </div>
        );
    }

    return (
        <div className="feedback-page">

            <button
                className="back-button"
                onClick={() =>
                    navigate(
                        `/appraisals/${appraisalId}`
                    )
                }
            >
                <ArrowLeft size={16} />

                BACK TO APPRAISAL
            </button>

            <FeedbackHeader
                leadName={
                    leadUser?.name ?? ""
                }
                employeeName={
                    employeeUser?.name ?? ""
                }
            />

            <div className="competencies-title">
                COMPETENCIES & SCORES
            </div>

            <div className="competencies-grid">

                {feedback.feedbacks.map(
                    competency => (
                        <CompetencyDisplayCard
                            key={
                                competency.id
                            }
                            competencyName={
                                competency.competency_name
                            }
                            score={
                                competency.score
                            }
                            strengths={
                                competency.strengths
                            }
                            improvements={
                                competency.improvements
                            }
                        />
                    )
                )}

            </div>

        </div>
    );
}

export default Feedback;