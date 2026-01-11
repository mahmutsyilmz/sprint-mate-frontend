import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts';
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
