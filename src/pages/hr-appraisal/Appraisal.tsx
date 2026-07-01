import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import "./Appraisal.css";

import { useState } from "react";

import LeadSelectionModal from "../../components/hr-appraisal/lead-selection-modal/LeadSelectionModal";

import {
  useAssignLeadsMutation,
} from "../../api_service/lead_assignment/lead_assignment.api";

import {
  useGetAppraisalByIdQuery,
  useUpdateAppraisalStatusMutation,
} from "../../api_service/appraisal/appraisal.api";

import { useGetUserByIdQuery } from "../../api_service/employees/employee.api";

import { useGetCycleByIdQuery } from "../../api_service/cycle/cycle.api";

import { useGetSelfAppraisalByIdQuery } from "../../api_service/self_appraisal/self_appraisal.api";

import { useGetLeadRecommendationsQuery } from "../../api_service/employee_lead_recommendation/employee_lead_recommendation.api";

import { useGetAssignedLeadsQuery } from "../../api_service/lead_assignment/lead_assignment.api";

import AppraisalHeader from "../../components/hr-appraisal/appraisal-header/AppraisalHeader";
import SelfAppraisalCard from "../../components/hr-appraisal/self-appraisal-card/SelfAppraisalCard";
import LeadFeedbackSummary from "../../components/hr-appraisal/lead-feedback-summary/LeadFeedbackSummary";
import MeetingNotes from "../../components/hr-appraisal/meeting-note/MeetingNote";
import IDP from "../../components/hr-appraisal/idp/IDP";
import ActionFooter from "../../components/hr-appraisal/action-footer/ActionFooter";
import Loading from "../../components/hr-appraisal/Loading";
import { MoveLeft } from "lucide-react";

