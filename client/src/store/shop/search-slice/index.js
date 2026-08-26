import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSearchResults = createAsyncThunk(
  "/search/getSearchResults",
  async (keyword) => {
    const response = await axios.get(`http://localhost:5000/api/shop/search/${keyword}`);
    return response.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState: { isLoading: false, searchResults: [] },
  reducers: {
    resetSearchResults: (state) => { state.searchResults = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => { state.isLoading = true; })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;