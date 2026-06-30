import userBaseApi from "../api";
import type { ListResponse } from "./types";

export const userApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ListResponse, void>({
      query: () => "user",
      providesTags: ["Users"],
    }),
    searchUsers: builder.query<any[], string>({
      query: (name) => `user/search/${name}`,
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => `user/${id}`,
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/user",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `user/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useSearchUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
