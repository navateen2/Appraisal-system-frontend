import userBaseApi from "../api";

export interface LeadRecommendationRequest {
  recommended_lead_ids: number[];
}

export interface LeadRecommendationResponse {
  status: string;
  recommended_lead_ids: number[];
}

export interface RecommendedLead {
  recommended_lead_id: number;
  name: string;
  email: string;
}

export const leadRecommendationApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrUpdateLeadRecommendations: builder.mutation<
      LeadRecommendationResponse,
      {
        appraisalId: number;
        body: LeadRecommendationRequest;
      }
    >({
      query: ({ appraisalId, body }) => ({
        url: `/appraisals/${appraisalId}/lead-recommendations`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { appraisalId }) => [
        { type: "LeadRecommendation", id: appraisalId },
      ],
    }),

    getLeadRecommendations: builder.query<
      RecommendedLead[],
      number
    >({
      query: (appraisalId) => ({
        url: `/appraisals/${appraisalId}/lead-recommendations`,
      }),
      providesTags: (_result, _error, appraisalId) => [
        { type: "LeadRecommendation", id: appraisalId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateOrUpdateLeadRecommendationsMutation,
  useGetLeadRecommendationsQuery,
} = leadRecommendationApi;