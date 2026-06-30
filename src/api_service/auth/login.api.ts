import userBaseApi from "../api";
import type { LoginPayload, LoginResponse } from "./types";

export const loginApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (payload) => {
        const body = new URLSearchParams();
        body.append("username", payload.username);
        body.append("password", payload.password);
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
