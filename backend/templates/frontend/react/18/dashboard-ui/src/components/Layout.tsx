import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        background: '#1a1a1a',
        color: 'white',
        padding: '2rem 1rem'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>{{SERVICE_NAME}}</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

