import {
    CircleCheck,
    Info
} from "lucide-react";

import "./CompetencyDisplayCard.css";

interface CompetencyDisplayCardProps {
    competencyName: string;
    score: number;
    strengths: string;
    improvements: string;
}

function CompetencyDisplayCard({
    competencyName,
    score,
    strengths,
    improvements
}: CompetencyDisplayCardProps) {

    return (
        <div className="competency-card">

            <div className="competency-header">

                <div className="competency-title">
                    {competencyName}
                </div>

                <div className="competency-score">
                    {score.toFixed(1)} / 10
                </div>

            </div>

            <div className="competency-divider" />

            <div className="competency-section">

                <CircleCheck
                    size={14}
                    strokeWidth={2.3}
                    className="strength-icon"
                />

                <div className="competency-text">
                    <span>
                        Strengths:
                    </span>

                    {strengths}
                </div>

            </div>

            <div className="competency-section">

                <Info
                    size={14}
                    strokeWidth={2.2}
                    className="improvement-icon"
                />

                <div className="competency-text">
                    <span>
                        Improvements:
                    </span>

                    {improvements}
                </div>

            </div>

        </div>
    );
}

export default CompetencyDisplayCard;