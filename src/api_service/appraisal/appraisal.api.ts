import userBaseApi from "../api";
import type { ListResponse } from "./types";

export const appraisalApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppraisals: builder.query<ListResponse, void>({
      query: () => "appraisal",
      providesTags: ["Appraisals"],
    }),
    
    getAppraisalById: builder.query({
      query: (id) => `appraisal/${id}`,
      providesTags: (result, error, id) => [{ type: "Appraisals", id }],
    }),
    
    createAppraisal: builder.mutation({
      query: (payload) => ({
        url: "/appraisal",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Appraisals"],
    }),
    
    updateAppraisal: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `appraisal/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Appraisals", id },
        "Appraisals"
      ],
    }),
    
    // 5. Permanent deletion removal handling
    deleteAppraisal: builder.mutation({
      query: (id) => ({
        url: `appraisal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appraisals"],
    }),

    getEmployeeAppraisalHistory: builder.query({
      query: (id:number) => `appraisal/${id}/appraisals`,
      providesTags: ["Appraisals"],
    }),

    updateAppraisalStatus: builder.mutation({
      query: ({
        appraisalId,
        status,
      }: {
        appraisalId: number;
        status: string;
      }) => ({
        url: `appraisal/${appraisalId}/status`,
        method: "PUT",
        body: {
          status,
        },
      }),
      invalidatesTags: (result, error, { appraisalId }) => [
        { type: "Appraisals", id: appraisalId },
        "Appraisals",
      ],
    }),
  }),
});


export const {
  useGetAppraisalsQuery,
  useGetAppraisalByIdQuery,
  useCreateAppraisalMutation,
  useUpdateAppraisalMutation,
  useDeleteAppraisalMutation,
  useGetEmployeeAppraisalHistoryQuery,
  useUpdateAppraisalStatusMutation
} = appraisalApi;