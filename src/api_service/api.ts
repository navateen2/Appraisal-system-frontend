import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userBaseApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
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
  tagTypes: ["Users","Appraisals"],
});

export default userBaseApi;
