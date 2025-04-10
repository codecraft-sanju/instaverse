import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    recentSearches: [],
  },
  reducers: {
    addToRecentSearches: (state, action) => {
      const userExists = state.recentSearches.some(
        (user) => user._id === action.payload._id,
      );
      if (!userExists) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 7) {
          state.recentSearches.pop(); // Limit to 7 searches
        }
      }
    },
    removeFromRecentSearches: (state, action) => {
      state.recentSearches = state.recentSearches.filter(
        (user) => user.username !== action.payload,
      );
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

export const {
  addToRecentSearches,
  removeFromRecentSearches,
  clearRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;
