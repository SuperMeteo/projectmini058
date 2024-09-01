'use client';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/alldata');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setItems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-info">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error: {error}</p>;

  return (
    <div className="container my-5 text-white">
      <h1 className="text-center mb-4 display-4">Sensor Data History</h1>
      <div className="table-responsive shadow-lg p-3 mb-5 bg-dark rounded">
        <table className="table table-hover table-bordered table-striped text-center">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>LDR</th>
              <th>VR</th>
              <th>Temperature</th>
              <th>Distance</th>
              <th>Create At</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.ldr}</td>
                <td>{item.vr}</td>
                <td>{item.temp}</td>
                <td>{item.distance}</td>
                <td>
                  {new Date(item.date).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok',
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
