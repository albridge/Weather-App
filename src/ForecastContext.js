import React, { useState, createContext } from "react";

export const ForecastContext = createContext();
export const ForecastProvider = (props) => {
  const [forc, setForc] = useState([]);

  return (
    <ForecastContext.Provider value={[forc, setForc]}>
      {props.children}
    </ForecastContext.Provider>
  );
};
