import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userBaseApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers) => {
      // Retrieve the token from the state (assuming it's stored in the auth slice)
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
  tagTypes: ["Users","Appraisals","Cycles","LeadFeedback"],
});

export default userBaseApi;
