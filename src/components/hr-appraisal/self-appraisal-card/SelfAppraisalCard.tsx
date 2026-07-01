import { UserRound, ClipboardClock } from "lucide-react";
import "./SelfAppraisalCard.css";
import type { AppraisalStatus } from "../../../types/appraisal";

interface SelfAppraisalSection {
    title: string;
    content: string;
}

interface SelfAppraisalCardProps {
    appraisalStatus: AppraisalStatus;
    submittedDate?: string;
    recommendedLeads?: string[];
    sections?: SelfAppraisalSection[];
}

function SelfAppraisalCard({
    appraisalStatus,
    submittedDate,
    recommendedLeads = [],
    sections = [],
}: SelfAppraisalCardProps) {

    const showContent =
        appraisalStatus.toUpperCase() !== "INITIATED";

    const validSections = sections.filter(
        section => section.content?.trim()
    );

    return (
        <div className="self-appraisal-card">

            <div className="self-appraisal-header">

                <div className="self-appraisal-title">
                    <UserRound
                        size={18}
                        color="#5B21B6"
                    />

                    <span>Self-Appraisal</span>
                </div>

                {showContent && submittedDate && (
                    <div className="submission-date">
                        Submitted {submittedDate}
                    </div>
                )}

            </div>

            {!showContent ? (
                <div className="self-appraisal-empty">

                    <ClipboardClock
                        size={28}
                        color="#9CA3AF"
                        strokeWidth={1.75}
                    />

                    <div className="empty-text">
                        Waiting for employee to complete self-appraisal...
                    </div>

                </div>
            ) : (
                <div className="self-appraisal-content">

                    {recommendedLeads.length > 0 && (
                        <div className="self-section">

                            <div className="section-title">
                                RECOMMENDED LEADS
                            </div>

                            <div className="lead-chip-container">

                                {recommendedLeads.map((lead) => (
                                    <div className="lead-chip">
                                        {lead}
                                    </div>
                                ))}

                            </div>

                            {validSections.length > 0 && (
                                <div className="section-divider" />
                            )}

                        </div>
                    )}

                    {validSections.map((section, index) => (
                        <div
                            className="self-section"
                            key={section.title}
                        >

                            <div className="section-title">
                                {section.title.toUpperCase()}
                            </div>

                            <div className="section-content">
                                {section.content}
                            </div>

                            {index !== validSections.length - 1 && (
                                <div className="section-divider" />
                            )}

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default SelfAppraisalCard;