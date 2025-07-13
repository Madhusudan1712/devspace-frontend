import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";

function HomeRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage/>} />
      </Routes>
    </>
  );
}

export default HomeRoutes;