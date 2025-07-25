import React, { createContext, useState } from "react";

// Context to hold selected recommendations (activities)
export const SelectedRecommendationsContext = createContext({
  selectedRecommendations: [],
  setSelectedRecommendations: () => {},
});

/**
 * Provider for selected recommendations (activities).
 * Wrap your app in this provider to access and update selected activities from anywhere.
 */
export function SelectedRecommendationsProvider({ children }) {
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  return (
    <SelectedRecommendationsContext.Provider value={{ selectedRecommendations, setSelectedRecommendations }}>
      {children}
    </SelectedRecommendationsContext.Provider>
  );
} 