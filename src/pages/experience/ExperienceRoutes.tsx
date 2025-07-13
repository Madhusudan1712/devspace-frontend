import { Routes, Route } from "react-router-dom";
import ExperiencePage from "./ExperiencePage";

function ExperienceRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<ExperiencePage/>} />
      </Routes>
    </>
  );
}

export default ExperienceRoutes;