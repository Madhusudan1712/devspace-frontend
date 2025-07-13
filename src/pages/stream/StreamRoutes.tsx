import { Routes, Route } from "react-router-dom";
import StreamPage from "./StreamPage";

function StreamRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<StreamPage />} />
        {/* <Route path="new" element={<ProfileForm mode="newProfile"/>} />
        <Route path="edit" element={<ProfileForm mode="editProfile" />} /> */}
      </Routes>
    </>
  );
}

export default StreamRoutes;