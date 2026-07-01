import userBaseApi from "../api";
import type { IDPCreateUpdate, IDPResponse, ListResponse, MeetingNotesCreateUpdate, MeetingNotesGetResponse, MeetingNotesMutationResponse } from "./types";

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

    getAppraisalIdp: builder.query<IDPResponse, number>({
      query: (appraisalId) => `appraisal/${appraisalId}/idp`,
      providesTags: ["Appraisals"],
    }),

    createIdpText: builder.mutation<IDPResponse, { appraisalId: number; body: IDPCreateUpdate }>({
      query: ({ appraisalId, body }) => ({
        url: `appraisal/${appraisalId}/idp`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Appraisals"],
    }),

    updateIdpText: builder.mutation<IDPResponse, { appraisalId: number; body: IDPCreateUpdate }>({
      query: ({ appraisalId, body }) => ({
        url: `appraisal/${appraisalId}/idp`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Appraisals"],
    }),

    getAppraisalMeetingNotes: builder.query<MeetingNotesGetResponse, number>({
      query: (appraisalId) => `appraisal/${appraisalId}/meeting-notes`,
      providesTags: ["Appraisals"],
    }),

    createMeetingNotes: builder.mutation<MeetingNotesMutationResponse, { appraisalId: number; body: MeetingNotesCreateUpdate }>({
      query: ({ appraisalId, body }) => ({
        url: `appraisal/${appraisalId}/meeting-notes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Appraisals"],
    }),

    updateMeetingNotes: builder.mutation<MeetingNotesMutationResponse, { appraisalId: number; body: MeetingNotesCreateUpdate }>({
      query: ({ appraisalId, body }) => ({
        url: `appraisal/${appraisalId}/meeting-notes`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Appraisals"],
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
  useGetAppraisalIdpQuery,
  useCreateIdpTextMutation,
  useUpdateIdpTextMutation,
  useGetAppraisalMeetingNotesQuery,
  useCreateMeetingNotesMutation,
  useUpdateMeetingNotesMutation,
} = appraisalApi;