import React from 'react';

interface Dashboard3DProps {
  username?: string | undefined;
  token?: string | undefined;
}

const Dashboard3D: React.FC<Dashboard3DProps> = ({ username }) => {
  return (
    <div style={{ padding: 20, background: 'transparent' }}>
      <h3 style={{ color: '#e6eef8' }}>3D Dashboard (placeholder)</h3>
      <p style={{ color: '#cbd5e1' }}>Username: {username ?? 'not provided'}</p>
      <p style={{ color: '#94a3b8' }}>The full 3D dashboard module was not present during this build; this placeholder keeps the app buildable.</p>
    </div>
  );
};

export default Dashboard3D;
