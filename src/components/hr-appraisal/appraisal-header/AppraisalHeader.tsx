import "./AppraisalHeader.css";

interface AppraisalHeaderProps {
    employeeName: string;
    cycleName: string;
    status: string;
}

const statusClassMap: Record<string, string> = {
    INITIATED: "status-initiated",
    SELF_APPRAISED: "status-self-appraised",
    INITIATE_FEEDBACK: "status-feedback",
    FEEDBACK_SUBMITTED: "status-feedback-submitted",
    MEETING_DONE: "status-meeting-done",
    APPRAISAL_DONE: "status-appraisal-done",
};

const formatStatus = (status: string) => {
    return status
        .replace(/_/g, " ")
        .toUpperCase();
};

function AppraisalHeader({
    employeeName,
    cycleName,
    status,
}: AppraisalHeaderProps) {
    return (
        <div className="appraisal-header-card">
            <div className="appraisal-header-left">
                <h1 className="employee-name">
                    {employeeName}
                </h1>
            </div>

            <div className="appraisal-header-right">
                <span className="header-label">
                    CYCLE NAME
                </span>

                <h2 className="cycle-name">
                    {cycleName}
                </h2>

                <div
                    className={`status-badge ${
                        statusClassMap[status] || ""
                    }`}
                >
                    {formatStatus(status)}
                </div>
            </div>
        </div>
    );
}

export default AppraisalHeader;