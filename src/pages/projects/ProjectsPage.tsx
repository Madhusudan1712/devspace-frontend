import LogoSlider from "../../components/common/logoSlider/LogoSlider";
import teckStackLogo from "../../constants/teckStackLogo.json";

function ProjectsPage() {
  return (
    <>
      <LogoSlider logos={teckStackLogo} />
    </>
  );
}

export default ProjectsPage;
