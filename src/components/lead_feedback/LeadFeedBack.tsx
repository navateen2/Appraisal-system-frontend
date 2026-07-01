import { useMemo, useState } from "react";
import {
  Send,
  Search,
  Trash2,
  BarChart3,
  MessageSquareText,
  Star,
  TrendingUp,
} from "lucide-react";

import "./leadFeedBack.css";

interface Competency {
  id: number;
  name: string;
  score: number;
}

const availableCompetencies = [
  "Communication",
  "Leadership",
  "Technical Skills",
  "Problem Solving",
  "Teamwork",
  "Innovation",
  "Ownership",
  "Mentoring",
  "Time Management",
  "Quality",
];

export default function LeadFeedback() {
  const [search, setSearch] = useState("");

  const [competencies, setCompetencies] = useState<Competency[]>([
    {
      id: 1,
      name: "Communication",
      score: 9,
    },
    {
      id: 2,
      name: "Leadership",
      score: 9,
    },
    {
      id: 3,
      name: "Technical Skills",
      score: 9,
    },
  ]);

  const [summary, setSummary] = useState(
    "Sarah has demonstrated exceptional performance throughout this appraisal cycle, particularly in her technical delivery and architectural contributions. She consistently exceeds expectations in code quality and has shown significant growth in her ability to mentor junior developers. Her proactive approach to problem-solving and her commitment to maintaining high standards have been instrumental in the successful delivery of our recent core platform updates."
  );

  const [strengths, setStrengths] = useState(
    "High-velocity technical delivery, complex problem solving, and peer code review quality."
  );

  const [improvements, setImprovements] = useState(
    "Public speaking and presentation, conflict resolution skills, and strategic roadmap planning."
  );

  const suggestions = useMemo(
    () =>
      availableCompetencies.filter(
        (c) =>
          c.toLowerCase().includes(search.toLowerCase()) &&
          !competencies.find((x) => x.name === c)
      ),
    [search, competencies]
  );

  const addCompetency = (name: string) => {
    setCompetencies([
      ...competencies,
      {
        id: Date.now(),
        name,
        score: 5,
      },
    ]);

    setSearch("");
  };

  const removeCompetency = (id: number) => {
    setCompetencies(competencies.filter((c) => c.id !== id));
  };

  const updateScore = (id: number, score: number) => {
    setCompetencies(
      competencies.map((c) =>
        c.id === id
          ? {
              ...c,
              score: Math.min(10, Math.max(1, score)),
            }
          : c
      )
    );
  };

  const submit = () => {
    console.log({
      competencies,
      summary,
      strengths,
      improvements,
    });
  };

  return (
    <div className="feedback-page">
      {/* HEADER */}

      <div className="feedback-header">

        <div>

          <h1>Provide Feedback</h1>

          <div className="header-badges">

            <span className="badge">
              Sarah Jenkins
            </span>

            <span className="badge blue">
              Cycle Name
            </span>

          </div>

        </div>

        <button
          className="submit-btn"
          onClick={submit}
        >
          <Send size={18} />
          Submit Review
        </button>

      </div>

      <div className="feedback-content">

        {/* LEFT */}

        <div className="competency-card">

          <div className="section-header">

            <div className="section-title">

              <BarChart3 size={22} />

              <h2>Competency Scores</h2>

            </div>

            <span className="scale-tag">
              SCALE 1-10
            </span>

          </div>

          <div className="divider" />

          <div className="search-box">

            <Search size={18} />

            <input
              placeholder="Search for a competency"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {search && suggestions.length > 0 && (
            <div className="suggestions">

              {suggestions.map((item) => (
                <div
                  key={item}
                  className="suggestion"
                  onClick={() => addCompetency(item)}
                >
                  {item}
                </div>
              ))}

            </div>
          )}

          <div className="competency-list">

            {competencies.map((item) => (

              <div
                key={item.id}
                className="competency-row"
              >

                <span>{item.name}</span>

                <div className="score-box">

                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={item.score}
                    onChange={(e) =>
                      updateScore(
                        item.id,
                        Number(e.target.value)
                      )
                    }
                  />

                  <span>/10</span>

                  <Trash2
                    size={18}
                    onClick={() =>
                      removeCompetency(item.id)
                    }
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div className="feedback-right">

          {/* SUMMARY */}

          <div className="feedback-card">

            <div className="section-title">

              <MessageSquareText size={22} />

              <h2>Lead Feedback Narrative</h2>

            </div>

            <div className="divider" />

            <label>Executive Summary</label>

            <textarea
              value={summary}
              maxLength={2000}
              onChange={(e) =>
                setSummary(e.target.value)
              }
            />

            <div className="footer-row">

              <span>
                Tip: Be specific about projects and
                behaviors observed.
              </span>

              <span>
                {summary.length} / 2000 characters
              </span>

            </div>

          </div>

          {/* BOTTOM */}

          <div className="bottom-cards">

            <div className="mini-card">

              <div className="section-title">

                <Star size={20} />

                <h2>Employee Strengths</h2>

              </div>

              <textarea
                value={strengths}
                onChange={(e) =>
                  setStrengths(e.target.value)
                }
              />

              <small>
                Highlight core values and behaviors
                to reinforce.
              </small>

            </div>

            <div className="mini-card">

              <div className="section-title">

                <TrendingUp size={20} />

                <h2>Areas for Improvement</h2>

              </div>

              <textarea
                value={improvements}
                onChange={(e) =>
                  setImprovements(e.target.value)
                }
              />

              <small>
                Identify actionable goals for the
                next cycle.
              </small>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}