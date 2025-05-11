'use client';

import { useEffect, useState } from 'react';

export default function TestConnection() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/test');
        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError('Failed to connect to backend');
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      {message && <p>Backend message: {message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
} 