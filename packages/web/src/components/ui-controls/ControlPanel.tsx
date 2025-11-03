/**
 * ControlPanel Component
 * Contains all UI controls for layer manipulation
 */

import { PositionInputs } from './PositionInputs';
import { LayerOrderButtons } from './LayerOrderButtons';
import { LayerList } from './LayerList';

export function ControlPanel() {
  return (
    <div className="control-panel">
      <h2>Controls</h2>
      <PositionInputs />
      <LayerOrderButtons />
      <LayerList />
    </div>
  );
}
