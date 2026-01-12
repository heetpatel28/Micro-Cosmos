import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div>
          <h2>Welcome, {user?.email}!</h2>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            You are successfully authenticated. This is a protected route.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

