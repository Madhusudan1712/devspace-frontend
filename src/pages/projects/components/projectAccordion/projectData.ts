export interface ProjectData {
  id: string;
  title: string;
  status: "dev" | "stg" | "prod" | "local";
  techStack: string[];
  description: string[];
  links: {
    github?: { label: string; url: string }[];
    app?: string;
  };
}

export const sampleProjects: ProjectData[] = [
  {
    id: "1",
    title: "Interactive Biomedical lab Too",
    status: "dev",
    techStack: [
      "React",
      "TypeScript",
      "Redux",
      "DND Drag and Drop",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "GSAP Animation",
    ],
    description: [
      "Built advanced draggable, interactive React UI components improving student task completion by ~35%.",
      "Integrated Spring Boot backend with PostgreSQL, Amazon S3, and role-based access control for task flow",
      "Implemented real-time result tracking and instructor notifications, reducing review overhead by ~40%.",
      "More other feature are in development ...",
    ],
    links: {
      app: "https://www.pearson.com/en-us/subject-catalog/p/physioex-100-laboratory-simulations-in-physiology/P200000010623/9780136447658?srsltid=AfmBOoqS_PLNovh_mN59chHWwdowV33IBjRTlzXvPBS9ZCtGXWjTuWQZ",
    },
  },
  {
    id: "2",
    title: "Nutrition & Activity Tracking App - My Diet Analysis",
    status: "prod",
    techStack: [
      "React",
      "TypeScript",
      "Redux",
      "Accessibility Frindly",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "AWS",
    ],
    description: [
      "Delivered a modern React 18 + TypeScript SPA using Vite, Redux Toolkit, MUI, React Router v7.",
      "Integrated enterprise SSO (piSession/IES) with fully protected routes and token-based interceptors.",
      "Added Charts, Analytics dashboards, ExcelJS - PDF/print exports, reducing report generation effort by ~60%.",
      "Developed secure Spring Boot APIs with JWT + Swagger, optimized SQL queries, and S3-based report data.",
      "Improved frontend performance by ~25% using memorization, lazy loading, and optimized API batching.",
    ],
    links: {
      app: "https://www.pearson.com/en-us/higher-education/products-services/mydietanalysis.html?srsltid=AfmBOorEfde9hRQjOEmNlqTd1x1266Chacv2WKD8Ea_7VqV_mrKFPTO9",
    },
  },
  {
    id: "3",
    title: "Centralized Authentication System - SSO Platform",
    status: "prod",
    techStack: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "JWT",
      "Cookies",
      "SSO Auth",
      "Render Host",
    ],
    description: [
      "Built a CAS protocol–based SSO system using Spring Boot, JWT cookie and Dockerized deployment",
      "Created a React + Redux frontend with lazy loading, role-based routing, multi-app token handling.",
      "Reduced redundant logins across tools by ~80%, simplifying user onboarding and access control.",
    ],
    links: {
      github: [
        {
          label: "Frontend",
          url: "https://github.com/Madhusudan1712/auth-frontend",
        },
        {
          label: "Backend",
          url: "https://github.com/Madhusudan1712/auth-backend",
        },
      ],
    },
  },
  {
    id: "4",
    title: "DevSpace Platform",
    status: "prod",
    techStack: ["React", "TypeScript", "Social logins", "CloudFlare Host"],
    description: [
      "Comprehensive platform for creative collaboration and project management",
      "Collaborative Artical writhing or Blog Sharing",
    ],
    links: {
      github: [
        {
          label: "Frontend",
          url: "https://github.com/Madhusudan1712/devspace-frontend",
        },
      ],
      app: "https://dev.madhusudan.space/stream",
    },
  },
  {
    id: "4",
    title: "Office Suite Alternative",
    status: "prod",
    techStack: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Docker"],
    description: [
      "Developed key Office 365-style features using C#, .NET MVC, JavaScript, and jQuery.",
      "Added multi-device accessibility and event-driven actions by improving interaction responsiveness by ~30%.",
      "Migrated document workflows to Amazon S3, improving reliability and reducing file retrieval latency.",
    ],
    links: {
      app: "https://www.pearson.com/en-us/higher-education/products-services/mylab/it.html?srsltid=AfmBOoqxv5KxTPg1hvHXtM4mU8OGd1zBn9xDrQiskUG1z9xFHHm71eQf",
    },
  },
  {
    id: "5",
    title: "Customer Account Tracker",
    status: "local",
    techStack: ["Python", "Django", "React", "PostgreSQL", "Celery"],
    description: [
      "Built a production-ready CRUD + fund transfer system with Spring Boot, enhancing transactional accuracy.",
      "Developed responsive React UI with Redux, improving navigation efficiency by ~20%.",
    ],
    links: {
      github: [
        {
          label: "Backend",
          url: "https://github.com/Madhusudan1712/CustomerAccountTracker",
        },
      ],
    },
  },
];
