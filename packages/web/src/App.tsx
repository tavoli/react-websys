import { useWasm } from './contexts/WasmContext';
import { useWasmMount } from './hooks/wasm/useWasmMount';
import { WasmContainer } from './components/wasm-containers/WasmContainer';
import { ControlPanel } from './components/ui-controls/ControlPanel';

function App() {
  const { status } = useWasm();
  const workspaceRef = useWasmMount('workspace');

  if (status === 'loading') {
    return <div>Loading WASM...</div>;
  }

  if (status === 'error') {
    return <div>Error loading WASM module</div>;
  }

  return (
    <div className="app-container">
      <WasmContainer
        ref={workspaceRef}
        mountType="workspace"
        className="workspace"
      />
      <ControlPanel />
    </div>
  );
}

export default App
