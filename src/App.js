import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from "react-router-dom";
import Draw from "./Draw";
import Map from "./Map";

const queryClient = new QueryClient();

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <QueryClientProvider client={queryClient}>
            <Map />
          </QueryClientProvider>
        }
      ></Route>
      <Route path="/draw" element={<Draw />}></Route>
    </Routes>
  );
}

export default App;
