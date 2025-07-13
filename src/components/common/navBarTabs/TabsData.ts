import Home from "../../../pages/home/HomePage";
import Stream from "../../../pages/stream/StreamPage";
import Projects from "../../../pages/projects/ProjectsPage";
import Experience from "../../../pages/experience/ExperiencePage";

export const tabsData = [
  {
    key: "home",
    label: "Home",
    component: Home,
    path: "/home"
  },
  {
    key: "stream",
    label: "Stream",
    component: Stream,
    path: "/stream"
  },
  {
    key: "projects",
    label: "Projects",
    component: Projects,
    path: "/projects"
  },
  {
    key: "experience",
    label: "Experience",
    component: Experience,
    path: "/experience"
  }
];
