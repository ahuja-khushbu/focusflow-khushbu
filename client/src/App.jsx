import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Spinner from './components/ui/Spinner.jsx';
import useUIStore from './store/uiStore.js';
import { injectNavigate } from './lib/api.js';

const LoginPage = lazy(() => import('./pages/Auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage.jsx'));
const BoardsPage = lazy(() => import('./pages/Boards/BoardsPage.jsx'));
const BoardViewPage = lazy(() => import('./pages/Boards/BoardViewPage.jsx'));
const TasksListPage = lazy(() => import('./pages/Tasks/TasksListPage.jsx'));
const TaskDetailPage = lazy(() => import('./pages/Tasks/TaskDetailPage.jsx'));
const TagsPage = lazy(() => import('./pages/Settings/TagsPage.jsx'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

const App = () => {
  const darkMode = useUIStore((s) => s.darkMode);
  const navigate = useNavigate();

  useEffect(() => {
    injectNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/boards/:id" element={<BoardViewPage />} />
          <Route path="/tasks" element={<TasksListPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/settings/tags" element={<TagsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
