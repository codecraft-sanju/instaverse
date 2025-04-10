// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // Async thunk to fetch user data from API
// export const fetchUserById = createAsyncThunk(
//   'user/fetchUserById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`/api/user/${id}`);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   },
// );

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//     selectedUser: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearSelectedUser: (state) => {
//       state.selectedUser = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedUser = action.payload;
//       })
//       .addCase(fetchUserById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearSelectedUser } = userSlice.actions;
// export default userSlice.reducer;
