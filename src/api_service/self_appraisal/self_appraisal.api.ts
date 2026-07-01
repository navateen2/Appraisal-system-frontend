import userBaseApi from "../api";

export interface SelfAppraisal {
  id: number;
  appraisal_id: number;
  accomplishments: string | null;
  challenges: string | null;
  career_aspirations: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSelfAppraisalRequest {
  appraisal_id: number;
  accomplishments?: string;
  challenges?: string;
  career_aspirations?: string;
}

export interface UpdateSelfAppraisalRequest {
  accomplishments?: string;
  challenges?: string;
  career_aspirations?: string;
}

export const selfAppraisalApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSelfAppraisal: builder.mutation<
      SelfAppraisal,
      CreateSelfAppraisalRequest
    >({
      query: (body) => ({
        url: "/self-appraisals/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SelfAppraisal"],
    }),

    getAllSelfAppraisals: builder.query<SelfAppraisal[], void>({
      query: () => ({
        url: "/self-appraisals/",
      }),
      providesTags: ["SelfAppraisal"],
    }),

    getSelfAppraisalById: builder.query<SelfAppraisal, number>({
      query: (id) => ({
        url: `/self-appraisals/${id}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "SelfAppraisal", id },
      ],
    }),

    updateSelfAppraisal: builder.mutation<
      SelfAppraisal,
      {
        id: number;
        body: UpdateSelfAppraisalRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/self-appraisals/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SelfAppraisal", id },
        "SelfAppraisal",
      ],
    }),

    deleteSelfAppraisal: builder.mutation<void, number>({
      query: (id) => ({
        url: `/self-appraisals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SelfAppraisal"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateSelfAppraisalMutation,
  useGetAllSelfAppraisalsQuery,
  useGetSelfAppraisalByIdQuery,
  useUpdateSelfAppraisalMutation,
  useDeleteSelfAppraisalMutation,
} = selfAppraisalApi;