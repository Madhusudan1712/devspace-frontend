import { Routes, Route } from "react-router-dom";
import ProjectsPage from "./ProjectsPage";

function ProjectsRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<ProjectsPage/>} />
      </Routes>
    </>
  );
}

export default ProjectsRoutes;