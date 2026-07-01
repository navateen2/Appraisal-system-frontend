import userBaseApi from "../api";

export interface FeedbackItemPayload {
  competency_id: number;
  score: number;
  strengths: string;
  improvements: string;
}

export interface CreateFeedbackFormPayload {
  items: FeedbackItemPayload[];
}

export interface UpdateFeedbackFormPayload {
  items: FeedbackItemPayload[];
}

export interface FeedbackDetail {
  id: number;
  competency_id: number;
  competency_name: string;
  score: number;
  strengths: string;
  improvements: string;
}

export interface FeedbackFormResponse {
  mapping_id: number;
  lead_id: number;
  appraisal_id: number;
  status: string;
  feedbacks: FeedbackDetail[];
}

export const leadFeedbackApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadFeedbackForm: builder.query<FeedbackFormResponse, number>({
      query: (mappingId) => ({
        url: `/feedback/mapping/${mappingId}/form`,
        method: "GET",
      }),
      providesTags: (_result, _error, mappingId) => [
        { type: "LeadFeedback", id: mappingId },
      ],
    }),

    createLeadFeedbackForm: builder.mutation<
      FeedbackFormResponse,
      {
        mappingId: number;
        body: CreateFeedbackFormPayload;
      }
    >({
      query: ({ mappingId, body }) => ({
        url: `/feedback/mapping/${mappingId}/form`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { mappingId }) => [
        { type: "LeadFeedback", id: mappingId },
      ],
    }),

    updateLeadFeedbackForm: builder.mutation<
      FeedbackFormResponse,
      {
        mappingId: number;
        body: UpdateFeedbackFormPayload;
      }
    >({
      query: ({ mappingId, body }) => ({
        url: `/feedback/mapping/${mappingId}/form`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { mappingId }) => [
        { type: "LeadFeedback", id: mappingId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetLeadFeedbackFormQuery,
  useCreateLeadFeedbackFormMutation,
  useUpdateLeadFeedbackFormMutation,
} = leadFeedbackApi;