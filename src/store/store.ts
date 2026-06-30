import { configureStore } from "@reduxjs/toolkit";
import userBaseApi from "../api_service/api";

const store = configureStore({
  reducer: {
    [userBaseApi.reducerPath]: userBaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userBaseApi.middleware),
});

export default store;