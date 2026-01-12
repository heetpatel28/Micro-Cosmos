import { useState, useEffect } from 'react';
import { api } from '../services/api';

const DashboardPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder API integration
  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace with actual API endpoint
      // const response = await api.get('/api/data');
      // setData(response.data);
      setData([]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. Connect this to your backend API.</p>
      
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No data available. Connect to your API endpoint.</p>
        ) : (
          <ul>
            {data.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

