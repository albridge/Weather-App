import Home from "./components/Home";

import { ForecastProvider } from "./ForecastContext";
function App() {
  return (
    <ForecastProvider>
      <div style={{ margin: "auto" }}>
        <Home />
      </div>
    </ForecastProvider>
  );
}

export default App;
