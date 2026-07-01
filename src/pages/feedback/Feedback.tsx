import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router";

import {
    ArrowLeft
} from "lucide-react";

import FeedbackHeader from "../../components/feedback/feedback-header/FeedbackHeader";
import CompetencyDisplayCard from "../../components/feedback/competency-display-card/CompetencyDisplayCard";

import "./Feedback.css";

interface CompetencyFeedback {
    id: number;
    competency_id: number;
    competency_name: string;
    score: number;
    strengths: string;
    improvements: string;
}

interface FeedbackResponse {
    mapping_id: number;
    lead_id: number;
    appraisal_id: number;
    status: string;
    lead_name?: string;
    employee_name?: string;
    feedbacks: CompetencyFeedback[];
}

function Feedback() {

    const navigate = useNavigate();

    const {
        appraisalId,
        feedbackId
    } = useParams();

    const [feedback, setFeedback] =
        useState<FeedbackResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function fetchFeedback() {

            try {

                /*
                    Replace with actual API later

                    GET
                    /feedback/{feedbackId}
                */

                const response: FeedbackResponse = {
                    mapping_id: 1,
                    lead_id: 11,
                    appraisal_id: 5,
                    status: "Submitted",
                    lead_name: "SEBU",
                    employee_name: "NAVANEETH",
                    feedbacks: [
                        {
                            id: 1,
                            competency_id: 1,
                            competency_name: "Communication",
                            score: 8.5,
                            strengths:
                                "Articulate in presentations; clear written reports.",
                            improvements:
                                "Needs more proactive updates during high-pressure sprints."
                        },
                        {
                            id: 2,
                            competency_id: 2,
                            competency_name: "Leadership",
                            score: 7,
                            strengths:
                                "Strong mentorship of junior developers.",
                            improvements:
                                "Could take more initiative in cross-departmental planning."
                        },
                        {
                            id: 3,
                            competency_id: 3,
                            competency_name: "Technical Skill",
                            score: 9.5,
                            strengths:
                                "Exceptional code quality and architectural design.",
                            improvements:
                                "Explore emerging cloud-native patterns."
                        },
                        {
                            id: 4,
                            competency_id: 4,
                            competency_name: "Teamwork",
                            score: 8,
                            strengths:
                                "Reliable collaborator; always helps peers with blockers.",
                            improvements:
                                "Could contribute more to team knowledge-sharing sessions."
                        }
                    ]
                };

                setFeedback(response);
            }
            finally {
                setLoading(false);
            }
        }

        fetchFeedback();

    }, [feedbackId]);

    if (loading) {
        return (
            <div className="feedback-page-loading">
                Loading...
            </div>
        );
    }

    if (!feedback) {
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
                    feedback.lead_name ?? ""
                }
                employeeName={
                    feedback.employee_name ?? ""
                }
            />

            <div className="competencies-title">
                COMPETENCIES & SCORES
            </div>

            <div className="competencies-grid">

                {feedback.feedbacks.map(
                    competency => (
                        <CompetencyDisplayCard
                            key={competency.id}
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