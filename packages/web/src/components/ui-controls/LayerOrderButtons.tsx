/**
 * LayerOrderButtons Component
 * Controls for layer z-index ordering
 */

import { useWasm } from '../../contexts/WasmContext';

export function LayerOrderButtons() {
  const { wasm, status } = useWasm();

  const handleBringToFront = () => {
    if (wasm && wasm.bring_to_front && status === 'ready') {
      wasm.bring_to_front();
    }
  };

  const handleSendToBack = () => {
    if (wasm && wasm.send_to_back && status === 'ready') {
      wasm.send_to_back();
    }
  };

  return (
    <div>
      <button onClick={handleBringToFront}>Bring to Front</button>
      <button onClick={handleSendToBack}>Send to Back</button>
    </div>
  );
}
