import "./FeedbackHeader.css";

interface FeedbackHeaderProps {
    leadName: string;
    employeeName: string;
}

function FeedbackHeader({
    leadName,
    employeeName
}: FeedbackHeaderProps) {

    return (
        <div className="feedback-header-card">

            <div className="feedback-header-left">

                <div className="feedback-header-label">
                    LEAD
                </div>

                <div className="feedback-header-name">
                    {leadName}
                </div>

            </div>

            <div className="feedback-header-right">

                <div className="feedback-header-label">
                    EMPLOYEE
                </div>

                <div className="feedback-header-name">
                    {employeeName}
                </div>

            </div>

            <div className="feedback-header-line" />

        </div>
    );
}

export default FeedbackHeader;