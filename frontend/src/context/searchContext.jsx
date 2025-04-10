import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const SearchContext = createContext();

export const useSearchContext = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Optimized function using useCallback to prevent unnecessary re-renders
  const searchUsers = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/search?query=${query}`);

      // Prevent unnecessary state updates if the data is the same
      setSearchResults((prevResults) =>
        JSON.stringify(prevResults) !== JSON.stringify(response.data.users)
          ? response.data.users
          : prevResults,
      );
    } catch (error) {
      setError('Error fetching search results');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SearchContext.Provider
      value={{ searchResults, loading, error, searchUsers }}
    >
      {children}
    </SearchContext.Provider>
  );
};
