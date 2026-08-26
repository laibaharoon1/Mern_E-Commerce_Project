import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk("/review/addReview", async (data) => {
  const response = await axios.post("http://localhost:5000/api/shop/review/add", data);
  return response.data;
});

export const getReviews = createAsyncThunk("/review/getReviews", async (id) => {
  const response = await axios.get(`http://localhost:5000/api/shop/review/${id}`);
  return response.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.data;
      });
  },
});

export default reviewSlice.reducer;