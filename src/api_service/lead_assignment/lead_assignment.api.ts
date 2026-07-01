import userBaseApi from "../api";

export interface LeadAssignmentResponse {
  id: number;
  appraisal_id: number;
  lead_id: number;
  employee_id: number;
  employee_name:string,
  status: string;
  assigned_by: number;
  created_at: string;
  deleted_at:string
}

export interface AssignedLeadProfileResponse {
  mapping_id: number;
  lead_id: number;
  name: string;
  email: string;
  status: string;
}

export interface SubmitFeedbackResponse {
  message: string;
  status: string;
}

export interface AssignLeadsRequest {
  lead_ids: number[];
}

export const leadAssignmentApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Assign leads to an appraisal
     * POST /appraisal/{appraisal_id}/leads
     */
    assignLeads: builder.mutation<
      LeadAssignmentResponse[],
      {
        appraisalId: number;
        body: AssignLeadsRequest;
      }
    >({
      query: ({ appraisalId, body }) => ({
        url: `/appraisal/${appraisalId}/leads`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LeadAssignment"],
    }),

    /**
     * Get assigned leads
     * GET /appraisal/{appraisal_id}/leads
     */
    getAssignedLeads: builder.query<
      AssignedLeadProfileResponse[],
      number
    >({
      query: (appraisalId) => ({
        url: `/appraisal/${appraisalId}/leads`,
        method: "GET",
      }),
      providesTags: ["LeadAssignment"],
    }),

    /**
     * Remove assigned lead
     * DELETE /appraisal/lead-assignment/{mapping_id}
     */
    removeAssignedLead: builder.mutation<
      string,
      number
    >({
      query: (mappingId) => ({
        url: `/appraisal/lead-assignment/${mappingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeadAssignment"],
    }),

    /**
     * Submit lead feedback
     * POST /appraisal/lead-assignment/{mapping_id}/submit
     */
    submitLeadFeedback: builder.mutation<
      SubmitFeedbackResponse,
      number
    >({
      query: (mappingId) => ({
        url: `/appraisal/lead-assignment/${mappingId}/submit`,
        method: "POST",
      }),
      invalidatesTags: ["LeadAssignment"],
    }),

    /**
     * Get pending assignments for a lead
     * GET /appraisal/lead-assignment/lead/{lead_id}
     */
    getPendingAssignments: builder.query<
      LeadAssignmentResponse[],
      number
    >({
      query: (leadId) => ({
        url: `/appraisal/lead-assignment/lead/${leadId}`,
        method: "GET",
      }),
      providesTags: ["LeadAssignment"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useAssignLeadsMutation,
  useGetAssignedLeadsQuery,
  useRemoveAssignedLeadMutation,
  useSubmitLeadFeedbackMutation,
  useGetPendingAssignmentsQuery,
} = leadAssignmentApi;