import userBaseApi from "../api";
import type { ListResponse } from "./types";

export interface AppraisalCycle {
  id: string;
  name: string; 
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
}

export const cycleApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCycles: builder.query<ListResponse<AppraisalCycle>, void>({
      query: () => "cycles",
      providesTags: ["Cycles"],
    }),
    getCycleById: builder.query<AppraisalCycle, string>({
      query: (id) => `cycle/${id}`,
      providesTags: (result, error, id) => [{ type: "Cycles", id }],
    }),
    createCycle: builder.mutation<AppraisalCycle, Partial<AppraisalCycle>>({
      query: (payload) => ({
        url: "/cycle",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cycles"],
    }),
    updateCycle: builder.mutation<AppraisalCycle, { id: string } & Partial<AppraisalCycle>>({
      query: ({ id, ...body }) => ({
        url: `cycle/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cycles", id }, "Cycles"],
    }),
  }),
});

export const {
  useGetCyclesQuery,
  useGetCycleByIdQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
} = cycleApi;