import userBaseApi from "../api";

export interface AppraisalSummaryRequest {
  appraisal_id: number;
}

export interface AppraisalSummaryResponse {
  appraisal_id: number;
  summary: string;
}

export const generateSummaryApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateAppraisalSummary: builder.mutation<
      AppraisalSummaryResponse,
      AppraisalSummaryRequest
    >({
      query: (body) => ({
        url: "/ai/appraisal-summary",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGenerateAppraisalSummaryMutation,
} = generateSummaryApi;