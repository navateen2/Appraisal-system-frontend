import userBaseApi from "../api";
import type { ListResponse } from "./types";

export interface AppraisalCycle {
  id: string;
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
      query: (id) => `cycle/${id}`,
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
        url: `cycle/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cycles", id }, "Cycles"],
    }),
    assignEmployeesToCycle: builder.mutation<
        BulkAssignmentResponse,
        {
          cycleId: number;
          body: AssignmentParam;
        }
      >({
        query: ({ cycleId, body }) => ({
          url: `/cycle/${cycleId}/assignments`,
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
          cycleId: number;
          employeeId: number;
        }
      >({
        query: ({ cycleId, employeeId }) => ({
          url: `/cycle/${cycleId}/assignments/${employeeId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cycles", "CycleAssignments"],
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
} = cycleApi;


 
