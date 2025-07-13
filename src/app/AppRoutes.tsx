// src/app/Routes.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/common/loading/Loading';

// Lazy loading your components
const HomePage = lazy(() => import('../pages/home/HomeRoutes'));
const StreamPage = lazy(() => import('../pages/stream/StreamRoutes'));
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsRoutes'));
const ExperiencePage = lazy(() => import('../pages/experience/ExperienceRoutes'));
const NotFoundPage = lazy(() => import('../pages/notFound/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route path="/" element={<Navigate to="/stream" replace />} />
        <Route path="/home/*" element={<HomePage />} />
        <Route path="/stream/*" element={<StreamPage />} />
        <Route path="/projects/*" element={<ProjectsPage />} />
        <Route path="/experience/*" element={<ExperiencePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
