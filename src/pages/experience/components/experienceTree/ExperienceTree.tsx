import React from "react";
import styles from "./experienceTree.module.scss";


export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  roleType?: string;
  start: string;
  end: string;
  location?: string;
  employmentType?: string;
  verified?: boolean;
  featured?: boolean;
  muted?: boolean; // for older roles
  bullets?: string[]; // description bullet points
};

export type ExperienceCompany = {
  id: string;
  company: string;
  brand?: string; // image URL or single-letter placeholder
  roles: ExperienceItem[];
};

type ExperienceTreeProps = {
  groups?: ExperienceCompany[];
  items?: ExperienceItem[]; // fallback: will be grouped by company
  className?: string;
};

// Example data to mirror the screenshot layout
export const exampleExperienceGroups: ExperienceCompany[] = [
  {
    id: "excelsoft",
    company: "Excelsoft Technologies Ltd.",
    brand: ((import.meta as any).env.VITE_EXCELSOFT_LOGO_URL as string | undefined) || "E",
    roles: [
      {
        id: "excelsoft-ase",
        company: "Excelsoft Technologies Ltd.",
        role: "Associate Software Engineer",
        roleType: "Full-stack",
        start: "Feb 2025",
        end: "Present",
        location: "Mysore, India",
        employmentType: "Full-Time",
        verified: true,
        bullets: [
          "Developing an advanced React-based biomedical learning platform (PhysioEx) with interactive and draggable UI elements using the DnD library. Implemented realistic lab experiment simulations, viva MCQs, and real-time result tracking for students. Focused on creating an immersive, user-friendly, and performance-optimized learning experience",
          "Integrating a Java Spring Boot backend with PostgreSQL and Amazon S3 for secure experiment storage and rapid data retrieval. Enabled instructor notifications, instant result display, and structured experiment management workflows. Implemented robust role-based access control (RBAC) for safe and compliant usage across user types.",
          "Built a full-scale React 18 + TypeScript SPA for diet/activity analysis with Vite, Redux Toolkit, React Router v7, MUI, and multilingual support via react-i18next. Delivered modules for profiles, tracking, reporting, food/recipe management, and class administration. Strengthened reliability through SSO integration, protected routes, token interceptors, Jest tests, and SonarQube quality gates.",
          "Implemented complete analytics and export features using Chart.js/Recharts, ExcelJS, html2pdf.js, and react-to-print. Containerized and deployed the application using Docker + Nginx for high-performance production hosting. Developed a secure Spring Boot REST API backend with JWT auth, Swagger documentation, AWS S3 integration, and SMTP-based notifications."
        ],
      },
      {
        id: "excelsoft-tse",
        company: "Excelsoft Technologies Ltd.",
        role: "Trainee Software Engineer",
        roleType: "Frontend",
        start: "Feb 2024",
        end: "Feb 2025",
        location: "Mysore, India",
        employmentType: "Full-Time",
        verified: true,
        bullets: [
          "Developed a scalable .NET (C#) application that replicated essential Office 365 (2025) features to help reduce organizational licensing costs. Implemented secure and efficient data handling by storing and managing all task-related data in Amazon S3.",
          "Built interactive, event-driven interfaces using JavaScript and jQuery to enhance responsiveness and streamline user interactions. Improved overall accessibility by enabling seamless multi-access support for both mouse and keyboard navigation.",
          "Contributed to system architecture and feature development across the SIM5 app-link platform by integrating reusable components and optimizing performance. Ensured smooth communication between the front-end and AWS services for reliable task operations."
        ],
      },
    ],
  },
  {
    id: "audaz-learning",
    company: "Audaz Learning",
    brand: ((import.meta as any).env.VITE_AUDAZ_LOGO_URL as string | undefined) || "A",
    roles: [
      {
        id: "audaz-learning-intern",
        company: "Audaz Learning",
        role: "Internship Trainee",
        roleType: "Backend",
        start: "Aug 2023",
        end: "Sep 2023",
        location: "Bengaluru, India",
        employmentType: "Internship",
        verified: true,
        bullets: [
          "Developed a RESTful Spring Boot backend enabling customer account management with CRUD operations, fund transfers, balance checks, and transaction history. Focused on delivering reliable, structured APIs to ensure accuracy and smooth data flow across the application.",
          "Built a responsive React frontend integrated with Redux and React Router for seamless navigation and centralized state management. Enhanced user experience through efficient API communication and consistent UI behavior across all modules.",
          "Collaborated on end-to-end feature development by connecting frontend workflows with backend services. Ensured stable performance and usability by optimizing data fetching, routing, and state synchronization."
        ],
      }
    ],
  },
];

function groupByCompany(items: ExperienceItem[]): ExperienceCompany[] {
  const map = new Map<string, ExperienceCompany>();
  const order: string[] = [];
  items.forEach((it) => {
    if (!map.has(it.company)) {
      map.set(it.company, { id: it.company.toLowerCase(), company: it.company, roles: [] });
      order.push(it.company);
    }
    map.get(it.company)!.roles.push(it);
  });
  return order.map((c) => map.get(c)!);
}

const ExperienceTree: React.FC<ExperienceTreeProps> = ({
  groups,
  items,
  className,
}) => {
  const data: ExperienceCompany[] =
    groups ?? (items ? groupByCompany(items) : exampleExperienceGroups);

  return (
    <section className={`${styles["experience-tree"]} ${className ?? ""}`.trim()}>
      <ol className={styles.timeline} aria-label="Work experience timeline">
        {data.map((group, index) => {
          const isLastGroup = index === data.length - 1;
          const companyLocation = group.roles?.[0]?.location;
          const brandStr = group.brand;
          const isBrandImage = !!brandStr && /^(https?:\/\/|data:)/i.test(brandStr);
          return (
            <li key={group.id} className={styles.group}>
              <span className={styles.marker} aria-hidden>
                {isBrandImage ? (
                  <img className={styles.brandIcon} src={brandStr as string} />
                ) : (
                  (brandStr ? brandStr : group.company.charAt(0))
                )}
              </span>
              {!isLastGroup && <span className={styles.connector} aria-hidden />}
              <div className={styles.block}>
                <div className={styles.companyRow}>
                  <div className={styles.companyLine}>
                    <span className={styles.company}>{group.company}</span>
                    {companyLocation && (
                      <span className={styles.companyMeta}>
                        <span className={styles.dot}>•</span>
                        {companyLocation}
                      </span>
                    )}
                  </div>
                </div>
                <ul className={styles.roles}>
                  {group.roles.map((r) => (
                    <li
                      key={r.id}
                      className={`${styles.roleItem} ${r.muted ? styles.muted : ""}`.trim()}
                    >
                      <div className={styles.roleTitle}>
                        {r.role}
                        {r.roleType && <span className={styles.roleKind}>{r.roleType}</span>}
                        {r.verified && <span className={styles.badgeVerified} title="Verified">✓</span>}
                        {r.featured && <span className={styles.badgeFeatured} title="Featured">★</span>}
                      </div>
                      <div className={styles.meta}>
                        <span className={styles.range}>
                          {r.start} – {r.end}
                        </span>
                        {r.employmentType && (
                          <>
                            <span className={styles.dot}>•</span>
                            <span>{r.employmentType}</span>
                          </>
                        )}
                      </div>
                  {r.bullets && r.bullets.length > 0 && (
                    <ul className={styles.bullets}>
                      {r.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ExperienceTree;
