import { configureStore } from "@reduxjs/toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Vehicle, VehicleCondition, DateFilter } from "@shared/schema";

interface FiltersState {
  condition: VehicleCondition | null;
  brand: string | null;
  dateFilter: DateFilter | null;
}

const initialState: FiltersState = {
  condition: null,
  brand: null,
  dateFilter: null
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCondition(state, action: PayloadAction<VehicleCondition | null>) {
      state.condition = action.payload;
    },
    setBrand(state, action: PayloadAction<string | null>) {
      state.brand = action.payload;
    },
    setDateFilter(state, action: PayloadAction<DateFilter | null>) {
      state.dateFilter = action.payload;
    },
    resetFilters(state) {
      state.condition = null;
      state.brand = null;
      state.dateFilter = null;
    }
  }
});

export const store = configureStore({
  reducer: {
    filters: filtersSlice.reducer
  }
});

export const { setCondition, setBrand, setDateFilter, resetFilters } = filtersSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
