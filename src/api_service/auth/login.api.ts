import userBaseApi from "../api";
import type { LoginPayload, LoginResponse } from "./types";

export const loginApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: ({ username, password }) => {
        const body = new URLSearchParams();
        body.append("username", username);
        body.append("password", password);

        return {
          url: "/auth/login",
          method: "POST",
          body: body.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),
  }),
});

export const { useLoginMutation } = loginApi;