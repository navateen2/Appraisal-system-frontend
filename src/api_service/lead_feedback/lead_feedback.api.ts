import userBaseApi from "../api";

export interface FeedbackItem {
  question_id: number;
  rating?: number;
  comment?: string;
}

export interface FeedbackFormResponse {
  id: number;
  mapping_id: number;
  employee_id: number;
  items: FeedbackItem[];
}

export interface CreateFeedbackFormPayload {
  items: FeedbackItem[];
}

export interface UpdateFeedbackFormPayload {
  items: FeedbackItem[];
}

export const leadFeedbackApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadFeedbackForm: builder.query<
      FeedbackFormResponse,
      number
    >({
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