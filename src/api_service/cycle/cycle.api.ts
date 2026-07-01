import userBaseApi from "../api";
import type { ListResponse } from "./types";

export interface AppraisalCycle {
  id: number;
  name: string; 
  start_date: string;
  end_date: string;
  status: 'Initiated' | 'Completed' | 'In Progress';
}

export interface AssignmentParam {
  employee_ids: number[];
}

export interface AppraisalAssignedItem {
  id: number;
  cycle_id: number;
  employee_id: number;
  status: string;
}

export interface AppraisalAssignedItemWithName {
  id: number;
  employee_id: number;
  status: string;
  employee_name: string;
}


export interface BulkAssignmentResponse {
  successfully_assigned: AppraisalAssignedItem[];
  already_assigned_employee_ids: number[];
}

export const cycleApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCycles: builder.query<ListResponse<AppraisalCycle>, void>({
      query: () => "cycles",
      providesTags: ["Cycles"],
    }),
    getCycleById: builder.query<AppraisalCycle, string>({
      query: (id) => `cycles/${id}`,
      providesTags: (result, error, id) => [{ type: "Cycles", id }],
    }),
    createCycle: builder.mutation<AppraisalCycle, Partial<AppraisalCycle>>({
      query: (payload) => ({
        url: "/cycles",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cycles"],
    }),
    updateCycle: builder.mutation<AppraisalCycle, { id: string } & Partial<AppraisalCycle>>({
      query: ({ id, ...body }) => ({
        url: `cycles/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cycles", id }, "Cycles"],
    }),
    assignEmployeesToCycle: builder.mutation<
        BulkAssignmentResponse,
        {
          cycle_id: number;
          body: AssignmentParam;
        }
      >({
        query: ({ cycle_id, body }) => ({
          url: `/cycles/${cycle_id}/assignments`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Cycles", "CycleAssignments"],
      }),

      /**
       * DELETE /cycle/{cycle_id}/assignments/{employee_id}
       */
      removeEmployeeFromCycle: builder.mutation<
        { message: string },
        {
          cycle_id: number;
          employee_id: number;
        }
      >({
        query: ({ cycle_id, employee_id }) => ({
          url: `/cycles/${cycle_id}/assignments/${employee_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cycles", "CycleAssignments"],
      }),

      getAppraisalsByCycleId: builder.query<AppraisalAssignedItemWithName[], number>({
        query: (cycle_id) => `/cycles/${cycle_id}/appraisals`,
        providesTags: (result, error, cycle_id) => [{ type: "CycleAssignments", id: cycle_id }],
      }),
    }),

    overrideExisting: false,
});



export const {
  useGetCyclesQuery,
  useGetCycleByIdQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useAssignEmployeesToCycleMutation,
  useRemoveEmployeeFromCycleMutation,
  useGetAppraisalsByCycleIdQuery,
} = cycleApi;


 
