import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { DemoProvider } from './contexts/DemoContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const PendingApprovalPage = lazy(() => import('./pages/PendingApprovalPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const VisitPage = lazy(() => import('./pages/VisitPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ActionsPage = lazy(() => import('./pages/ActionsPage'));
const ActionDetailPage = lazy(() => import('./pages/ActionDetailPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1B2A4A] border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <ToastProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/en-attente" element={<PendingApprovalPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/carte" element={<MapPage />} />
                <Route path="/visites" element={<VisitPage />} />
                <Route path="/actions" element={<ActionsPage />} />
                <Route path="/actions/:actionId" element={<ActionDetailPage />} />
                <Route
                  path="/equipe"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'coordinateur_terrain', 'direction_campagne']}>
                      <TeamPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </DemoProvider>
    </BrowserRouter>
  );
}

export default App;
