import { configureStore } from '@reduxjs/toolkit';
//import userReducer from './features/userSlice';
import searchReducer from './features/searchSlice';

const store = configureStore({
  reducer: {
  //  user: userReducer, // Stores user profiles after a search
    search: searchReducer, // Manages recent searches
  },
});

export default store;