const Appraisal = () => {
  const navigate = useNavigate();
  const { appraisalId } = useParams();

  const id = Number(appraisalId);

  const [showLeadModal, setShowLeadModal] = useState(false);

  const appraisalQuery = useGetAppraisalByIdQuery(id, {
    skip: !id,
  });

  const appraisal = appraisalQuery.data;

  const refetchAppraisal = appraisalQuery.refetch;

  const employeeQuery = useGetUserByIdQuery(
    appraisal?.employee_id!,
    {
      skip: !appraisal?.employee_id,
    }
  );

  const cycleQuery = useGetCycleByIdQuery(
    appraisal?.cycle_id!,
    {
      skip: !appraisal?.cycle_id,
    }
  );

  const selfAppraisalQuery =
    useGetSelfAppraisalByIdQuery(id, {
      skip: !id,
    });

  const recommendationsQuery =
    useGetLeadRecommendationsQuery(id, {
      skip: !id,
    });

  const assignedLeadsQuery =
    useGetAssignedLeadsQuery(id, {
      skip: !id,
    });

  const [updateStatus] =
    useUpdateAppraisalStatusMutation();

  const [assignLeads] =  useAssignLeadsMutation();

  const status = appraisal?.status ?? "INITIATED";

  const showMeetingNotes = [
    "FEEDBACK SUBMITTED",
    "MEETING DONE",
    "DONE",
  ].includes(status.toUpperCase());

  const showIDP = [
    "MEETING DONE",
    "DONE",
  ].includes(status.toUpperCase());

  const showActionFooter = [
    "INITIATE FEEDBACK",
    "FEEDBACK SUBMITTED",
    "MEETING DONE",
    "DONE",
  ].includes(status.toUpperCase());

  const footerButtonText = useMemo(() => {
    switch (status.toUpperCase()) {
      case "INITIATE FEEDBACK":
        return "Submit Feedback";

      case "FEEDBACK SUBMITTED":
        return "Meeting Done";

      case "MEETING DONE":
        return "Finalise Appraisal";

      case "DONE":
        return "Generate Summary";

      default:
        return "";
    }
  }, [status]);

  const handleFooterClick = async () => {
    switch (status.toUpperCase()) {
      case "INITIATE FEEDBACK": {
        const pendingExists =
          assignedLeadsQuery.data?.some(
            (lead) =>
              lead.status.toUpperCase() !==
              "SUBMITTED"
          );

        if (pendingExists) {
          alert(
            "All lead feedback must be submitted first."
          );
          return;
        }

        await updateStatus({
          appraisalId: id,
          status: "Feedback Submitted",
        });
        await refetchAppraisal();
        break;
      }

      case "FEEDBACK SUBMITTED":
        await updateStatus({
          appraisalId: id,
          status: "Meeting Done",
        });
        break;

      case "MEETING DONE":
        await updateStatus({
          appraisalId: id,
          status: "Done",
        });
        await refetchAppraisal();
        break;

      case "DONE":
        await new Promise((r) =>
          setTimeout(r, 1000)
        );
        break; //add generate summary endpoint
    }
  };

  const handleLeadSelectionDone =
  async (
    employeeIds: string[]
  ) => {

    await assignLeads({
      appraisalId: id,
      body: {
        lead_ids:
          employeeIds.map(Number),
      },
    });

    await updateStatus({
      appraisalId: id,
      status: "Initiate Feedback",
    });
    await refetchAppraisal();
    setShowLeadModal(false);
  };

  if (appraisalQuery.isLoading) {
    return <Loading />;
  }

  if (appraisalQuery.isError || !appraisal) {
    return (
      <div className="appraisal-error">
        Failed to load appraisal.
      </div>
    );
  }

  return (
    <div className="appraisal-page">
      <div className="appraisal-container">
        <button
          className="back-button"
          onClick={() => navigate(`/hr/cycles/${appraisal?.cycle_id}`)}
        >
          <MoveLeft size={16} strokeWidth={2.5} />
          Back to Cycle
        </button>

        <AppraisalHeader
          employeeName={employeeQuery.data?.name ?? "-"}
          cycleName={cycleQuery.data?.name ?? "-"}
          status={status}
        />

        <div className="appraisal-main-content">
          <div className="appraisal-left">
            {selfAppraisalQuery.isLoading ? (
              <Loading />
            ) : (
              <SelfAppraisalCard
                appraisalStatus={status}
                recommendedLeads={
                  recommendationsQuery.data?.map((lead) => lead.name) ?? []
                }
                sections={[
                  {
                    title: "Accomplishments",
                    content: selfAppraisalQuery.data?.accomplishments ?? "",
                  },
                  {
                    title: "Challenges",
                    content: selfAppraisalQuery.data?.challenges ?? "",
                  },
                  {
                    title: "Career Aspirations",
                    content: selfAppraisalQuery.data?.career_aspirations ?? "",
                  },
                ]}
              />
            )}
          </div>

          <div className="appraisal-right">
            <LeadFeedbackSummary
              appraisalId={String(id)}
              appraisalStatus={status.toUpperCase()}
              feedbacks={
                assignedLeadsQuery.data?.map((lead) => ({
                  feedbackId: String(lead.mapping_id),
                  leadName: lead.name,
                  status: lead.status.toUpperCase() as "PENDING" | "SUBMITTED",
                })) ?? []
              }
              onSelectLeads={() => setShowLeadModal(true)}
            />

            {showMeetingNotes && (
              <MeetingNotes appraisalId={id} appraisalStatus={status.toUpperCase()} />
            )}
          </div>
        </div>

        {showIDP && <IDP appraisalId={id} appraisalStatus={status} />}

        <LeadSelectionModal
          open={showLeadModal}
          employees={
            recommendationsQuery.data?.map((lead) => ({
              employeeId: String(lead.recommended_lead_id),
              employeeName: lead.name,
            })) ?? []
          }
          onClose={() => setShowLeadModal(false)}
          onDone={handleLeadSelectionDone}
        />

        {showActionFooter && (
          <ActionFooter
            buttonText={footerButtonText}
            handleClick={handleFooterClick}
          />
        )}
      </div>
    </div>
  );
};

export default Appraisal;