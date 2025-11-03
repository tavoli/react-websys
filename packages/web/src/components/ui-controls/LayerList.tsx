/**
 * LayerList Component
 * Displays list of layers for selection
 */

import { useWasm } from '../../contexts/WasmContext';

export function LayerList() {
  const { wasm, status } = useWasm();
  const layers = ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4', 'Layer 5'];

  const handleLayerClick = (index: number) => {
    if (wasm && wasm.select_layer && status === 'ready') {
      wasm.select_layer(index);
    }
  };

  return (
    <div>
      <h3>Layers</h3>
      <ul style={{ listStyle: 'none' }}>
        {layers.map((layer, index) => (
          <li
            key={index}
            onClick={() => handleLayerClick(index)}
            style={{
              padding: '8px',
              cursor: 'pointer',
              border: '1px solid #ccc',
              marginBottom: '4px'
            }}
          >
            {layer}
          </li>
        ))}
      </ul>
    </div>
  );
}
