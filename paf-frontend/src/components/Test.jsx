import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Test() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);

  if (!user) return <div>Loading user info...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Your User ID: {user.userId}</p>
      {/* You can now use user.userId to create plans, etc. */}
    </div>
  );
}

export default Test;
