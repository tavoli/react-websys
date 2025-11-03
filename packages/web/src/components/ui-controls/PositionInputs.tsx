/**
 * PositionInputs Component
 * X and Y position inputs for the selected layer
 */

import { useState } from 'react';
import { useWasm } from '../../contexts/WasmContext';

export function PositionInputs() {
  const [x, setX] = useState('0');
  const [y, setY] = useState('0');
  const { wasm, status } = useWasm();

  const handleXChange = (value: string) => {
    setX(value);
    if (wasm && wasm.update_selected_position && status === 'ready') {
      wasm.update_selected_position('x', parseInt(value) || 0);
    }
  };

  const handleYChange = (value: string) => {
    setY(value);
    if (wasm && wasm.update_selected_position && status === 'ready') {
      wasm.update_selected_position('y', parseInt(value) || 0);
    }
  };

  return (
    <div>
      <label>X Position</label>
      <input
        type="number"
        value={x}
        onChange={(e) => handleXChange(e.target.value)}
        data-wasm-sync="position-x"
      />
      <label>Y Position</label>
      <input
        type="number"
        value={y}
        onChange={(e) => handleYChange(e.target.value)}
        data-wasm-sync="position-y"
      />
    </div>
  );
}
