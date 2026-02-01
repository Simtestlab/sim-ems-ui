// src/components/MySankeyChart.jsx
// This component wraps the EnergyFlowGauge to display in the dashboard
import React from 'react';
import EnergyFlowGauge from './EnergyFlowGauge/EnergyFlowGauge';

const MySankeyChart = () => {
  // You can pass live telemetry data here if needed
  // For now using default/sample values
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <EnergyFlowGauge 
        solar={2.3}
        battery={4.1}
        grid={2.3}
        load={9.1}
        size={340}
      />
    </div>
  );
};

export default MySankeyChart;
