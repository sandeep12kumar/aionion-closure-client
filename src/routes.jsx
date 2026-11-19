import { Navigate, Route, Routes } from 'react-router-dom';
import { useClosure } from './context/ClosureContext.jsx';
import { STEP_PATHS } from './utils/constants.js';
import { FullPageLoader } from './components/common/Loader.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Step1Request from './pages/Step1Request.jsx';
import Step2ClientInfo from './pages/Step2ClientInfo.jsx';
import Step3Documents from './pages/Step3Documents.jsx';
import Step4ESign from './pages/Step4ESign.jsx';
import Success from './pages/Success.jsx';
import EsignCallback from './pages/EsignCallback.jsx';
import NotFound from './pages/NotFound.jsx';

/** Logged-in users land on the furthest step they have unlocked. */
function PublicOnly({ children }) {
  const { session, loading } = useClosure();
  if (loading) return <FullPageLoader />;
  if (session) return <Navigate to={STEP_PATHS[session.currentStep] || STEP_PATHS[2]} replace />;
  return children;
}

/** Blocks a step until the previous ones are done; submitted requests only see /success. */
function RequireStep({ step, children }) {
  const { session, loading } = useClosure();
  if (loading) return <FullPageLoader />;
  if (!session) return <Navigate to="/" replace />;
  if (session.status === 'SUBMITTED' && step !== 5) return <Navigate to={STEP_PATHS[5]} replace />;
  if (session.currentStep < step) return <Navigate to={STEP_PATHS[session.currentStep]} replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<PublicOnly><Step1Request /></PublicOnly>} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/client-info" element={<RequireStep step={2}><Step2ClientInfo /></RequireStep>} />
        <Route path="/documents" element={<RequireStep step={3}><Step3Documents /></RequireStep>} />
        <Route path="/esign" element={<RequireStep step={4}><Step4ESign /></RequireStep>} />
        <Route path="/esign/callback" element={<RequireStep step={4}><EsignCallback /></RequireStep>} />
        <Route path="/success" element={<RequireStep step={5}><Success /></RequireStep>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
