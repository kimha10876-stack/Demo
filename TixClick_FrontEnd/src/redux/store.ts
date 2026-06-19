import { configureStore } from "@reduxjs/toolkit";
import ticketPurchaseReducer from "./features/ticketPurchase/ticketPurchaseSlice";
export const store = configureStore({
  reducer: {
    ticketPurchase: ticketPurchaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
