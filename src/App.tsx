import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts';
import { ProtectedRoute, RoleSelectRoute } from './components';
import { Login } from './pages/Login';
import { RoleSelect } from './pages/RoleSelect';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast container with IDE styling */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#252526',
              color: '#cccccc',
              border: '1px solid #3e3e42',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              borderRadius: '4px',
            },
          }}
        />
        
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Role selection - requires auth but no role */}
          <Route 
            path="/role-select" 
            element={
              <RoleSelectRoute>
                <RoleSelect />
              </RoleSelectRoute>
            } 
          />
          
          {/* Dashboard - requires auth AND role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireRole>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
