import { useState } from "react";
import {
  CalendarDays,
  Send,
  Award,
  TriangleAlert,
  TrendingUp,
  Search,
  UsersRound,
  X,
} from "lucide-react";

import "./appraisals.css";

interface Lead {
  id: number;
  name: string;
}

const allLeads: Lead[] = [
  { id: 1, name: "Sebu" },
  { id: 2, name: "Suhana" },
  { id: 3, name: "Rahul" },
  { id: 4, name: "Anjali" },
  { id: 5, name: "Akhil" },
  { id: 6, name: "Christy" },
  { id: 7, name: "Nikhil" },
];

export default function SelfAppraisal() {
  const [search, setSearch] = useState("");

  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([
    allLeads[0],
    allLeads[1],
  ]);

  const [accomplishments, setAccomplishments] = useState("");
  const [challenges, setChallenges] = useState("");
  const [career, setCareer] = useState("");

  const suggestions = allLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedLeads.find((l) => l.id === lead.id)
  );

  const addLead = (lead: Lead) => {
    if (selectedLeads.length >= 3) return;

    setSelectedLeads([...selectedLeads, lead]);
    setSearch("");
  };

  const removeLead = (id: number) => {
    setSelectedLeads(selectedLeads.filter((l) => l.id !== id));
  };

  const submit = () => {
    console.log({
      accomplishments,
      challenges,
      career,
      selectedLeads,
    });
  };

  return (
    <div className="appraisal-page">
      {/* HEADER */}

      <div className="top-bar">
        <div>
          <h1>Cycle Name 2023</h1>

          <div className="period-badge">
            <CalendarDays size={15} />
            <span>Period: Jan 01 - Dec 31, 2023</span>
          </div>
        </div>

        <button className="submit-btn" onClick={submit}>
          <Send size={18} />
          Submit Self Appraisal
        </button>
      </div>

      <div className="content">

        {/* LEFT */}

        <div className="left-column">

          {/* ACCOMPLISHMENTS */}

          <div className="card">

            <div className="section-title">

              <div className="icon blue">
                <Award size={22} />
              </div>

              <h2>Key Accomplishments</h2>

            </div>

            <p className="description">
              What projects or initiatives are you most proud of? Be specific
              about your impact and results.
            </p>

            <textarea
              maxLength={2000}
              value={accomplishments}
              onChange={(e) => setAccomplishments(e.target.value)}
              placeholder="E.g., Led the redesign of the client dashboard which resulted in a 15% increase in user retention..."
            />

            <div className="footer-row">
              <span>Minimum 200 characters recommended</span>

              <span>{accomplishments.length} / 2000</span>
            </div>

          </div>

          {/* CHALLENGES */}

          <div className="card">

            <div className="section-title">

              <div className="icon red">
                <TriangleAlert size={22} />
              </div>

              <h2>Challenges & Obstacles</h2>

            </div>

            <p className="description">
              Describe any roadblocks you encountered and how you addressed them
              or what you learned.
            </p>

            <textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="E.g., Navigated tight deadlines during the Q3 launch by implementing new agile workflows..."
            />

          </div>

          {/* CAREER */}

          <div className="card">

            <div className="section-title">

              <div className="icon grey">
                <TrendingUp size={22} />
              </div>

              <h2>Career Aspirations</h2>

            </div>

            <p className="description">
              Where do you see yourself in the next 12-24 months? What skills
              do you want to develop?
            </p>

            <textarea
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              placeholder="E.g., I aim to transition into a Lead Designer role, focusing on mentoring juniors and mastering system architecture..."
            />

          </div>

        </div>

        {/* RIGHT */}

        <div className="right-column">

          <div className="card leads-card">

            <div className="section-title">

              <h2>Recommended Leads</h2>

              <UsersRound
                size={20}
                color="#2c6fb7"
              />

            </div>

            <p className="lead-text">
              Suggest up to 3 peers or leads who can provide feedback on your
              collaborative impact this cycle.
            </p>

            <div className="search-box">

              <Search size={18} />

              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {search && suggestions.length > 0 && (
              <div className="suggestions">

                {suggestions.map((lead) => (
                  <div
                    key={lead.id}
                    className="suggestion"
                    onClick={() => addLead(lead)}
                  >
                    {lead.name}
                  </div>
                ))}

              </div>
            )}

            <div className="chips">

              {selectedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="chip"
                >
                  {lead.name}

                  <X
                    size={14}
                    onClick={() => removeLead(lead.id)}
                  />
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}