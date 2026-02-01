import EnergyFlowGauge from "./components/EnergyFlowGauge/EnergyFlowGauge";
import useLiveEnergy from './hooks/useLiveEnergy';

function App() {
  const live = useLiveEnergy();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-medium">Energy Dashboard</h1>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Energiemonitor</h2>
            <EnergyFlowGauge {...live} size={300} />
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default App;
