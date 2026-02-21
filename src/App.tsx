import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { DemoProvider } from './contexts/DemoContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { VisitPage } from './pages/VisitPage';
import { TeamPage } from './pages/TeamPage';
import { ActionDetailPage } from './pages/ActionDetailPage';
import { PendingApprovalPage } from './pages/PendingApprovalPage';

function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <ToastProvider>
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
        </ToastProvider>
      </DemoProvider>
    </BrowserRouter>
  );
}

export default App;
