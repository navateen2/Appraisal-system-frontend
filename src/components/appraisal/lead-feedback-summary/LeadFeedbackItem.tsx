import "./LeadFeedbackItem.css";

interface LeadFeedbackItemProps {
    leadName: string;
    status: "PENDING" | "SUBMITTED";
    onClick?: () => void;
}

function LeadFeedbackItem({
    leadName,
    status,
    onClick
}: LeadFeedbackItemProps) {

    const clickable =
        status === "SUBMITTED";

    return (
        <div
            className={
                clickable
                    ? "lead-feedback-item clickable-feedback-item"
                    : "lead-feedback-item"
            }
            onClick={clickable ? onClick : undefined}
        >

            <div className="lead-feedback-item-name">
                {leadName}
            </div>

            <div
                className={
                    status === "SUBMITTED"
                        ? "lead-feedback-item-status submitted-status"
                        : "lead-feedback-item-status pending-status"
                }
            >
                {status === "SUBMITTED"
                    ? "Submitted"
                    : "Pending"}
            </div>

        </div>
    );
}

export default LeadFeedbackItem;