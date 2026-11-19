import { Toaster } from 'react-hot-toast';
import { ClosureProvider } from './context/ClosureContext.jsx';
import AppRoutes from './routes.jsx';

export default function App() {
  return (
    <ClosureProvider>
      <AppRoutes />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px', borderRadius: '10px', maxWidth: '420px' },
          success: { iconTheme: { primary: '#0F766E', secondary: '#fff' } },
        }}
      />
    </ClosureProvider>
  );
}
