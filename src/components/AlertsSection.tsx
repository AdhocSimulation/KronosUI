import React from 'react';

interface AlertsSectionProps {
  colorMode: 'light' | 'dark';
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ colorMode }) => {
  return (
    <div className={`${colorMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="text-xl font-bold mb-2">Alerts</h2>
      <p>Alerts functionality coming soon...</p>
    </div>
  );
};

export default AlertsSection;