import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OldTicketPurchase {
  orderCode: string;
  ticketPurchaseId: number[];
  quantity: number;
}

const initialState: OldTicketPurchase = {
  orderCode: "",
  ticketPurchaseId: [],
  quantity: 0,
};

const ticketPurchase = createSlice({
  name: "ticketPurchase",
  initialState,
  reducers: {
    setTicketPurchase(state, action: PayloadAction<OldTicketPurchase>) {
      return { ...action.payload };
    },
    clearTicketPurchase() {
      return initialState;
    },
  },
});

export const { setTicketPurchase, clearTicketPurchase } =
  ticketPurchase.actions;
export default ticketPurchase.reducer;
